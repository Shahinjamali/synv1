// Updated: src/routes/serviceRoutes.js
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Service = require("../models/serviceModel");
const { protect, authorize } = require("../middlewares/authMiddleware");
const MediaAsset = require("../models/mediaAssetModel");
const Category = require("../models/categoryModel");

const formatResponse = (status, message, data = null) => ({
  status,
  message,
  data,
});

// GET all services
router.get("/", async (req, res) => {
  try {
    const {
      categorySlug,
      status = "active",
      scope, // 👈 new param to support service/product filtering
      page = 1,
      limit = 10,
    } = req.query;

    const filter = { "metadata.status": status };

    // Filter by scope (e.g., 'service')
    if (scope) {
      const categoryIds = await Category.find({ scope }, "_id");
      filter.category = { $in: categoryIds.map((cat) => cat._id) };
    }

    // Filter by categorySlug if provided (overrides scope-based filtering if both present)
    if (categorySlug) {
      filter.categorySlug = categorySlug;
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const services = await Service.find(filter)
      .populate("category", "title slug")
      .skip(skip)
      .limit(limitNum)
      .lean();

    const serviceIds = services.map((s) => s._id);
    const allMedia = await MediaAsset.find({
      "owner.type": "service",
      "owner.id": { $in: serviceIds },
    }).lean();

    const mediaMap = {};
    allMedia.forEach((media) => {
      const sid = media.owner.id.toString();
      if (!mediaMap[sid]) mediaMap[sid] = [];
      mediaMap[sid].push(media);
    });

    const enriched = services.map((s) => ({
      ...s,
      mediaAssets: mediaMap[s._id.toString()] || [],
    }));

    const total = await Service.countDocuments(filter);

    res.json(
      formatResponse("success", "Services fetched", {
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum),
        items: enriched,
      })
    );
  } catch (err) {
    console.error("[GET /services] Error:", err);
    res.status(500).json(formatResponse("error", "Server error"));
  }
});

// GET service by slug
router.get("/:slug", async (req, res) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug })
      .populate("category", "title slug")
      .lean();

    if (!service) {
      return res.status(404).json(formatResponse("error", "Service not found"));
    }

    const mediaAssets = await MediaAsset.find({
      "owner.type": "service",
      "owner.id": service._id,
    }).lean();

    // Ensure consistent shape with list view
    const enrichedService = {
      ...service,
      mediaAssets,
    };

    res.json(
      formatResponse("success", "Service fetched", {
        item: enrichedService,
      })
    );
  } catch (err) {
    console.error("[GET /services/:slug] Error:", err);
    res.status(500).json(formatResponse("error", "Server error"));
  }
});

// POST create service
router.post("/", protect, authorize("admin"), async (req, res) => {
  try {
    const { slug } = req.body;
    if (!req.body.title || !req.body.category) {
      return res
        .status(400)
        .json(formatResponse("error", "Title and category are required"));
    }

    const existingSlug = await Service.findOne({ slug });
    if (existingSlug) {
      return res
        .status(400)
        .json(formatResponse("error", "Slug must be unique"));
    }

    const newService = new Service(req.body);
    await newService.save();

    res
      .status(201)
      .json(formatResponse("success", "Service created", { item: newService }));
  } catch (err) {
    console.error("[POST /services] Error:", err);
    res.status(500).json(formatResponse("error", "Server error"));
  }
});

// PUT update service
router.put("/:slug", protect, authorize("admin"), async (req, res) => {
  try {
    const updatedService = await Service.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedService) {
      return res.status(404).json(formatResponse("error", "Service not found"));
    }

    res.json(
      formatResponse("success", "Service updated", { item: updatedService })
    );
  } catch (err) {
    console.error("[PUT /services/:slug] Error:", err);
    res.status(500).json(formatResponse("error", "Server error"));
  }
});

// DELETE service
router.delete("/:slug", protect, authorize("admin"), async (req, res) => {
  try {
    const deletedService = await Service.findOneAndDelete({
      slug: req.params.slug,
    });

    if (!deletedService) {
      return res.status(404).json(formatResponse("error", "Service not found"));
    }

    res.json(formatResponse("success", "Service deleted", { deleted: true }));
  } catch (err) {
    console.error("[DELETE /services/:slug] Error:", err);
    res.status(500).json(formatResponse("error", "Server error"));
  }
});

module.exports = router;
