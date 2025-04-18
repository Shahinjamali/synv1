const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Report } = require("../models/reportModel");
const { protect, authorize } = require("../middlewares/authMiddleware");
const { cacheMiddleware } = require("../utils/cache");

// ✅ GET all reports (Admins See All, Users See Company Reports, Cached)
router.get("/", protect, cacheMiddleware, async (req, res, next) => {
  try {
    const query = req.user.roles.includes("admin")
      ? {}
      : { companyId: req.user.companyId };

    const reports = await Report.find(query).lean();
    res.json(reports);
  } catch (err) {
    next(err);
  }
});

// ✅ GET report by ID (Authenticated Users)
router.get("/:id", protect, async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid report ID" });
    }

    const report = await Report.findById(req.params.id).lean();
    if (!report) return res.status(404).json({ message: "Report not found" });

    // ✅ Restrict access to own company's reports unless admin
    if (
      !req.user.roles.includes("admin") &&
      report.companyId.toString() !== req.user.companyId.toString()
    ) {
      return res.status(403).json({ message: "Unauthorized access to report" });
    }

    res.json(report);
  } catch (err) {
    next(err);
  }
});

// ✅ POST create report (Authenticated Users)
router.post("/", protect, async (req, res, next) => {
  try {
    const { reportType } = req.body;
    if (!reportType) {
      return res.status(400).json({ message: "Report type is required" });
    }

    // ✅ Assign report to the user's company
    const newReport = new Report({
      ...req.body,
      companyId: req.user.companyId,
    });
    await newReport.save();

    res.status(201).json(newReport);
  } catch (err) {
    next(err);
  }
});

// ✅ DELETE report (Admin Only)
router.delete("/:id", protect, authorize("admin"), async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid report ID" });
    }

    const report = await Report.findByIdAndDelete(req.params.id);
    if (!report) return res.status(404).json({ message: "Report not found" });

    res.json({ message: "Report deleted successfully" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
