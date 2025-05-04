const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const MediaAsset = require("../models/mediaAssetModel");
const { protect, authorize } = require("../middlewares/authMiddleware");
const {
  formatResponse,
  mapProductForResponse,
} = require("../utils/responseMappers");
const { productSchema } = require("../validation/productSchema");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { buildProductFilters } = require("../utils/buildProductFilters");

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

// ----------------------------------------
//               Public Routes
// ----------------------------------------

router.get("/", async (req, res, next) => {
  try {
    const isAuthenticated = !!req.user;
    const { page = 1, limit = 20 } = req.query;
    const filter = buildProductFilters(req.query, isAuthenticated);
    const skip = (Number(page) - 1) * Number(limit);

    const products = await Product.find(filter)
      .populate("category", "title slug")
      .populate("subcategory", "title slug")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await Product.countDocuments(filter);

    const mappedProducts = await Promise.all(
      products.map((product) =>
        mapProductForResponse(product, req.user, { groupMedia: false })
      )
    );

    res.json(
      formatResponse("success", "Products fetched", {
        total,
        page: Number(page),
        limit: Number(limit),
        items: mappedProducts,
      })
    );
  } catch (error) {
    console.error("[GET /products] Error:", error);
    next(error);
  }
});

router.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find({
      isSubcategory: false,
      "metadata.status": "active",
      scope: "product",
    }).lean();

    const categoriesWithMedia = await Promise.all(
      categories.map(async (category) => {
        const mediaAssets = await MediaAsset.find({
          owner: {
            $elemMatch: {
              type: "category",
              id: category._id,
            },
          },
        })
          .select("url type altText title")
          .lean();
        return { ...category, mediaAssets };
      })
    );

    res.json(
      formatResponse("success", "Top-level product categories fetched", {
        total: categories.length,
        items: categoriesWithMedia,
      })
    );
  } catch (error) {
    console.error("[GET /products/categories] Error:", error);
    res.status(500).json(formatResponse("error", "Server error"));
  }
});

router.get("/:categorySlug/subcategories", async (req, res) => {
  try {
    const parent = await Category.findOne({
      slug: req.params.categorySlug,
      isSubcategory: false,
      "metadata.status": "active",
      scope: "product",
    }).lean();

    if (!parent) {
      return res
        .status(404)
        .json(formatResponse("error", "Parent product category not found"));
    }

    const subcategories = await Category.find({
      parent: parent._id,
      isSubcategory: true,
      "metadata.status": "active",
      scope: "product",
    }).lean();

    const subcategoriesWithMedia = await Promise.all(
      subcategories.map(async (subcategory) => {
        const mediaAssets = await MediaAsset.find({
          owner: {
            $elemMatch: {
              type: "category",
              id: subcategory._id,
            },
          },
        })
          .select("url type altText title")
          .lean();
        return { ...subcategory, mediaAssets };
      })
    );

    res.json(
      formatResponse("success", "Subcategories fetched", {
        total: subcategories.length,
        items: subcategoriesWithMedia,
      })
    );
  } catch (error) {
    console.error("[GET /products/:categorySlug/subcategories] Error:", error);
    res.status(500).json(formatResponse("error", "Server error"));
  }
});

router.get("/:slug", async (req, res, next) => {
  try {
    const { slug } = req.params;
    const isAuthenticated = !!req.user;

    const filter = {
      slug,
      "metadata.status": "active",
    };
    if (!isAuthenticated) {
      filter["visibility.isPublic"] = true;
    }

    const product = await Product.findOne(filter)
      .populate("category", "title slug")
      .populate("subcategory", "title slug")
      .lean();

    if (!product) {
      return res.status(404).json(formatResponse("error", "Product not found"));
    }

    const mediaAssets = await MediaAsset.find({
      owner: {
        $elemMatch: {
          type: "product",
          id: product._id,
        },
      },
    })
      .select("url type title altText")
      .lean();

    product.mediaAssets = mediaAssets;

    const mappedProduct = await mapProductForResponse(product, req.user, {
      groupMedia: false,
    });
    res.json(formatResponse("success", "Product fetched", mappedProduct));
  } catch (error) {
    console.error("[GET /products/:slug] Error:", error);
    next(error);
  }
});

// ----------------------------------------
//               Private Routes
// ----------------------------------------

