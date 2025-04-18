const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middlewares/authMiddleware");
const Equipment = require("../models/equipmentModel");
const { computeTrends } = require("../methods/trends");

router.get(
  "/equipment/:equipmentId/oil/:oilId",
  protect,
  authorize("superadmin", "admin", "analyst"),
  async (req, res, next) => {
    try {
      const { equipmentId, oilId } = req.params;
      const equipment = await Equipment.findById(equipmentId).lean();
      if (!equipment) {
        return res
          .status(404)
          .json({ success: false, message: "Equipment not found" });
      }
      const oilEntry = equipment.oilHistory.find(
        (oil) => oil._id.toString() === oilId
      );
      if (!oilEntry) {
        return res
          .status(404)
          .json({ success: false, message: "Oil instance not found" });
      }
      const labReports = (oilEntry.labReports || []).map((lab) => ({
        ...lab,
        timestamp: lab.resultsReceivedDate
          ? new Date(lab.resultsReceivedDate).toISOString()
          : new Date().toISOString(),
        parameters: lab.parameters || [], // Ensure parameters is always an array
      }));
      console.log(
        "[trendsRoutes] Processed labReports:",
        JSON.stringify(labReports, null, 2)
      ); // Debug log
      const trends = await computeTrends(
        labReports,
        oilEntry.oilType || "neat"
      );
      res.status(200).json({ success: true, data: trends });
    } catch (err) {
      console.error(
        "[GET /api/trends/equipment/:equipmentId/oil/:oilId] Error:",
        err
      );
      next(err);
    }
  }
);

module.exports = router;
