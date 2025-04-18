const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const LabModel = require("../models/labModel");
const { protect, authorize } = require("../middlewares/authMiddleware");
const { computeTrends } = require("../methods/trends"); // Direct import
const { computeNotifications } = require("../services/notificationService");
const Equipment = require("../models/equipmentModel");

router.get(
  "/",
  protect,
  authorize("superadmin", "admin", "analyst"),
  async (req, res, next) => {
    try {
      const { equipmentId, oilName } = req.query;
      console.log("Received request:", {
        equipmentId,
        oilName,
        userId: req.user?._id.toString(),
      });

      if (!req.user || !req.user._id) {
        return res
          .status(401)
          .json({ success: false, message: "User not authenticated" });
      }
      if (!equipmentId || !mongoose.Types.ObjectId.isValid(equipmentId)) {
        return res
          .status(400)
          .json({ success: false, message: "Valid equipmentId is required" });
      }

      const filter = {
        equipmentId: new mongoose.Types.ObjectId(equipmentId),
        ...(req.user.roles.includes("superadmin")
          ? {}
          : { companyId: req.user.companyId }),
      };
      console.log("Query filter:", filter);

      const labs = await LabModel.find(filter).populate("oilTypeId").lean();
      console.log(`Found ${labs.length} labs for equipmentId: ${equipmentId}`);

      let analyses = [];
      let notifications = [];
      let trends = {};

      if (labs.length) {
        const equipment = await Equipment.findById(equipmentId).lean();
        if (!equipment) {
          return res
            .status(404)
            .json({ success: false, message: "Equipment not found" });
        }

        analyses = labs.map((lab) => ({
          id: lab._id.toString(),
          companyId: lab.companyId.toString(),
          equipmentId: lab.equipmentId.toString(),
          oilId: lab.oilId.toString(),
          oilTypeId: {
            _id: lab.oilTypeId?._id?.toString() || null,
            name: lab.oilTypeId?.name || "Unknown Oil",
            brand: lab.oilTypeId?.brand || "Unknown Brand",
            type: lab.oilTypeId?.type || "neat",
          },
          source: lab.source,
          timestamp: lab.resultsReceivedDate
            ? new Date(lab.resultsReceivedDate).toISOString()
            : new Date().toISOString(),
          parameters: lab.parameters,
          status: lab.status,
        }));
        console.log("Transformed analyses count:", analyses.length);

        let filteredAnalyses = analyses;
        let oilId = null;
        if (oilName) {
          const oilEntry = equipment.oilHistory.find(
            (oil) =>
              oil.name.toLowerCase() === oilName.toLowerCase() && !oil.deletedAt
          );
          if (oilEntry) {
            filteredAnalyses = analyses.filter(
              (a) => a.oilId === oilEntry._id.toString()
            );
            oilId = oilEntry._id.toString();
          } else {
            filteredAnalyses = [];
          }
          console.log(
            `Filtered analyses count (oilName: ${oilName}): ${filteredAnalyses.length}`
          );
        }

        if (filteredAnalyses.length) {
          const oilType = filteredAnalyses[0]?.oilTypeId.type || "neat";
          console.log("Computed oilType:", oilType);

          // Direct call to computeTrends
          trends = await computeTrends(filteredAnalyses, oilType);
          console.log("Trends computed:", JSON.stringify(trends, null, 2));

          const userId = req.user._id.toString();
          const companyId = req.user.companyId?.toString();
          console.log("Generating notifications for userId:", userId);
          notifications = await computeNotifications(
            filteredAnalyses,
            oilType,
            userId,
            companyId
          );
          console.log(`Generated ${notifications.length} notifications`);
        } else {
          console.log(`No analyses found for oil: ${oilName || "ALL OILS"}`);
          trends = {};
          notifications = [];
        }
      } else {
        const equipment = await Equipment.findOne({
          _id: new mongoose.Types.ObjectId(equipmentId),
          ...(req.user.roles.includes("superadmin")
            ? {}
            : { companyId: req.user.companyId }),
        }).lean();
        if (!equipment) {
          return res
            .status(404)
            .json({ success: false, message: "Equipment not found" });
        }
        analyses = [];
        trends = {};
        notifications = [];
        const equipmentMetadata = {
          equipmentId: equipment._id.toString(),
          name: equipment.name,
          oilHistory: equipment.oilHistory || [],
        };
        return res.status(200).json({
          success: true,
          data: {
            analyses,
            total: analyses.length,
            pages: 1,
            currentPage: 1,
            trends,
            notifications,
            equipment: equipmentMetadata,
          },
        });
      }

      res.status(200).json({
        success: true,
        data: {
          analyses,
          total: analyses.length,
          pages: 1,
          currentPage: 1,
          trends,
          notifications,
        },
      });
    } catch (error) {
      console.error("Error in GET /api/oil-analysis:", {
        message: error.message,
        stack: error.stack,
      });
      res
        .status(500)
        .json({
          success: false,
          message: "Server error",
          error: error.message,
        });
    }
  }
);

module.exports = router;
