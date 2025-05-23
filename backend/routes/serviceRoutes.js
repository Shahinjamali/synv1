// Updated: src/routes/serviceRoutes.js
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Service = require("../models/serviceModel");
const Category = require("../models/categoryModel");
const MediaAsset = require("../models/mediaAssetModel");
const { protect, authorize } = require("../middlewares/authMiddleware");
const CaseStudy = require("../models/caseStudyModel");
const { groupMediaAssets } = require("../utils/groupMediaAssets");

const {
  formatResponse,
  mapServiceForResponse,
} = require("../utils/responseMappers");
const { serviceSchema } = require("../validation/serviceSchema");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

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
// @desc    Get all Services
// @route   GET /api/services
// @access  Public / Authenticated

// GET all services
router.get("/", async (req, res) => {
  try {
    const {
      categorySlug,
      status = "active",
      scope,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = { "metadata.status": status };

    if (scope) {
      const categoryIds = await Category.find({ scope }, "_id");
      filter.category = { $in: categoryIds.map((cat) => cat._id) };
    }

    if (categorySlug) {
      filter.categorySlug = categorySlug;
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const services = await Service.find(filter)
      .populate("category", "title slug")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await Service.countDocuments(filter);

    const servicesWithMedia = await Promise.all(
      services.map(async (service) => {
        const mediaAssets = await MediaAsset.find({
          owner: {
            $elemMatch: {
              type: "service",
              id: service._id,
            },
          },
        })
          .select("url type title altText")
          .lean();
        return { ...service, mediaAssets };
      })
    );

    const mappedServices = await Promise.all(
      servicesWithMedia.map((s) => mapServiceForResponse(s, req.user))
    );

    res.json(
      formatResponse("success", "Services fetched", {
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum),
        items: mappedServices,
      })
    );
  } catch (err) {
    console.error("[GET /services] Error:", err);
    res.status(500).json(formatResponse("error", "Server error"));
  }
});

router.get("/:slug", async (req, res) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug })
      .populate("category", "title slug")
      .lean();

    if (!service) {
      return res.status(404).json(formatResponse("error", "Service not found"));
    }

    const mediaAssets = await MediaAsset.find({
      owner: {
        $elemMatch: {
          type: "service",
          id: service._id,
        },
      },
    })
      .select("url type title altText")
      .lean();

    service.mediaAssets = mediaAssets;

    const mappedService = await mapServiceForResponse(service, req.user);

    res.json(formatResponse("success", "Service fetched", mappedService));
  } catch (err) {
    console.error("[GET /services/:slug] Error:", err);
    res.status(500).json(formatResponse("error", "Server error"));
  }
});
// ----------------------------------------
//               protected Routes
// ----------------------------------------
// @desc    Get all Services
// @route   GET /api/services
// @access  Public / Authenticated