router.post(
  "/",
  protect,
  authorize("owner", ["superadmin", "admin"]),
  upload.array("files", 10),
  async (req, res, next) => {
    try {
      const parsedBody = { ...req.body };
      const fieldsToParse = [
        "description",
        "keyFeatures",
        "applications",
        "specifications",
        "approvals",
        "packaging",
        "compatibility",
        "compliance",
        "relatedProducts",
        "visibility",
        "metadata",
      ];
      fieldsToParse.forEach((field) => {
        if (parsedBody[field] && typeof parsedBody[field] === "string") {
          try {
            parsedBody[field] = JSON.parse(parsedBody[field]);
          } catch (e) {
            console.error(
              `Invalid JSON format for field '${field}':`,
              parsedBody[field]
            );
            throw new Error(`Invalid JSON format for ${field}`);
          }
        }
      });

      let rawMediaAssets = parsedBody.mediaAssets;
      let parsedMediaAssetsArray = [];
      if (rawMediaAssets) {
        let mediaAssetsString = "";
        if (Array.isArray(rawMediaAssets) && rawMediaAssets.length > 0) {
          mediaAssetsString = rawMediaAssets[rawMediaAssets.length - 1];
        } else if (typeof rawMediaAssets === "string") {
          mediaAssetsString = rawMediaAssets;
        }
        if (mediaAssetsString) {
          try {
            parsedMediaAssetsArray = JSON.parse(mediaAssetsString);
            if (!Array.isArray(parsedMediaAssetsArray)) {
              parsedMediaAssetsArray = [parsedMediaAssetsArray];
            }
          } catch (e) {
            console.error(
              "Failed to parse mediaAssets JSON string:",
              mediaAssetsString,
              e
            );
            throw new Error("Invalid JSON format for mediaAssets");
          }
        }
      }
      parsedBody.mediaAssets = parsedMediaAssetsArray;

      const { mediaAssets: _, ...otherData } = parsedBody;
      const productData = await productSchema
        .omit({ mediaAssets: true })
        .parseAsync(otherData);
      productData.mediaAssets = parsedBody.mediaAssets;

      const category = await Category.findById(productData.category);
      const subcategory = await Category.findById(productData.subcategory);
      if (!category || !subcategory) {
        throw new Error("Invalid category or subcategory ID");
      }
      if (subcategory.parent?.toString() !== productData.category) {
        throw new Error("Subcategory does not belong to category");
      }

      const mediaAssetsData = productData.mediaAssets || [];
      const files = req.files || [];
      if (mediaAssetsData.length !== files.length) {
        throw new Error(
          `Number of media asset metadata entries (${mediaAssetsData.length}) must match number of uploaded files (${files.length})`
        );
      }

      const mediaAssetIds = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const metadata = mediaAssetsData[i];
        if (!metadata) {
          throw new Error(
            `Missing metadata for file index ${i} (${file.originalname})`
          );
        }
        if (!metadata.type || typeof metadata.type !== "string") {
          throw new Error(`Invalid or missing 'type' for media asset ${i + 1}`);
        }
        if (!metadata.title || typeof metadata.title !== "string") {
          throw new Error(
            `Invalid or missing 'title' for media asset ${i + 1}`
          );
        }

        const mediaAsset = new MediaAsset({
          type: metadata.type,
          url: `/uploads/${file.filename}`,
          altText: metadata.altText || "",
          title: metadata.title,
          format: path
            .extname(file.originalname)
            .replace(".", "")
            .toLowerCase(),
          size: file.size,
          language: metadata.language || "en",
          access: metadata.access || "public",
          metadata: metadata.metadata || {},
          owner: [],
          tags: Array.isArray(metadata.tags) ? metadata.tags : [],
          status: "assigned",
        });

        await mediaAsset.save();
        mediaAssetIds.push(mediaAsset._id);
      }

      productData.mediaAssets = mediaAssetIds;
      const product = new Product(productData);
      await product.save();

      if (mediaAssetIds.length > 0) {
        await MediaAsset.updateMany(
          { _id: { $in: mediaAssetIds } },
          {
            $push: {
              owner: {
                type: "product",
                id: product._id,
              },
            },
            $set: {
              status: "assigned",
            },
          }
        );
      }

      const populatedProduct = await Product.findById(product._id)
        .populate("category", "title slug")
        .populate("subcategory", "title slug")
        .lean();

      const mediaAssets = await MediaAsset.find({
        owner: {
          $elemMatch: {
            type: "product",
            id: product._id,
          },
        },
      })
        .select("url type title altText")
        .lean();

      populatedProduct.mediaAssets = mediaAssets;

      const mappedProduct = await mapProductForResponse(
        populatedProduct,
        req.user
      );

      res.status(201).json(
        formatResponse("success", "Product and media assets created", {
          item: mappedProduct,
        })
      );
    } catch (error) {
      for (const file of req.files || []) {
        const filePath = path.join(__dirname, "..", "Uploads", file.filename);
        try {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } catch (unlinkError) {
          console.error(
            `Error cleaning up file ${file.filename}:`,
            unlinkError
          );
        }
      }

      console.error("[POST /products] Error:", error);
      if (error.name === "ValidationError" || error.name === "ZodError") {
        const message = error.errors
          ? JSON.stringify(error.errors)
          : error.message;
        return res.status(400).json(formatResponse("error", message));
      }
      res
        .status(500)
        .json(
          formatResponse(
            "error",
            "Server error processing product creation. " + error.message
          )
        );
    }
  }
);

