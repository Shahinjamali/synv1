// backend/routes/notificationRoutes.js
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Notification = require("../models/notificationModel");
const { protect } = require("../middlewares/authMiddleware");

// GET /api/notifications - Fetch user notifications with filters
router.get("/", protect, async (req, res) => {
  try {
    const {
      equipmentId,
      status,
      oilTypeId,
      oilName,
      limit = 10,
      page = 1,
    } = req.query;
    const query = { userId: req.user._id };

    if (equipmentId && mongoose.Types.ObjectId.isValid(equipmentId)) {
      query.equipmentId = new mongoose.Types.ObjectId(equipmentId);
    }
    if (status && ["unread", "read", "archived"].includes(status)) {
      query.status = status;
    }
    if (oilTypeId && mongoose.Types.ObjectId.isValid(oilTypeId)) {
      query.$or = [
        { oilTypeId: new mongoose.Types.ObjectId(oilTypeId) },
        { oilTypeId: null },
      ];
    }
    if (oilName && typeof oilName === "string" && oilName.trim()) {
      query.oilName = oilName.trim();
    }

    const limitNum = Math.max(parseInt(limit, 10) || 10, 1);
    const pageNum = Math.max(parseInt(page, 10) || 1, 1);

    const notifications = await Notification.find(query)
      .sort({ sentAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean();

    const total = await Notification.countDocuments(query);

    res.json({
      success: true,
      data: {
        notifications,
        total,
        pages: Math.ceil(total / limitNum),
        currentPage: pageNum,
      },
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// POST /api/notifications - Create a new notification (unchanged for now)
router.post("/", protect, async (req, res) => {
  try {
    const {
      equipmentId,
      companyId,
      type,
      shortMessage,
      detailedMessage,
      relatedData,
      priority = "medium",
      userId = req.user._id,
    } = req.body;

    // Validation based on type
    if (
      !type ||
      ![
        "lab-alert",
        "sensor-alert",
        "system-equipment",
        "system-equipment-status",
        "system-maintenance",
        "user-assigned",
        "user-task",
        "system-update", // Added missing type
      ].includes(type)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing notification type",
      });
    }
    if (!shortMessage || !detailedMessage) {
      return res.status(400).json({
        success: false,
        message: "Short and detailed messages are required",
      });
    }
    if (
      [
        "lab-alert",
        "sensor-alert",
        "system-equipment",
        "system-equipment-status",
      ].includes(type) &&
      !equipmentId
    ) {
      return res.status(400).json({
        success: false,
        message: "equipmentId is required for this type",
      });
    }

    const notificationData = {
      equipmentId: equipmentId
        ? new mongoose.Types.ObjectId(equipmentId)
        : undefined,
      companyId: companyId
        ? new mongoose.Types.ObjectId(companyId)
        : req.user.companyId,
      userId: new mongoose.Types.ObjectId(userId),
      type,
      shortMessage,
      detailedMessage,
      relatedData: relatedData || {},
      status: "unread",
      priority,
      sentAt: new Date(),
      metadata: {
        sender: "system",
        actionUrl: equipmentId
          ? `/equipment/${equipmentId}/oil-analysis`
          : undefined,
      },
    };

    const notification = new Notification(notificationData);
    await notification.save();

    res.status(201).json({ success: true, data: notification.toObject() });
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// PATCH /api/notifications/:id/read - Mark as read (unchanged)
router.patch("/:id/read", protect, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid notification ID" });
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { status: "read" },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found or not authorized",
      });
    }

    console.log(`Notification ${id} marked as read for user ${req.user._id}`);
    res.json({ success: true, data: notification });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
