const express = require("express");
const router = express.Router();
// const mongoose = require("mongoose");//
const Alert = require("../models/alertModel");
const { protect, authorize } = require("../middlewares/authMiddleware"); // ✅ Fix import
const { cacheMiddleware } = require("../utils/cache");

router.get(
  "/",
  protect,
  authorize("admin", "analyst", "superadmin"),
  async (req, res, next) => {
    try {
      let { status = "unresolved", limit = 10, page = 1 } = req.query;

      // ✅ Ensure `limit` and `page` are numbers and within safe bounds
      page = Math.max(parseInt(page, 10) || 1, 1);
      limit = Math.max(parseInt(limit, 10) || 10, 1);

      // ✅ Define base query for alerts
      const query = { companyId: req.user.companyId };

      if (status === "resolved") {
        query.isResolved = true;
      } else {
        query.isResolved = false; // Default: only show unresolved alerts
      }

      // ✅ Fetch alerts with pagination & population
      const alerts = await Alert.find(query)
        .populate("equipmentId", "name type location")
        .sort({ timestamp: -1 })
        .limit(limit)
        .skip((page - 1) * limit)
        .lean();

      // ✅ Get total count for pagination
      const total = await Alert.countDocuments(query);

      // ✅ Send structured response
      res.status(200).json({
        success: true,
        data: {
          alerts,
          total,
          pages: Math.ceil(total / limit),
          currentPage: page,
        },
      });
    } catch (err) {
      console.error("Alert Fetch - Error:", err);
      next(err); // ✅ Pass error to global error handler
    }
  }
);

module.exports = router;
