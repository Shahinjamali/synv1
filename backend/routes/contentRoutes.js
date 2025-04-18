const express = require("express");
const router = express.Router();
const Content = require("../models/contentModel");
const { protect, authorize } = require("../middlewares/authMiddleware");
const Company = require("../models/companyModel");

// ✅ GET all content (Authenticated, paginated)
router.get("/", protect, async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = status ? { status } : {};

    const content = await Content.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();
    const total = await Content.countDocuments(query);

    res.json({
      content,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
    });
  } catch (err) {
    next(err);
  }
});

// ✅ GET content by page and section (Public)
router.get("/:page/:section", async (req, res, next) => {
  try {
    const { page, section } = req.params;
    const query = { page, section, status: "published" };

    const content = await Content.findOne(query).lean();

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Content not found",
        data: null,
      });
    }

    if (page === "home" && section === "testimonials") {
      if (content.contentType !== "array" || !Array.isArray(content.content)) {
        return res.status(400).json({
          success: false,
          message: "Testimonials content must be an array",
          data: null,
        });
      }

      const testimonials = content.content.map((testimonial) => ({
        name: testimonial.name,
        company: testimonial.company || "Unknown Company",
        position: testimonial.position || "N/A",
        quote: testimonial.quote,
        rating: testimonial.rating || 5,
        img: testimonial.img || "/assets/images/testimonial/default-client.jpg",
      }));

      return res.json({ success: true, data: testimonials });
    }

    res.json({ success: true, data: content });
  } catch (err) {
    console.error("❌ Error fetching content:", err);
    next(err);
  }
});

// ✅ POST create content (Admin Only)
router.post("/", protect, authorize("admin"), async (req, res, next) => {
  try {
    const { page, contentType, content } = req.body;
    if (!page || !contentType || !content) {
      return res
        .status(400)
        .json({ message: "Page, content type, and content are required" });
    }

    const newContent = new Content(req.body);
    await newContent.save();
    res.status(201).json(newContent);
  } catch (err) {
    next(err);
  }
});

// ✅ PUT update content (Admin Only)
router.put("/:id", protect, authorize("admin"), async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid content ID" });
    }

    const updatedContent = await Content.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedContent)
      return res.status(404).json({ message: "Content not found" });

    res.json(updatedContent);
  } catch (err) {
    next(err);
  }
});

// ✅ DELETE content (Admin Only)
router.delete("/:id", protect, authorize("admin"), async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid content ID" });
    }

    const content = await Content.findByIdAndDelete(req.params.id);
    if (!content) return res.status(404).json({ message: "Content not found" });

    res.json({ message: "Content deleted" });
  } catch (err) {
    next(err);
  }
});

//////////////////////////// BLOG ROUTES ///////////////////////////////////

// ✅ Fetch last 3 blogs (Public)
router.get("/blogs/latest-articles/last-three", async (req, res, next) => {
  try {
    console.log("🔍 Fetching last 3 blogs...");

    const query = {
      page: "blogs",
      section: "latest-articles",
      status: "published",
    };

    const content = await Content.findOne(query).lean();

    if (!content || !content.content || content.content.length === 0) {
      return res.status(404).json({ message: "No blogs found." });
    }

    const lastThreeBlogs = content.content.slice(-3);
    res.json({ success: true, data: lastThreeBlogs });
  } catch (err) {
    console.error("❌ Error fetching blogs:", err);
    next(err);
  }
});

// ✅ Fetch all blogs for `/blogs` page (Public)
router.get("/blogs", async (req, res, next) => {
  try {
    console.log("🔍 Fetching all blogs...");

    const query = {
      page: "blogs",
      section: "latest-articles",
      status: "published",
    };

    const content = await Content.findOne(query).lean();

    if (!content) {
      return res.status(404).json({ message: "No blogs found." });
    }

    res.json({ success: true, data: content });
  } catch (err) {
    console.error("❌ Error fetching blogs:", err);
    next(err);
  }
});

// ✅ Fetch a single blog by `slug` (Public)
router.get("/blogs/latest-articles/:slug", async (req, res, next) => {
  try {
    const { slug } = req.params;
    console.log(`🔍 Fetching blog with slug: ${slug}`);

    const query = {
      page: "blogs",
      section: "latest-articles",
      status: "published",
    };

    const content = await Content.findOne(query).lean();

    if (!content || !content.content) {
      return res.status(404).json({ message: "Content not found" });
    }

    const blog = content.content.find((b) => b.slug === slug);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json({ success: true, data: blog });
  } catch (err) {
    console.error("❌ Error fetching blog:", err);
    next(err);
  }
});

module.exports = router;
