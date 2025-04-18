const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { KnowledgeBase } = require("../models/knowledgeBaseModel");
const { protect, authorize } = require("../middlewares/authMiddleware");

// ✅ GET all knowledge base articles (Public Sees Published, Authenticated Users See All)
router.get("/", protect, async (req, res, next) => {
  try {
    const { category, tags, status, page = 1, limit = 10 } = req.query;
    const query = {};

    if (!req.user) query.status = "published"; // Public users only see published articles
    if (category) query.category = new RegExp(category, "i");
    if (tags) query.tags = { $in: tags.split(",") };
    if (req.user && status) query.status = status; // Authenticated users can filter by status

    const articles = await KnowledgeBase.find(query)
      .populate("author", "username email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    const total = await KnowledgeBase.countDocuments(query);

    res.json({
      articles,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
    });
  } catch (err) {
    next(err);
  }
});

// ✅ GET knowledge base article by ID or slug (Public Sees Published, Authenticated Users See All)
router.get("/:identifier", protect, async (req, res, next) => {
  try {
    const { identifier } = req.params;
    const query = mongoose.Types.ObjectId.isValid(identifier)
      ? { _id: identifier }
      : { slug: identifier };

    if (!req.user) query.status = "published"; // Public users only see published articles

    const article = await KnowledgeBase.findOne(query)
      .populate("author", "username email")
      .lean();

    if (!article) return res.status(404).json({ message: "Article not found" });

    res.json(article);
  } catch (err) {
    next(err);
  }
});

// ✅ POST create knowledge base article (Admin Only)
router.post("/", protect, authorize("admin"), async (req, res, next) => {
  try {
    const { title, content, category } = req.body;
    if (!title || !content || !category) {
      return res
        .status(400)
        .json({ message: "Title, content, and category are required" });
    }

    const newArticle = new KnowledgeBase({ ...req.body, author: req.user._id });
    await newArticle.save();

    res.status(201).json(newArticle);
  } catch (err) {
    next(err);
  }
});

// ✅ PUT update knowledge base article (Admin Only)
router.put("/:id", protect, authorize("admin"), async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid article ID" });
    }

    const updatedArticle = await KnowledgeBase.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedArticle)
      return res.status(404).json({ message: "Article not found" });

    res.json(updatedArticle);
  } catch (err) {
    next(err);
  }
});

// ✅ DELETE knowledge base article (Admin Only)
router.delete("/:id", protect, authorize("admin"), async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid article ID" });
    }

    const article = await KnowledgeBase.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json({ message: "Article not found" });

    res.json({ message: "Article deleted successfully" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
