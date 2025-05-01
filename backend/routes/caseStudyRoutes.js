// routes/caseStudyRoutes.js (new or updated)
const express = require("express");
const router = express.Router();
const CaseStudy = require("../models/caseStudyModel");
const { protect, authorize } = require("../middlewares/authMiddleware");

const formatResponse = (status, message, data = null) => ({
  status,
  message,
  data,
});

// GET /api/case-studies - Fetch all case studies
router.get("/", async (req, res) => {
  try {
    const caseStudies = await CaseStudy.find({
      "metadata.status": { $in: ["active", "draft"] },
    })
      .select("title slug _id")
      .lean();
    res.json({ success: true, data: caseStudies });
  } catch (error) {
    console.error("Error fetching case studies:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch case studies" });
  }
});

module.exports = router;
