const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Lab = require("../models/labModel");
const Equipment = require("../models/equipmentModel");
const OilType = require("../models/oilTypeModel");
const { protect, authorize } = require("../middlewares/authMiddleware");
const { auditLog } = require("../middlewares/auditMiddleware");
const { createSystemNotification } = require("../services/notificationService");
const { calculateHealth } = require("../services/healthService");

// POST /api/lab-reports/sample
router.post(
  "/sample",
  protect,
  authorize("superadmin", "admin", "analyst"),
  async (req, res, next) => {
    try {
      const {
        equipmentId,
        oilId,
        sampleDate = new Date(),
        source,
        submittedBy,
      } = req.body;

      if (!equipmentId || !oilId || !source) {
        return res
          .status(400)
          .json({ success: false, message: "Missing required fields" });
      }

      if (source === "lab" && !submittedBy) {
        return res.status(400).json({
          success: false,
          message: "submittedBy required for lab source",
        });
      }
      if (source === "lab" && submittedBy !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized: submittedBy must match authenticated user",
        });
      }

      const equipment = await Equipment.findOne({
        _id: equipmentId,
        deletedAt: null,
      });
      if (!equipment) {
        return res
          .status(404)
          .json({ success: false, message: "Equipment not found" });
      }

      const oilEntry = equipment.oilHistory.id(oilId);
      if (!oilEntry || oilEntry.deletedAt) {
        return res.status(404).json({
          success: false,
          message: "Oil instance not found or deleted",
        });
      }

      const labReport = new Lab({
        equipmentId,
        companyId: equipment.companyId,
        oilTypeId: oilEntry.oilTypeId,
        oilId,
        sampleDate: new Date(sampleDate),
        source,
        submittedBy: source === "lab" ? submittedBy : undefined,
        status: "pending",
      });
      await labReport.save();

      // Update Equipment.oilHistory.labReports
      await Equipment.updateOne(
        { _id: equipmentId, "oilHistory._id": oilId },
        { $push: { "oilHistory.$.labReports": labReport._id } }
      );

      res.locals.entityId = labReport._id;

      // Middleware to log the action
      await auditLog("Lab", "sample_created", (req) => ({
        sampleDate: req.body.sampleDate,
        oilId: req.body.oilId,
      }))(req, res, async () => {
        await createSystemNotification({
          equipmentId,
          companyId: equipment.companyId,
          userId: req.user._id,
          type: "sample-created",
          shortMessage: `Sample scheduled for ${equipment.name} - ${oilEntry.name}`,
          detailedMessage: `A new oil sample has been scheduled for ${equipment.name} with oil ${oilEntry.name}.`,
        });

        res.status(201).json({ success: true, data: labReport.toObject() });
      });
    } catch (err) {
      console.error("[POST /api/lab-reports/sample] Error:", err);
      next(err);
    }
  }
);

// PATCH /api/lab-reports/:labId/submit
router.patch(
  "/:labId/submit",
  protect,
  authorize("superadmin", "admin", "analyst"),
  async (req, res, next) => {
    try {
      const { submissionDate = new Date() } = req.body;

      const labReport = await Lab.findById(req.params.labId);
      if (!labReport || labReport.isDeleted) {
        return res
          .status(404)
          .json({ success: false, message: "Lab report not found" });
      }
      if (labReport.status !== "pending") {
        return res.status(400).json({
          success: false,
          message: "Sample already submitted or completed",
        });
      }

      labReport.submissionDate = new Date(submissionDate);
      labReport.status = "submitted";
      await labReport.save();

      await auditLog("Lab", "sample_submitted", (req) => ({
        submissionDate: req.body.submissionDate,
      }))(req, res, async () => {
        await createSystemNotification({
          equipmentId: labReport.equipmentId,
          companyId: labReport.companyId,
          userId: req.user._id,
          type: "sample-submitted",
          shortMessage: `Sample submitted for equipment ${labReport.equipmentId}`,
          detailedMessage: `The oil sample for equipment ${labReport.equipmentId} has been submitted to the lab.`,
        });

        res.status(200).json({ success: true, data: labReport.toObject() });
      });
    } catch (err) {
      console.error("[PATCH /api/lab-reports/:labId/submit] Error:", err);
      next(err);
    }
  }
);

