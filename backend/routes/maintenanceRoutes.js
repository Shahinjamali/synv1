const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Maintenance } = require("../models/maintenanceModel");
const { protect, authorize } = require("../middlewares/authMiddleware");

// ✅ GET all maintenance records (Authenticated Users, Paginated)
router.get("/", protect, async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const maintenance = await Maintenance.find()
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    const total = await Maintenance.countDocuments();

    res.json({
      maintenance,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
    });
  } catch (err) {
    next(err);
  }
});

// ✅ GET maintenance record by ID (Authenticated Users)
router.get("/:id", protect, async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ message: "Invalid maintenance ID" });

    const maintenance = await Maintenance.findById(req.params.id).lean();
    if (!maintenance)
      return res.status(404).json({ message: "Maintenance record not found" });

    res.json(maintenance);
  } catch (err) {
    next(err);
  }
});

// ✅ POST create maintenance record (Admins & Technicians Only)
router.post(
  "/",
  protect,
  authorize("admin", "technician"),
  async (req, res, next) => {
    try {
      const { equipmentId } = req.body;

      if (!equipmentId || !mongoose.Types.ObjectId.isValid(equipmentId)) {
        return res.status(400).json({ message: "Invalid equipment ID" });
      }

      const maintenance = new Maintenance({
        ...req.body,
        equipmentId: new mongoose.Types.ObjectId(equipmentId),
      });
      await maintenance.save();

      res.status(201).json(maintenance);
    } catch (err) {
      console.error("Create maintenance error:", err);
      next(err);
    }
  }
);

// ✅ PUT update maintenance record (Admins & Technicians Only)
router.put(
  "/:id",
  protect,
  authorize("admin", "technician"),
  async (req, res, next) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(400).json({ message: "Invalid maintenance ID" });

      const updatedMaintenance = await Maintenance.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

      if (!updatedMaintenance)
        return res
          .status(404)
          .json({ message: "Maintenance record not found" });

      res.json(updatedMaintenance);
    } catch (err) {
      next(err);
    }
  }
);

// ✅ DELETE maintenance record (Admin Only)
router.delete("/:id", protect, authorize("admin"), async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ message: "Invalid maintenance ID" });

    const maintenance = await Maintenance.findByIdAndDelete(req.params.id);
    if (!maintenance)
      return res.status(404).json({ message: "Maintenance record not found" });

    res.json({ message: "Maintenance record deleted successfully" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
