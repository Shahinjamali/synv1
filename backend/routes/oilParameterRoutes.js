// GET /api/oil-parameter-types/:oilType - Fetch parameters for an oil type
const express = require("express");
const router = express.Router();
const oilParameter = require("../models/oilParameterModel");
const { protect, authorize } = require("../middlewares/authMiddleware");

router.get(
  "/:oilType",
  protect,
  authorize("admin", "superadmin", "analyst"),
  async (req, res, next) => {
    try {
      const { oilType } = req.params;
      const parameterType = await oilParameter.findOne({ oilType }).lean();
      if (!parameterType) {
        return res
          .status(404)
          .json({ success: false, message: "Parameter type not found" });
      }
      res.status(200).json({ success: true, data: parameterType });
    } catch (err) {
      console.error("[GET /api/oil-parameter-types/:oilType] Error:", err);
      next(err);
    }
  }
);

module.exports = router;