// PATCH /api/lab-reports/:labId/results
router.patch(
  "/:labId/results",
  protect,
  authorize("superadmin", "admin", "analyst"),
  async (req, res, next) => {
    try {
      const { resultsReceivedDate = new Date(), parameters } = req.body;

      if (
        !parameters ||
        !Array.isArray(parameters) ||
        parameters.length === 0
      ) {
        return res
          .status(400)
          .json({ success: false, message: "Parameters required for results" });
      }

      const labReport = await Lab.findById(req.params.labId);
      if (!labReport || labReport.isDeleted) {
        return res
          .status(404)
          .json({ success: false, message: "Lab report not found" });
      }
      if (labReport.status === "completed") {
        return res
          .status(400)
          .json({ success: false, message: "Results already received" });
      }

      labReport.resultsReceivedDate = new Date(resultsReceivedDate);
      labReport.parameters = parameters;
      labReport.status = "completed";
      await labReport.save();

      // Ensure labReport._id is in Equipment.oilHistory.labReports
      const equipment = await Equipment.findById(labReport.equipmentId);
      const oilEntry = equipment.oilHistory.id(labReport.oilId);
      if (!oilEntry.labReports.includes(labReport._id)) {
        await Equipment.updateOne(
          { _id: labReport.equipmentId, "oilHistory._id": labReport.oilId },
          { $push: { "oilHistory.$.labReports": labReport._id } }
        );
      }

      const healthData = await calculateHealth(
        labReport.equipmentId,
        labReport.oilId
      );
      equipment.oilHistory.id(labReport.oilId).healthScore =
        healthData.oilHealth;
      equipment.oilHistory.id(labReport.oilId).lastHealthUpdate = new Date();
      equipment.healthScore = healthData.equipmentHealth;
      equipment.lastHealthUpdate = new Date();
      await equipment.save();

      await auditLog("Lab", "results_received", (req) => ({
        parameters: req.body.parameters,
      }))(req, res, async () => {
        await createSystemNotification({
          equipmentId: labReport.equipmentId,
          companyId: labReport.companyId,
          userId: req.user._id,
          type: "results-received",
          shortMessage: `Lab results received for equipment ${labReport.equipmentId}`,
          detailedMessage: `Lab results have been received and processed for equipment ${labReport.equipmentId}.`,
        });

        res.status(200).json({ success: true, data: labReport.toObject() });
      });
    } catch (err) {
      console.error("[PATCH /api/lab-reports/:labId/results] Error:", err);
      next(err);
    }
  }
);

// POST /api/lab-reports - Add completed lab report directly
router.post(
  "/",
  protect,
  authorize("superadmin", "admin", "analyst"),
  async (req, res, next) => {
    try {
      const {
        equipmentId,
        oilId,
        oilTypeId,
        companyId,
        timestamp,
        parameters,
        source,
        submittedBy,
      } = req.body;
      if (
        !equipmentId ||
        !oilId ||
        !oilTypeId ||
        !companyId ||
        !timestamp ||
        !source
      ) {
        return res
          .status(400)
          .json({ success: false, message: "Missing required fields" });
      }
      if (source === "lab" && !submittedBy) {
        return res.status(400).json({
          success: false,
          message: "submittedBy required for lab source",
        });
      }
      const equipment = await Equipment.findById(equipmentId);
      if (!equipment) {
        return res
          .status(404)
          .json({ success: false, message: "Equipment not found" });
      }
      const oilEntry = equipment.oilHistory.id(oilId);
      if (!oilEntry || oilEntry.deletedAt) {
        return res.status(404).json({
          success: false,
          message: "Oil instance not found or deleted",
        });
      }
      const labReport = new Lab({
        equipmentId,
        companyId,
        oilTypeId,
        oilId,
        sampleDate: new Date(timestamp),
        submissionDate: new Date(timestamp),
        resultsReceivedDate: new Date(timestamp),
        parameters,
        source,
        submittedBy: source === "lab" ? submittedBy : undefined,
        status: "completed",
      });
      await labReport.save();
      await Equipment.updateOne(
        { _id: equipmentId, "oilHistory._id": oilId },
        { $push: { "oilHistory.$.labReports": labReport._id } }
      );
      res.locals.entityId = labReport._id;
      await auditLog("Lab", "results_received", (req) => ({
        parameters: req.body.parameters,
        timestamp: req.body.timestamp,
      }))(req, res, async () => {
        await createSystemNotification({
          equipmentId,
          companyId,
          userId: req.user._id,
          type: "lab-report-added",
          shortMessage: `Lab report added for ${equipment.name} - ${oilEntry.name}`,
          detailedMessage: `A completed lab report has been added for ${equipment.name} with oil ${oilEntry.name}.`,
        });
        res.status(201).json({ success: true, data: labReport.toObject() });
      });
    } catch (err) {
      console.error("[POST /api/lab-reports] Error:", err);
      next(err);
    }
  }
);

// GET /api/lab-reports - Fetch lab reports by equipment or oil (unchanged)
router.get("/", protect, async (req, res, next) => {
  try {
    const { equipmentId, oilId, page = 1, limit = 50 } = req.query;

    const query = { isDeleted: false, companyId: req.user.companyId };
    if (equipmentId) query.equipmentId = equipmentId;
    if (oilId) query.oilId = oilId;

    const labReports = await Lab.find(query)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ sampleDate: -1 })
      .lean();
    const total = await Lab.countDocuments(query);

    console.log("[GET /api/lab-reports] Fetched:", {
      count: labReports.length,
      equipmentId,
      oilId,
    });
    res.status(200).json({
      success: true,
      data: {
        labReports,
        total,
        pages: Math.ceil(total / parseInt(limit)),
        currentPage: parseInt(page),
      },
    });
  } catch (err) {
    console.error("[GET /api/lab-reports] Error:", err);
    next(err);
  }
});

module.exports = router;
