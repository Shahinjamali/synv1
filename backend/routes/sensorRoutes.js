const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Sensor } = require("../models/sensorModel");
const { protect, authorize } = require("../middlewares/authMiddleware");

// ✅ GET all sensors (Authenticated Users)
router.get("/", protect, async (req, res, next) => {
  try {
    const { companyId, equipmentId } = req.query;
    const query = { companyId: req.user.companyId }; // Restrict to user's company

    if (equipmentId) query.equipmentId = equipmentId;

    const sensors = await Sensor.find(query).lean();
    res.json(sensors);
  } catch (err) {
    next(err);
  }
});

// ✅ GET sensor by ID (Authenticated Users)
router.get("/:id", protect, async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid sensor ID" });
    }
    const sensor = await Sensor.findById(req.params.id).lean();
    if (!sensor) return res.status(404).json({ message: "Sensor not found" });

    res.json(sensor);
  } catch (err) {
    next(err);
  }
});

// ✅ POST create sensor (Admin or Technician Only)
router.post(
  "/",
  protect,
  authorize("admin", "technician"),
  async (req, res, next) => {
    try {
      const { sensorId, type, equipmentId } = req.body;
      if (!sensorId || !type || !equipmentId) {
        return res
          .status(400)
          .json({ message: "Sensor ID, type, and equipment ID are required" });
      }

      const newSensor = new Sensor({
        ...req.body,
        companyId: req.user.companyId,
      });
      await newSensor.save();
      res.status(201).json(newSensor);
    } catch (err) {
      next(err);
    }
  }
);

// ✅ PUT update sensor (Admin or Technician Only)
router.put(
  "/:id",
  protect,
  authorize("admin", "technician"),
  async (req, res, next) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid sensor ID" });
      }

      const updatedSensor = await Sensor.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!updatedSensor)
        return res.status(404).json({ message: "Sensor not found" });

      res.json(updatedSensor);
    } catch (err) {
      next(err);
    }
  }
);

// ✅ DELETE sensor (Admin Only)
router.delete("/:id", protect, authorize("admin"), async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid sensor ID" });
    }

    const sensor = await Sensor.findByIdAndDelete(req.params.id);
    if (!sensor) return res.status(404).json({ message: "Sensor not found" });

    res.json({ message: "Sensor deleted successfully" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
