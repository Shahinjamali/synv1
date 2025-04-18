const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Company } = require("../models/companyModel");
const { protect, authorize } = require("../middlewares/authMiddleware"); // ✅ Fix import
const { cacheMiddleware } = require("../utils/cache");

// ✅ GET all companies (public, cached)
router.get("/", cacheMiddleware, async (req, res, next) => {
  try {
    const { name, industryId } = req.query;
    const query = {};
    if (name) query.name = new RegExp(name, "i");
    if (industryId) query.industryId = industryId;
    const companies = await Company.find(query)
      .select("-contact.email -contact.phone") // Hide sensitive info publicly
      .lean();
    res.json(companies);
  } catch (err) {
    next(err);
  }
});

// ✅ GET company by ID (authenticated users only)
router.get("/:id", protect, async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid company ID" });
    }
    const company = await Company.findById(req.params.id).lean();
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.json(company);
  } catch (err) {
    next(err);
  }
});

// ✅ POST create company (Admin Only)
router.post("/", protect, authorize("admin"), async (req, res, next) => {
  try {
    const { name, address } = req.body;
    if (!name || !address) {
      return res.status(400).json({ message: "Name and address are required" });
    }
    const newCompany = new Company(req.body);
    await newCompany.save();
    res.status(201).json(newCompany);
  } catch (err) {
    next(err);
  }
});

// ✅ PUT update company (Admin Only)
router.put("/:id", protect, authorize("admin"), async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid company ID" });
    }
    const updatedCompany = await Company.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedCompany)
      return res.status(404).json({ message: "Company not found" });
    res.json(updatedCompany);
  } catch (err) {
    next(err);
  }
});

// ✅ DELETE company (Admin Only)
router.delete("/:id", protect, authorize("admin"), async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid company ID" });
    }
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.json({ message: "Company deleted successfully" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
