const express = require("express");
const router = express.Router();
const multer = require("multer");
const mongoose = require("mongoose");
const MediaAsset = require("../models/mediaAssetModel");
const { formatResponse } = require("../utils/responseMappers");
const { protect, authorize } = require("../middlewares/authMiddleware");
const { groupMediaAssets } = require("../utils/groupMediaAssets");
const path = require("path");
const fs = require("fs");

// Allowed extensions
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
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (allowedTypesRegex.test(path.extname(file.originalname)))
      return cb(null, true);
    cb(new Error("Unsupported file type"));
  },
});
// Upload Media
router.post(
  "/upload",
  protect,
  authorize("owner", ["superadmin", "admin"]),
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json(formatResponse("error", "No file uploaded"));
      }

      const parsedMetadata =
        typeof req.body.metadata === "string"
          ? JSON.parse(req.body.metadata)
          : req.body.metadata;
      const parsedOwner =
        typeof req.body.owner === "string"
          ? JSON.parse(req.body.owner)
          : req.body.owner;
      const parsedTags =
        typeof req.body.tags === "string"
          ? JSON.parse(req.body.tags)
          : req.body.tags;

      const mediaAsset = new MediaAsset({
        type: req.body.type || "document",
        url: `/uploads/${req.file.filename}`,
        altText: req.body.altText || "",
        title: req.body.title || req.file.originalname,
        format: path.extname(req.file.originalname).replace(".", ""),
        size: req.file.size,
        language: req.body.language || "en",
        access: req.body.access || "public",
        metadata: parsedMetadata || {},
        owner: parsedOwner || { type: "orphaned", id: null },
        tags: parsedTags || [],
        status: "orphaned",
      });

      await mediaAsset.save();

      res
        .status(201)
        .json(
          formatResponse("success", "Media uploaded", { item: mediaAsset })
        );
    } catch (err) {
      console.error("[POST /media/upload] Error:", err);
      res.status(500).json(formatResponse("error", "Server error"));
    }
  }
);

// Get All Media (Filterable)
router.get("/", async (req, res) => {
  try {
    const {
      type,
      access,
      language,
      ownerType,
      ownerId,
      status = "assigned",
      page = 1,
      limit = 20,
    } = req.query;

    const filter = {};

    if (type) filter.type = type;
    if (access) filter.access = access;
    if (language) filter.language = language;
    if (ownerType && ownerId) {
      filter["owner.type"] = ownerType;
      filter["owner.id"] = ownerId;
    }
    if (status) filter.status = status;

    const pageNum = Math.max(parseInt(page), 1);
    const limitNum = Math.min(Math.max(parseInt(limit), 1), 100);

    const mediaAssets = await MediaAsset.find(filter)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean();

    const total = await MediaAsset.countDocuments(filter);

    res.json(
      formatResponse("success", "Media assets fetched", {
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum),
        items: mediaAssets,
      })
    );
  } catch (err) {
    console.error("[GET /media] Error:", err);
    res.status(500).json(formatResponse("error", "Server error"));
  }
});

// Get Single Media
router.get("/:id", async (req, res) => {
  try {
    const media = await MediaAsset.findById(req.params.id).lean();
    if (!media) {
      return res.status(404).json(formatResponse("error", "Media not found"));
    }

    res.json(formatResponse("success", "Media fetched", { item: media }));
  } catch (err) {
    console.error("[GET /media/:id] Error:", err);
    res.status(500).json(formatResponse("error", "Server error"));
  }
});

// Update Media Metadata (safe fields only)
router.put(
  "/:id",
  protect,
  authorize("owner", ["superadmin", "admin"]),
  async (req, res) => {
    try {
      const { error } = validateMediaAssetUpdate(req.body);
      if (error) {
        return res
          .status(400)
          .json(formatResponse("error", error.details[0].message));
      }

      const media = await MediaAsset.findById(req.params.id);
      if (!media) {
        return res.status(404).json(formatResponse("error", "Media not found"));
      }

      const allowedFields = [
        "type",
        "title",
        "altText",
        "language",
        "access",
        "tags",
        "metadata",
      ];

      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          media[field] = req.body[field];
        }
      }

      await media.save();

      res.json(formatResponse("success", "Media updated", { item: media }));
    } catch (err) {
      console.error("[PUT /media/:id] Error:", err);
      res.status(500).json(formatResponse("error", "Server error"));
    }
  }
);

// Delete Media (Physical file + DB record)
router.delete(
  "/:id",
  protect,
  authorize("owner", ["superadmin", "admin"]),
  async (req, res) => {
    try {
      const media = await MediaAsset.findById(req.params.id);
      if (!media) {
        return res.status(404).json(formatResponse("error", "Media not found"));
      }

      // Remove file from disk
      const filePath = path.join(__dirname, "../", media.url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      await media.remove();

      res.json(formatResponse("success", "Media deleted successfully"));
    } catch (err) {
      console.error("[DELETE /media/:id] Error:", err);
      res.status(500).json(formatResponse("error", "Server error"));
    }
  }
);

// Group Media Assets (For frontend)
router.get("/grouped/all", async (req, res) => {
  try {
    const mediaAssets = await MediaAsset.find().lean();
    const grouped = groupMediaAssets(mediaAssets);

    res.json(
      formatResponse("success", "Grouped media assets fetched", grouped)
    );
  } catch (err) {
    console.error("[GET /media/grouped/all] Error:", err);
    res.status(500).json(formatResponse("error", "Server error"));
  }
});

router.patch(
  "/:id/replace-file",
  protect,
  authorize("owner", ["superadmin", "admin"]),
  upload.single("file"),
  async (req, res) => {
    try {
      const media = await MediaAsset.findById(req.params.id);
      if (!media) {
        return res.status(404).json(formatResponse("error", "Media not found"));
      }

      if (!req.file) {
        return res
          .status(400)
          .json(formatResponse("error", "No new file uploaded"));
      }

      // ✅ Delete old file from disk
      const oldFilePath = path.join(__dirname, "../", media.url);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }

      // ✅ Update file info
      media.url = `/uploads/${req.file.filename}`;
      media.size = req.file.size;
      media.format = path
        .extname(req.file.originalname)
        .replace(".", "")
        .toLowerCase();
      media.updatedAt = new Date(); // Refresh update timestamp

      await media.save();

      res.json(
        formatResponse("success", "Media file replaced", { item: media })
      );
    } catch (err) {
      console.error("[PATCH /media/:id/replace-file] Error:", err);
      res.status(500).json(formatResponse("error", "Server error"));
    }
  }
);

module.exports = router;
