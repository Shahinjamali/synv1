const express = require("express");
const router = express.Router();
const Reliability = require("../models/reliabilityModel");
const { protect, authorize } = require("../middlewares/authMiddleware");

/**
 * @route   GET /api/reliability
 * @desc    Fetch all reliability solutions (basic data public, restrict `media.documents`)
 * @access  Public
 */
router.get("/", async (req, res) => {
  try {
    const { subCategory, item, search, page = 1, limit = 10 } = req.query;

    let filter = {};
    if (subCategory) filter.subCategory = subCategory;
    if (item) filter.item = item;
    if (search) filter.name = { $regex: search, $options: "i" };

    const reliabilitySolutions = await Reliability.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    const totalCount = await Reliability.countDocuments(filter);

    // ✅ Remove `media.documents` if user is not authenticated
    const processedSolutions = reliabilitySolutions.map((solution) => {
      if (!req.user || !req.user.roles.includes("admin")) {
        delete solution.media?.documents;
      }
      return solution;
    });

    res.json({
      success: true,
      total: totalCount,
      page: Number(page),
      totalPages: Math.ceil(totalCount / limit),
      data: processedSolutions,
    });
  } catch (error) {
    console.error("Error fetching reliability solutions:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

/**
 * @route   GET /api/reliability/:id
 * @desc    Fetch a single reliability solution by ID (basic data public, restrict `media.documents`)
 * @access  Public
 */
router.get("/:id", async (req, res) => {
  try {
    const reliabilitySolution = await Reliability.findById(
      req.params.id
    ).lean();
    if (!reliabilitySolution)
      return res
        .status(404)
        .json({ success: false, message: "Solution not found" });

    // ✅ Remove `media.documents` if user is not authenticated
    if (!req.user || !req.user.roles.includes("admin")) {
      delete reliabilitySolution.media?.documents;
    }

    res.json({ success: true, data: reliabilitySolution });
  } catch (error) {
    console.error("Error fetching reliability solution:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

/**
 * @route   POST /api/reliability
 * @desc    Create a new reliability solution (Admin Only)
 * @access  Private (Admin Only)
 */
router.post("/", protect, authorize("admin"), async (req, res) => {
  try {
    const {
      name,
      categoryPath,
      description,
      price,
      technicalData,
      safetyData,
      media,
    } = req.body;

    const newSolution = new Reliability({
      name,
      categoryPath,
      description,
      price,
      technicalData,
      safetyData,
      media,
      createdBy: req.user._id,
    });

    await newSolution.save();
    res.status(201).json({ success: true, data: newSolution });
  } catch (error) {
    console.error("Error creating reliability solution:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

/**
 * @route   PUT /api/reliability/:id
 * @desc    Update an existing reliability solution (Admin Only)
 * @access  Private (Admin Only)
 */
router.put("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const updatedSolution = await Reliability.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedSolution)
      return res
        .status(404)
        .json({ success: false, message: "Solution not found" });

    res.json({ success: true, data: updatedSolution });
  } catch (error) {
    console.error("Error updating reliability solution:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

/**
 * @route   DELETE /api/reliability/:id
 * @desc    Delete a reliability solution (Admin Only)
 * @access  Private (Admin Only)
 */
router.delete("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const deletedSolution = await Reliability.findByIdAndDelete(req.params.id);
    if (!deletedSolution)
      return res
        .status(404)
        .json({ success: false, message: "Solution not found" });

    res.json({
      success: true,
      message: "Reliability solution deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting reliability solution:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