// PATCH Route to update a product
router.patch(
  "/:id",
  protect,
  authorize("owner", ["superadmin", "admin"]),
  upload.array("files", 10),
  async (req, res, next) => {
    try {
      const { id } = req.params;

      const existingProduct = await Product.findById(id).lean();
      if (!existingProduct) {
        return res
          .status(404)
          .json(formatResponse("error", "Product not found"));
      }

      const parsedBody = { ...req.body };
      const fieldsToParse = [
        "description",
        "keyFeatures",
        "applications",
        "specifications",
        "approvals",
        "packaging",
        "compatibility",
        "compliance",
        "relatedProducts",
        "visibility",
        "metadata",
      ];
      fieldsToParse.forEach((field) => {
        if (parsedBody[field] && typeof parsedBody[field] === "string") {
          try {
            parsedBody[field] = JSON.parse(parsedBody[field]);
          } catch (e) {
            console.error(
              `Invalid JSON format for field '${field}':`,
              parsedBody[field]
            );
            throw new Error(`Invalid JSON format for ${field}`);
          }
        }
      });

      let parsedMediaAssetsArray = [];
      if (parsedBody.mediaAssets) {
        let mediaAssetsString = "";
        if (
          Array.isArray(parsedBody.mediaAssets) &&
          parsedBody.mediaAssets.length > 0
        ) {
          mediaAssetsString =
            parsedBody.mediaAssets[parsedBody.mediaAssets.length - 1];
        } else if (typeof parsedBody.mediaAssets === "string") {
          mediaAssetsString = parsedBody.mediaAssets;
        }
        if (mediaAssetsString) {
          try {
            parsedMediaAssetsArray = JSON.parse(mediaAssetsString);
            if (!Array.isArray(parsedMediaAssetsArray)) {
              parsedMediaAssetsArray = [parsedMediaAssetsArray];
            }
          } catch (e) {
            console.error(
              "Failed to parse mediaAssets JSON string:",
              mediaAssetsString,
              e
            );
            throw new Error("Invalid JSON format for mediaAssets");
          }
        }
      }
      parsedBody.mediaAssets = parsedMediaAssetsArray;

      let deleteMediaAssetIds = [];
      if (parsedBody.deleteMediaAssetIds) {
        try {
          deleteMediaAssetIds = Array.isArray(parsedBody.deleteMediaAssetIds)
            ? parsedBody.deleteMediaAssetIds
            : JSON.parse(parsedBody.deleteMediaAssetIds);
        } catch (e) {
          throw new Error("Invalid JSON format for deleteMediaAssetIds");
        }
      }

      const {
        mediaAssets: _,
        deleteMediaAssetIds: __,
        ...otherData
      } = parsedBody;
      const productData = await productSchema
        .omit({ mediaAssets: true })
        .partial()
        .parseAsync(otherData);

      if (productData.category || productData.subcategory) {
        const category = await Category.findById(
          productData.category || existingProduct.category
        );
        const subcategory = await Category.findById(
          productData.subcategory || existingProduct.subcategory
        );
        if (!category || !subcategory) {
          throw new Error("Invalid category or subcategory ID");
        }
        if (
          subcategory.parent?.toString() !==
          (productData.category || existingProduct.category).toString()
        ) {
          throw new Error("Subcategory does not belong to category");
        }
        productData.category = category._id;
        productData.subcategory = subcategory._id;
      }

      const mediaAssetsData = parsedBody.mediaAssets || [];
      const files = req.files || [];
      if (mediaAssetsData.length !== files.length) {
        throw new Error(
          `Number of media asset metadata entries (${mediaAssetsData.length}) must match number of uploaded files (${files.length})`
        );
      }

      let mediaAssetIds = existingProduct.mediaAssets
        .map((asset) => asset.toString())
        .filter((id) => !deleteMediaAssetIds.includes(id));

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const metadata = mediaAssetsData[i];
        if (!metadata) {
          throw new Error(
            `Missing metadata for file index ${i} (${file.originalname})`
          );
        }
        if (!metadata.type || typeof metadata.type !== "string") {
          throw new Error(`Invalid or missing 'type' for media asset ${i + 1}`);
        }
        if (!metadata.title || typeof metadata.title !== "string") {
          throw new Error(
            `Invalid or missing 'title' for media asset ${i + 1}`
          );
        }

        const mediaAsset = new MediaAsset({
          type: metadata.type,
          url: `/uploads/${file.filename}`,
          altText: metadata.altText || "",
          title: metadata.title,
          format: path
            .extname(file.originalname)
            .replace(".", "")
            .toLowerCase(),
          size: file.size,
          language: metadata.language || "en",
          access: metadata.access || "public",
          metadata: metadata.metadata || {},
          owner: [],
          tags: Array.isArray(metadata.tags) ? metadata.tags : [],
          status: "assigned",
        });

        await mediaAsset.save();
        mediaAssetIds.push(mediaAsset._id);
      }

      if (deleteMediaAssetIds.length > 0) {
        const assetsToDelete = await MediaAsset.find({
          _id: { $in: deleteMediaAssetIds },
        });
        for (const asset of assetsToDelete) {
          const filePath = path.join(
            __dirname,
            "..",
            "Uploads",
            path.basename(asset.url)
          );
          try {
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
          } catch (unlinkError) {
            console.error(
              `Error deleting file ${path.basename(asset.url)}:`,
              unlinkError
            );
          }
          asset.owner = asset.owner.filter(
            (own) => !(own.type === "product" && own.id.toString() === id)
          );
          asset.status = asset.owner.length > 0 ? "assigned" : "orphaned";
          if (asset.status === "orphaned") {
            await MediaAsset.deleteOne({ _id: asset._id });
          } else {
            await asset.save();
          }
        }
      }

      productData.mediaAssets = mediaAssetIds;
      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { $set: productData },
        { new: true }
      )
        .populate("category", "title slug")
        .populate("subcategory", "title slug")
        .lean();

      if (!updatedProduct) {
        throw new Error("Failed to update product");
      }

      const mediaAssets = await MediaAsset.find({
        owner: {
          $elemMatch: {
            type: "product",
            id: updatedProduct._id,
          },
        },
      })
        .select("url type title altText")
        .lean();

      updatedProduct.mediaAssets = mediaAssets;

      if (mediaAssetIds.length > 0) {
        await MediaAsset.updateMany(
          { _id: { $in: mediaAssetIds } },
          {
            $push: {
              owner: {
                type: "product",
                id: updatedProduct._id,
              },
            },
            $set: {
              status: "assigned",
            },
          }
        );
      }

      const mappedProduct = await mapProductForResponse(
        updatedProduct,
        req.user
      );
      res.json(
        formatResponse("success", "Product updated", { item: mappedProduct })
      );
    } catch (error) {
      for (const file of req.files || []) {
        const filePath = path.join(__dirname, "..", "Uploads", file.filename);
        try {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } catch (unlinkError) {
          console.error(
            `Error cleaning up file ${file.filename}:`,
            unlinkError
          );
        }
      }

      console.error("[PATCH /products/:id] Error:", error);
      if (error.name === "ValidationError" || error.name === "ZodError") {
        const message = error.errors
          ? JSON.stringify(error.errors)
          : error.message;
        return res.status(400).json(formatResponse("error", message));
      }
      res
        .status(500)
        .json(
          formatResponse(
            "error",
            "Server error processing product update. " + error.message
          )
        );
    }
  }
);

