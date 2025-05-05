const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Content = require("../models/contentModel");
const { protect, authorize } = require("../middlewares/authMiddleware");

///////////////////////////////////////////////////////////////
// 🔒 Admin: GET all content (paginated, filterable)
router.get("/", protect, authorize("admin"), async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, contentRole } = req.query;
    const query = {};
    if (status) query.status = status;
    if (contentRole) query.contentRole = contentRole;

    const content = await Content.find(query)
      .populate("mediaAssets")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    const total = await Content.countDocuments(query);

    res.json({
      success: true,
      data: content,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
    });
  } catch (err) {
    next(err);
  }
});

///////////////////////////////////////////////////////////////
// ✅ Public: BLOG ROUTES

router.get("/blogs/latest", async (req, res, next) => {
  try {
    const blogs = await Content.find({
      contentRole: "blog",
      status: "published",
    })
      .populate("mediaAssets")
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();

    if (!blogs.length) {
      return res.status(404).json({ message: "No blogs found" });
    }

    res.json({ success: true, data: blogs });
  } catch (err) {
    next(err);
  }
});

// ✅ GET last 3 blog articles (for homepage display)
router.get("/blogs/latest-articles/last-three", async (req, res, next) => {
  try {
    const latestBlogs = await Content.find({
      page: "blogs",
      section: "latest-articles",
      status: "published",
    })
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();

    if (!latestBlogs.length) {
      return res
        .status(404)
        .json({ success: false, message: "No blogs found", data: null });
    }

    res.json({ success: true, data: latestBlogs.map((blog) => blog.content) });
  } catch (err) {
    next(err);
  }
});

router.get("/blogs", async (req, res, next) => {
  try {
    const blogs = await Content.find({
      contentRole: "blog",
      status: "published",
    })
      .populate("mediaAssets")
      .sort({ createdAt: -1 })
      .lean();

    if (!blogs.length) {
      return res.status(404).json({ message: "No blogs found" });
    }

    res.json({ success: true, data: blogs });
  } catch (err) {
    next(err);
  }
});

router.get("/blogs/:slug", async (req, res, next) => {
  try {
    const blog = await Content.findOne({
      slug: req.params.slug.toLowerCase(),
      contentRole: "blog",
      status: "published",
    })
      .populate("mediaAssets")
      .lean();

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json({ success: true, data: blog });
  } catch (err) {
    next(err);
  }
});

///////////////////////////////////////////////////////////////
// ✅ Public: TESTIMONIAL ROUTE

router.get("/testimonials/list", async (req, res, next) => {
  try {
    const testimonials = await Content.find({
      contentRole: "testimonial",
      status: "published",
    })
      .populate("mediaAssets")
      .sort({ createdAt: -1 })
      .lean();

    if (!testimonials.length) {
      return res.status(404).json({ message: "No testimonials found" });
    }

    res.json({ success: true, data: testimonials });
  } catch (err) {
    next(err);
  }
});

///////////////////////////////////////////////////////////////
// ✅ POST create new content (Admin only)

router.post("/", protect, authorize("admin"), async (req, res, next) => {
  try {
    const { page, contentType, content } = req.body;

    if (!page || !contentType || content === undefined) {
      return res.status(400).json({
        message: "Page, contentType, and content are required",
      });
    }

    const newContent = new Content(req.body);
    await newContent.save();

    res.status(201).json({ success: true, data: newContent });
  } catch (err) {
    next(err);
  }
});

///////////////////////////////////////////////////////////////
// ✅ PUT content by ID (Admin only)

router.put("/:id", protect, authorize("admin"), async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid content ID" });
    }

    const updated = await Content.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) return res.status(404).json({ message: "Content not found" });

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
});

///////////////////////////////////////////////////////////////
// ✅ DELETE content by ID (Admin only)

router.delete("/:id", protect, authorize("admin"), async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid content ID" });
    }

    const deleted = await Content.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Content not found" });

    res.json({ success: true, message: "Content deleted" });
  } catch (err) {
    next(err);
  }
});

///////////////////////////////////////////////////////////////
// ✅ GET content by page & section (Public, dynamic — last route!)

router.get("/:page/:section", async (req, res, next) => {
  try {
    const normalize = (val) => val.trim().toLowerCase();
    const query = {
      page: normalize(req.params.page),
      section: normalize(req.params.section),
      status: "published",
    };

    const content = await Content.find(query)
      .populate("mediaAssets")
      .sort({ createdAt: -1 })
      .lean();

    if (!content || content.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Content not found",
        data: null,
      });
    }

    res.json({ success: true, data: content });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
