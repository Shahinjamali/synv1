const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Industry } = require("../models/industryModel");
const { protect, authorize } = require("../middlewares/authMiddleware");

// ✅ GET all industries (Public)
router.get("/", async (req, res, next) => {
  try {
    const { name } = req.query;
    const query = name ? { name: new RegExp(name, "i") } : {};

    const industries = await Industry.find(query)
      .populate("solutions.solutionId", "name")
      .lean();

    res.json(industries);
  } catch (err) {
    next(err);
  }
});

// ✅ GET industry by ID (Public)
router.get("/:id", async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid industry ID" });
    }

    const industry = await Industry.findById(req.params.id)
      .populate("solutions.solutionId", "name")
      .lean();

    if (!industry)
      return res.status(404).json({ message: "Industry not found" });

    res.json(industry);
  } catch (err) {
    next(err);
  }
});

// ✅ POST create industry (Admin Only)
router.post("/", protect, authorize("admin"), async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });

    const newIndustry = new Industry(req.body);
    await newIndustry.save();

    res.status(201).json(newIndustry);
  } catch (err) {
    next(err);
  }
});

// ✅ PUT update industry (Admin Only)
router.put("/:id", protect, authorize("admin"), async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid industry ID" });
    }

    const updatedIndustry = await Industry.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedIndustry)
      return res.status(404).json({ message: "Industry not found" });

    res.json(updatedIndustry);
  } catch (err) {
    next(err);
  }
});

// ✅ DELETE industry (Admin Only)
router.delete("/:id", protect, authorize("admin"), async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid industry ID" });
    }

    const industry = await Industry.findByIdAndDelete(req.params.id);
    if (!industry)
      return res.status(404).json({ message: "Industry not found" });

    res.json({ message: "Industry deleted successfully" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
