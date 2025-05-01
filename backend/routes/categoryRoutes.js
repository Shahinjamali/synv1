// src/routes/categoryRoutes.js
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Category = require("../models/categoryModel");
const MediaAsset = require("../models/mediaAssetModel");
const { protect, authorize } = require("../middlewares/authMiddleware");

const { categorySchema } = require("../validation/categorySchema");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { formatResponse } = require("../utils/responseMappers");

// Standard API Response
const apiResponse = (success, data = null, error = null) => ({
  success,
  data,
  error,
});

// ----------------------------------------
//              Multer setup for multiple file uploads
// ----------------------------------------

const allowedExtensions = [
  "jpg",
  "jpeg",
  "png",
  "webp",
  "svg",
  "pdf",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "ppt",
  "pptx",
  "mp4",
  "avi",
  "mov",
  "wmv",
  "webm",
  "zip",
  "rar",
];
const allowedTypesRegex = new RegExp(
  `\\.(${allowedExtensions.join("|")})$`,
  "i"
);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname).toLowerCase());
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: (req, file, cb) => {
    if (allowedTypesRegex.test(path.extname(file.originalname))) {
      return cb(null, true);
    }
    cb(new Error("Unsupported file type"));
  },
});

//--------------------------------------
// GET /api/categories
// Fetch all categories (optional filters)
//--------------------------------------
router.get("/", async (req, res) => {
  try {
    const { scope, isSubcategory, parentSlug } = req.query;
    const filter = { "metadata.status": { $in: ["active", "draft"] } };

    if (scope) filter.scope = scope;
    if (isSubcategory !== undefined)
      filter.isSubcategory = isSubcategory === "true";
    if (parentSlug) filter.parentSlug = parentSlug;

    const categories = await Category.find(filter)
      .select("title subtitle slug scope isSubcategory parent parentSlug _id")
      .lean();

    res.json(apiResponse(true, categories));
  } catch (error) {
    console.error("[GET /categories] Error:", error);
    res
      .status(500)
      .json(apiResponse(false, null, "Failed to fetch categories"));
  }
});

//--------------------------------------
// GET /api/categories/:id
// Fetch category by ID
//--------------------------------------
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json(apiResponse(false, null, "Invalid category ID"));
    }

    const category = await Category.findById(id)
      .populate("mediaAssets", "url type title altText")
      .lean();

    if (!category) {
      return res
        .status(404)
        .json(apiResponse(false, null, "Category not found"));
    }

    res.json(apiResponse(true, category));
  } catch (error) {
    console.error("[GET /categories/:id] Error:", error);
    res.status(500).json(apiResponse(false, null, "Failed to fetch category"));
  }
});

//--------------------------------------
// GET /api/categories/:categoryId/subcategories
//--------------------------------------
router.get("/:categoryId/subcategories", async (req, res) => {
  try {
    const { categoryId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res
        .status(400)
        .json(apiResponse(false, null, "Invalid category ID"));
    }

    const subcategories = await Category.find({
      parent: categoryId,
      isSubcategory: true,
      "metadata.status": { $in: ["active", "draft"] },
    })
      .select("title slug")
      .lean();

    res.json(apiResponse(true, subcategories));
  } catch (error) {
    console.error("[GET /categories/:categoryId/subcategories] Error:", error);
    res
      .status(500)
      .json(apiResponse(false, null, "Failed to fetch subcategories"));
  }
});

//--------------------------------------
// GET /api/categories/slug/:slug
//--------------------------------------
router.get("/slug/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ slug })
      .populate("mediaAssets", "url type title altText")
      .lean();

    if (!category) {
      return res
        .status(404)
        .json(apiResponse(false, null, "Category not found"));
    }

    res.json(apiResponse(true, category));
  } catch (error) {
    console.error("[GET /categories/slug/:slug] Error:", error);
    res.status(500).json(apiResponse(false, null, "Failed to fetch category"));
  }
});

// ----------------------------------------
//               Private Routes
// ----------------------------------------