// routes/serviceRoutes.js (partial update to POST /services)
router.post(
  "/",
  protect,
  authorize("owner", ["superadmin", "admin"]),
  upload.array("files", 10),
  async (req, res) => {
    try {
      const parsedBody = { ...req.body };

      const fieldsToParse = [
        "description",
        "keyBenefits",
        "deliverables",
        "serviceLevels",
        "parametersMonitored",
        "technologyUsed",
        "reportingDetails",
        "applicableIndustries",
        "applicableEquipment",
        "prerequisites",
        "visibility",
        "metadata",
      ];

      for (const field of fieldsToParse) {
        if (typeof parsedBody[field] === "string") {
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
      }

      let mediaAssetsArray = [];
      const rawMediaAssets = parsedBody.mediaAssets;

      if (rawMediaAssets) {
        try {
          let mediaAssetsString = "";

          if (Array.isArray(rawMediaAssets)) {
            mediaAssetsString = rawMediaAssets[rawMediaAssets.length - 1];
          } else if (typeof rawMediaAssets === "string") {
            mediaAssetsString = rawMediaAssets;
          }

          if (mediaAssetsString) {
            mediaAssetsArray = JSON.parse(mediaAssetsString);
            if (!Array.isArray(mediaAssetsArray)) {
              console.warn(
                "[WARN] Parsed mediaAssets is not array, wrapping it"
              );
              mediaAssetsArray = [mediaAssetsArray];
            }
          }
        } catch (e) {
          console.error(
            "Failed to parse mediaAssets JSON string:",
            rawMediaAssets,
            e
          );
          throw new Error("Invalid JSON format for mediaAssets");
        }
      }

      parsedBody.mediaAssets = mediaAssetsArray;

      const { mediaAssets: _, ...rest } = parsedBody;
      const serviceData = await serviceSchema
        .omit({ mediaAssets: true })
        .parseAsync(rest);

      serviceData.mediaAssets = mediaAssetsArray;

      const category = await Category.findById(serviceData.category);
      if (!category) {
        throw new Error("Invalid category ID");
      }

      const files = req.files || [];
      if (serviceData.mediaAssets.length !== files.length) {
        throw new Error(
          `Number of media asset metadata entries (${serviceData.mediaAssets.length}) must match number of uploaded files (${files.length})`
        );
      }

      const mediaAssetIds = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const metadata = serviceData.mediaAssets[i];

        if (!metadata || typeof metadata !== "object") {
          throw new Error(
            `Missing or invalid metadata for media asset at index ${i}`
          );
        }

        if (!metadata.type || !metadata.title) {
          throw new Error(`Missing required fields in media asset ${i + 1}`);
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

      serviceData.mediaAssets = mediaAssetIds;
      const service = new Service(serviceData);
      await service.save();

      await MediaAsset.updateMany(
        { _id: { $in: mediaAssetIds } },
        {
          $push: {
            owner: {
              type: "service",
              id: service._id,
            },
          },
          $set: {
            status: "assigned",
          },
        }
      );

      const populatedService = await Service.findById(service._id)
        .populate("category", "title slug")
        .lean();

      const mediaAssets = await MediaAsset.find({
        owner: {
          $elemMatch: {
            type: "service",
            id: service._id,
          },
        },
      })
        .select("url type title altText")
        .lean();

      populatedService.mediaAssets = mediaAssets;

      const mappedService = await mapServiceForResponse(
        populatedService,
        req.user
      );

      return res
        .status(201)
        .json(
          formatResponse("success", "Created service", { item: mappedService })
        );
    } catch (error) {
      for (const file of req.files || []) {
        const filePath = path.join(__dirname, "..", "uploads", file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      const isZodError = error.name === "ZodError";
      const message =
        isZodError && error.errors
          ? JSON.stringify(error.errors)
          : error.message;

      console.error("[POST /services] Error:", message);
      return res
        .status(isZodError ? 400 : 500)
        .json(formatResponse("error", message));
    }
  }
);

// PUT update service
router.patch(
  "/:slug",
  protect,
  authorize("owner", ["superadmin", "admin"]),
  async (req, res) => {
    try {
      const updates = req.body;

      const service = await Service.findOne({ slug: req.params.slug });
      if (!service) {
        return res
          .status(404)
          .json(formatResponse("error", "Service not found"));
      }

      if (updates.slug && updates.slug.toLowerCase() !== service.slug) {
        const existing = await Service.findOne({
          slug: updates.slug.toLowerCase(),
        });
        if (existing) {
          return res
            .status(400)
            .json(formatResponse("error", "Slug already in use"));
        }
        updates.slug = updates.slug.toLowerCase();
      }

      if (updates.category) {
        const category = await Category.findById(updates.category);
        if (!category) {
          return res
            .status(400)
            .json(formatResponse("error", "Invalid category ID"));
        }

        if (updates.categorySlug && category.slug !== updates.categorySlug) {
          return res
            .status(400)
            .json(
              formatResponse(
                "error",
                "Category slug does not match category ID"
              )
            );
        }
      }

      if (updates.mediaAssets?.length > 0) {
        const validMediaAssets = await MediaAsset.find({
          _id: { $in: updates.mediaAssets },
        });
        if (validMediaAssets.length !== updates.mediaAssets.length) {
          return res
            .status(400)
            .json(
              formatResponse("error", "One or more media asset IDs are invalid")
            );
        }

        await MediaAsset.updateMany(
          { _id: { $in: updates.mediaAssets } },
          {
            $push: {
              owner: {
                type: "service",
                id: service._id,
              },
            },
            $set: {
              status: "assigned",
            },
          }
        );
      }

      if (updates.metadata?.relatedCaseStudies?.length > 0) {
        for (const id of updates.metadata.relatedCaseStudies) {
          if (!mongoose.Types.ObjectId.isValid(id)) {
            return res
              .status(400)
              .json(formatResponse("error", `Invalid case study ID: ${id}`));
          }
        }
      }

      if (updates.metadata?.relatedservices?.length > 0) {
        for (const id of updates.metadata.relatedservices) {
          if (!mongoose.Types.ObjectId.isValid(id)) {
            return res
              .status(400)
              .json(formatResponse("error", `Invalid service ID: ${id}`));
          }
        }
        const validservices = await Service.find({
          _id: { $in: updates.metadata.relatedservices },
        });
        if (validservices.length !== updates.metadata.relatedservices.length) {
          return res
            .status(400)
            .json(
              formatResponse("error", "One or more service IDs are invalid")
            );
        }
      }

      Object.assign(service, updates);
      const savedService = await service.save();

      const mediaAssets = await MediaAsset.find({
        owner: {
          $elemMatch: {
            type: "service",
            id: savedService._id,
          },
        },
      })
        .select("url type title altText")
        .lean();

      savedService.mediaAssets = mediaAssets;

      res.json(
        formatResponse("success", "Service updated", { item: savedService })
      );
    } catch (err) {
      console.error("[PATCH /services/:slug] Error:", err);
      if (err.name === "ValidationError") {
        return res.status(400).json(formatResponse("error", err.message));
      }
      res.status(500).json(formatResponse("error", "Server error"));
    }
  }
);

// DELETE service
router.delete(
  "/:slug",
  protect,
  authorize("owner", ["superadmin", "admin"]),
  async (req, res) => {
    try {
      const service = await Service.findOne({ slug: req.params.slug });

      if (!service) {
        return res
          .status(404)
          .json(formatResponse("error", "Service not found"));
      }

      service.metadata.status = "archived";
      await service.save();

      const mediaAssets = await MediaAsset.find({
        owner: {
          $elemMatch: {
            type: "service",
            id: service._id,
          },
        },
      });

      for (const asset of mediaAssets) {
        asset.owner = asset.owner.filter(
          (own) =>
            !(
              own.type === "service" &&
              own.id.toString() === service._id.toString()
            )
        );
        asset.status = asset.owner.length > 0 ? "assigned" : "orphaned";
        await asset.save();
      }

      service.mediaAssets = [];
      await service.save();

      res.json(formatResponse("success", "Service archived successfully"));
    } catch (err) {
      console.error("[DELETE /services/:slug] Error:", err);
      res.status(500).json(formatResponse("error", "Server error"));
    }
  }
);

module.exports = router;
