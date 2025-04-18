const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { SensorData } = require("../models/sensorDataModel");
const { protect, authorize } = require("../middlewares/authMiddleware");

// ✅ GET all sensor data (Authenticated Users, Paginated)
router.get("/", protect, async (req, res, next) => {
  try {
    const { sensorId, startDate, endDate, page = 1, limit = 100 } = req.query;
    const query = { companyId: req.user.companyId }; // Restrict data to user's company

    if (sensorId) query.sensorId = sensorId;
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const data = await SensorData.find(query)
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    const total = await SensorData.countDocuments(query);

    res.json({
      data,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
    });
  } catch (err) {
    next(err);
  }
});

// ✅ GET sensor data by sensor ID (Authenticated Users)
router.get("/sensor/:sensorId", protect, async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.sensorId)) {
      return res.status(400).json({ message: "Invalid sensor ID" });
    }

    const data = await SensorData.find({
      sensorId: req.params.sensorId,
      companyId: req.user.companyId,
    })
      .sort({ timestamp: -1 })
      .limit(100)
      .lean();

    res.json(data);
  } catch (err) {
    next(err);
  }
});

// ✅ POST new sensor data (Technicians & Admins Only, Real-Time Updates)
router.post(
  "/",
  protect,
  authorize("admin", "technician"),
  async (req, res, next) => {
    try {
      const { sensorId, value, unit } = req.body;
      if (!sensorId || value === undefined || !unit) {
        return res
          .status(400)
          .json({ message: "Sensor ID, value, and unit are required" });
      }

      const sensorData = new SensorData({
        ...req.body,
        companyId: req.user.companyId,
      });
      await sensorData.save();

      // ✅ Emit real-time sensor data update using WebSockets
      req.app.get("io").emit("sensorDataUpdate", sensorData);

      res.status(201).json(sensorData);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