router.post(
  "/",
  upload.array("files"),
  protect,
  authorize("owner", ["superadmin", "admin"]),
  async (req, res) => {
    try {
      console.log("[DEBUG] Incoming req.body:", req.body);

      const parsedBody = { ...req.body };

      const fieldsToParse = [
        "description",
        "visibility",
        "metadata",
        "mediaAssets",
      ];

      fieldsToParse.forEach((field) => {
        if (parsedBody[field] && typeof parsedBody[field] === "string") {
          try {
            parsedBody[field] = JSON.parse(parsedBody[field]);
          } catch (e) {
            console.error(
              `Invalid JSON for field '${field}':`,
              parsedBody[field]
            );
            throw new Error(`Invalid JSON format for ${field}`);
          }
        }
      });

      // ✅ Always ensure boolean field from FormData
      parsedBody.isSubcategory = parsedBody.isSubcategory === "true";
      // Safely extract base schema (ZodObject)
      const baseCategorySchema = categorySchema._def?.schema ?? categorySchema;

      const { mediaAssets: _, ...coreData } = parsedBody;

      const categoryData = await baseCategorySchema
        .omit({ mediaAssets: true })
        .parseAsync(coreData);

      const files = req.files || [];
      const mediaAssetsData = parsedBody.mediaAssets || [];

      if (mediaAssetsData.length !== files.length) {
        throw new Error(
          `Number of media asset metadata entries (${mediaAssetsData.length}) must match number of uploaded files (${files.length})`
        );
      }

      const mediaAssetIds = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const metadata = mediaAssetsData[i];

        const media = new MediaAsset({
          type: metadata.type,
          title: metadata.title,
          altText: metadata.altText || "",
          description: metadata.description || "",
          url: `/uploads/${file.filename}`,
          format: path.extname(file.originalname).slice(1),
          size: file.size,
          language: metadata.language || "en",
          access: metadata.access || "public",
          restrictedRoles: metadata.restrictedRoles || [],
          metadata: metadata.metadata || {},
          tags: metadata.tags || [],
          status: "assigned",
          owner: {
            type: "category",
            id: null,
          },
        });

        await media.save();
        mediaAssetIds.push(media._id);
      }

      categoryData.mediaAssets = mediaAssetIds;

      const category = new Category(categoryData);
      await category.save();

      if (mediaAssetIds.length > 0) {
        await MediaAsset.updateMany(
          { _id: { $in: mediaAssetIds } },
          {
            $set: {
              "owner.type": "category",
              "owner.id": category._id,
              status: "assigned",
            },
          }
        );
      }

      const populatedCategory = await Category.findById(category._id)
        .populate("mediaAssets", "url type title altText")
        .lean();

      res.status(201).json(
        formatResponse("success", "Category created successfully", {
          item: populatedCategory,
        })
      );
    } catch (error) {
      for (const file of req.files || []) {
        const filePath = path.join(__dirname, "..", "uploads", file.filename);
        try {
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        } catch (unlinkErr) {
          console.error("Error cleaning up file:", unlinkErr);
        }
      }

      console.error("[POST /categories] Error:", error);
      const message =
        error?.name === "ZodError"
          ? JSON.stringify(error.errors)
          : error.message || "Server error";
      res.status(500).json(formatResponse("error", message));
    }
  }
);

//--------------------------------------
// PATCH /api/categories/:id
// Update Category
//--------------------------------------
router.patch(
  "/:id",
  protect,
  authorize("owner", ["superadmin", "admin"]),
  async (req, res) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res
          .status(400)
          .json(apiResponse(false, null, "Invalid category ID"));
      }

      const updated = await Category.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!updated) {
        return res
          .status(404)
          .json(apiResponse(false, null, "Category not found"));
      }

      res.json(apiResponse(true, updated));
    } catch (error) {
      console.error("[PATCH /categories/:id] Error:", error);
      res
        .status(500)
        .json(apiResponse(false, null, "Failed to update category"));
    }
  }
);

//--------------------------------------
// DELETE /api/categories/:id
// Soft Delete Category
//--------------------------------------
router.delete(
  "/:id",
  protect,
  authorize("owner", ["superadmin", "admin"]),
  async (req, res) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res
          .status(400)
          .json(apiResponse(false, null, "Invalid category ID"));
      }

      const category = await Category.findByIdAndUpdate(
        id,
        { "metadata.status": "archived" },
        { new: true }
      );

      if (!category) {
        return res
          .status(404)
          .json(apiResponse(false, null, "Category not found"));
      }

      res.json(apiResponse(true, { deleted: true }));
    } catch (error) {
      console.error("[DELETE /categories/:id] Error:", error);
      res
        .status(500)
        .json(apiResponse(false, null, "Failed to delete category"));
    }
  }
);

module.exports = router;
