const express = require("express");
const router = express.Router();
const AuditLog = require("../models/auditLogModel");
const { protect, authorize } = require("../middlewares/authMiddleware");

router.get("/", protect, authorize("admin"), async (req, res) => {
  const { userId, action, startDate, endDate } = req.query;
  try {
    const filters = { companyId: req.user.companyId };
    if (userId) filters.userId = userId;
    if (action) filters.action = action;
    if (startDate || endDate) filters.timestamp = {};
    if (startDate) filters.timestamp.$gte = new Date(startDate);
    if (endDate) filters.timestamp.$lte = new Date(endDate);

    const logs = await AuditLog.find(filters).sort({ timestamp: -1 });
    res.json({ success: true, data: logs });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/synix", protect, authorize("superadmin"), async (req, res) => {
  const { companyId, userId, action, startDate, endDate } = req.query;
  try {
    const filters = {};
    if (companyId) filters.companyId = companyId;
    if (userId) filters.userId = userId;
    if (action) filters.action = action;
    if (startDate || endDate) filters.timestamp = {};
    if (startDate) filters.timestamp.$gte = new Date(startDate);
    if (endDate) filters.timestamp.$lte = new Date(endDate);

    const logs = await AuditLog.find(filters).sort({ timestamp: -1 });
    res.json({ success: true, data: logs });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