// DELETE Route to delete a product
router.delete(
  "/:id",
  protect,
  authorize("owner", ["superadmin"]),
  async (req, res, next) => {
    try {
      const { id } = req.params;

      const product = await Product.findById(id).lean();
      if (!product) {
        return res
          .status(404)
          .json(formatResponse("error", "Product not found"));
      }

      if (product.mediaAssets && product.mediaAssets.length > 0) {
        const mediaAssets = await MediaAsset.find({
          owner: {
            $elemMatch: {
              type: "product",
              id: product._id,
            },
          },
        });
        for (const asset of mediaAssets) {
          const filePath = path.join(
            __dirname,
            "..",
            "Uploads",
            path.basename(asset.url)
          );
          try {
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
          } catch (unlinkError) {
            console.error(
              `Error deleting file ${path.basename(asset.url)}:`,
              unlinkError
            );
          }
          asset.owner = asset.owner.filter(
            (own) => !(own.type === "product" && own.id.toString() === id)
          );
          asset.status = asset.owner.length > 0 ? "assigned" : "orphaned";
          if (asset.status === "orphaned") {
            await MediaAsset.deleteOne({ _id: asset._id });
          } else {
            await asset.save();
          }
        }
      }

      await Product.findByIdAndDelete(id);

      res.json(
        formatResponse(
          "success",
          "Product and associated media assets deleted",
          { success: true }
        )
      );
    } catch (error) {
      console.error("[DELETE /products/:id] Error:", error);
      res
        .status(500)
        .json(
          formatResponse(
            "error",
            "Server error processing product deletion. " + error.message
          )
        );
    }
  }
);

module.exports = router;
