// File: backend/routes/equipmentRoutes.js
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Equipment = require("../models/equipmentModel");
const OilType = require("../models/oilTypeModel");
const EquipmentHealth = require("../models/equipmentHealthModel"); // Legacy, may phase out
const { protect, authorize } = require("../middlewares/authMiddleware");
const { createSystemNotification } = require("../services/notificationService");
const { calculateHealth } = require("../services/healthService"); // Assumed service

// GET /api/equipment - Fetch all active equipment
router.get("/", protect, async (req, res, next) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const query = { companyId: req.user.companyId, deletedAt: null }; // Only active equipment
    const equipment = await Equipment.find(query)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .lean();
    const total = await Equipment.countDocuments(query);
    console.log("[GET /api/equipment] Fetched:", {
      count: equipment.length,
      page,
      limit,
    });
    res.status(200).json({
      success: true,
      data: {
        equipment,
        total,
        pages: Math.ceil(total / parseInt(limit)),
        currentPage: parseInt(page),
      },
    });
  } catch (err) {
    console.error("[GET /api/equipment] Error:", err);
    next(err);
  }
});

// GET /api/equipment/:id - Fetch single active equipment
// GET /api/equipment/:id - Fetch single active equipment with populated labReports
router.get("/:id", protect, async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid equipment ID" });
    }
    const equipment = await Equipment.findOne({
      _id: id,
      companyId: req.user.companyId,
      deletedAt: null,
    })
      .populate({
        path: "oilHistory.labReports",
        select:
          "sampleDate submissionDate resultsReceivedDate parameters status condition",
        match: { isDeleted: false }, // Only active lab reports
      })
      .lean();
    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: "Equipment not found or unauthorized",
      });
    }
    console.log("[GET /api/equipment/:id] Fetched:", id);
    res.status(200).json({ success: true, data: equipment });
  } catch (err) {
    console.error("[GET /api/equipment/:id] Error:", err);
    next(err);
  }
});

// POST /api/equipment - Create new equipment
router.post(
  "/",
  protect,
  authorize("admin", "analyst", "superadmin"),
  async (req, res, next) => {
    try {
      const { name, companyId, oilHistory, type, location, status, section } =
        req.body;

      if (!name || !companyId) {
        return res
          .status(400)
          .json({ success: false, message: "Name and companyId are required" });
      }

      // Check name uniqueness
      const existing = await Equipment.findOne({
        name,
        companyId,
        deletedAt: null,
      });
      if (existing) {
        return res
          .status(400)
          .json({ success: false, message: "Equipment name already exists" });
      }

      const enrichedOilHistory = oilHistory
        ? await Promise.all(
            oilHistory.map(async (oil) => {
              if (!oil.oilTypeId) {
                let oilType = await OilType.findOne({
                  brand: oil.brand,
                  name: oil.name,
                  type: oil.oilType,
                  isDeleted: false,
                });
                if (!oilType) {
                  oilType = new OilType({
                    brand: oil.brand,
                    name: oil.name,
                    type: oil.oilType,
                  });
                  await oilType.save();
                }
                return {
                  ...oil,
                  oilTypeId: oilType._id,
                  healthScore: 100,
                  lastHealthUpdate: new Date(),
                };
              }
              return { ...oil, healthScore: 100, lastHealthUpdate: new Date() };
            })
          )
        : [];

      const newEquipment = new Equipment({
        name,
        companyId,
        oilHistory: enrichedOilHistory,
        type,
        location,
        status: status || "active",
        section,
        healthScore: 100, // Initial equipment health
        lastHealthUpdate: new Date(),
      });

      await newEquipment.save();

      // Legacy EquipmentHealth (optional, phase out if healthScore is in Equipment)
      const health = new EquipmentHealth({
        equipmentId: newEquipment._id,
        companyId,
        healthScore: 85,
        oilStatus: "good",
        oilDetails: enrichedOilHistory,
      });
      await health.save();

      await createSystemNotification({
        equipmentId: newEquipment._id.toString(),
        companyId,
        userId: req.user._id.toString(),
        type: "system-equipment",
        shortMessage: `New equipment added: ${name}`,
        detailedMessage: `Equipment ${name} has been added to your dashboard.`,
      });

      res.status(201).json({ success: true, data: newEquipment.toObject() });
    } catch (err) {
      console.error("[POST /api/equipment] Error:", err);
      next(err);
    }
  }
);

// PATCH /api/equipment/:id - Update equipment
router.patch(
  "/:id",
  protect,
  authorize("admin", "analyst", "superadmin"),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, status, location, section } = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid equipment ID" });
      }

      // Check name uniqueness if provided
      if (name) {
        const existing = await Equipment.findOne({
          name,
          companyId: req.user.companyId,
          _id: { $ne: id },
          deletedAt: null,
        });
        if (existing) {
          return res
            .status(400)
            .json({ success: false, message: "Equipment name already exists" });
        }
      }

      const updates = {};
      if (name) updates.name = name;
      if (status) updates.status = status;
      if (location) updates.location = location;
      if (section) updates.section = section;

      const equipment = await Equipment.findOneAndUpdate(
        { _id: id, companyId: req.user.companyId, deletedAt: null },
        { $set: updates },
        { new: true }
      );
      if (!equipment) {
        return res.status(404).json({
          success: false,
          message: "Equipment not found or unauthorized",
        });
      }

      // Recalculate health if status changes (optional)
      if (status) {
        const healthData = await calculateHealth(id); // Assumed function
        equipment.healthScore = healthData.equipmentHealth;
        equipment.lastHealthUpdate = new Date();
        await equipment.save();
      }

      console.log("[PATCH /api/equipment] Updated equipment:", id);
      res.status(200).json({ success: true, data: equipment.toObject() });
    } catch (err) {
      console.error("[PATCH /api/equipment] Error:", err);
      next(err);
    }
  }
);

// DELETE /api/equipment/:id - Soft delete equipment
router.delete(
  "/:id",
  protect,
  authorize("admin", "analyst", "superadmin"),
  async (req, res, next) => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid equipment ID" });
      }

      const equipment = await Equipment.findOneAndUpdate(
        { _id: id, companyId: req.user.companyId, deletedAt: null },
        { deletedAt: new Date() },
        { new: true }
      );
      if (!equipment) {
        return res.status(404).json({
          success: false,
          message: "Equipment not found or unauthorized",
        });
      }

      // Soft delete related EquipmentHealth (if still used)
      await EquipmentHealth.updateMany(
        { equipmentId: id },
        { deletedAt: new Date() }
      );

      console.log("[DELETE /api/equipment] Soft-deleted equipment:", id);
      res
        .status(200)
        .json({ success: true, message: "Equipment soft-deleted" });
    } catch (err) {
      console.error("[DELETE /api/equipment] Error:", err);
      next(err);
    }
  }
);

// POST /api/equipment/:id/event - Log an event
router.post(
  "/:id/event",
  protect,
  authorize("admin", "analyst", "superadmin"),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { type, details, impactOnHealth } = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid equipment ID" });
      }
      if (!type) {
        return res
          .status(400)
          .json({ success: false, message: "Event type is required" });
      }

      const equipment = await Equipment.findOne({
        _id: id,
        companyId: req.user.companyId,
        deletedAt: null,
      });
      if (!equipment) {
        return res.status(404).json({
          success: false,
          message: "Equipment not found or unauthorized",
        });
      }

      const event = {
        type,
        timestamp: new Date(),
        details,
        impactOnHealth: impactOnHealth || 0,
      };
      equipment.events.push(event);

      // Recalculate health
      const healthData = await calculateHealth(id);
      equipment.healthScore = healthData.equipmentHealth;
      equipment.lastHealthUpdate = new Date();

      await equipment.save();

      console.log("[POST /api/equipment/:id/event] Event added:", { id, type });
      res.status(201).json({ success: true, data: equipment.toObject() });
    } catch (err) {
      console.error("[POST /api/equipment/:id/event] Error:", err);
      next(err);
    }
  }
);

// POST /api/equipment/:equipmentId/oil - Add new oil to oilHistory
router.post(
  "/:equipmentId/oil",
  protect,
  authorize("admin", "analyst", "superadmin"),
  async (req, res, next) => {
    try {
      const { equipmentId } = req.params;
      const {
        oilTypeId,
        brand,
        name,
        oilType,
        fillDate,
        volume,
        application,
        notes,
      } = req.body;

      if (!mongoose.Types.ObjectId.isValid(equipmentId)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid equipment ID" });
      }
      if (!oilTypeId || !fillDate || !oilType) {
        return res.status(400).json({
          success: false,
          message: "oilTypeId, fillDate, and oilType are required",
        });
      }

      const equipment = await Equipment.findOne({
        _id: equipmentId,
        companyId: req.user.companyId,
        deletedAt: null,
      });
      if (!equipment) {
        return res.status(404).json({
          success: false,
          message: "Equipment not found or unauthorized",
        });
      }

      const oilTypeDoc = await OilType.findOne({
        _id: oilTypeId,
        isDeleted: false,
      });
      if (!oilTypeDoc) {
        return res
          .status(404)
          .json({ success: false, message: "Oil type not found" });
      }

      // Validate oilType matches OilType document
      if (oilType !== oilTypeDoc.type) {
        return res.status(400).json({
          success: false,
          message: `Oil type ${oilType} does not match stored type ${oilTypeDoc.type}`,
        });
      }

      const newOil = {
        oilTypeId,
        brand: brand || oilTypeDoc.brand,
        name: name || oilTypeDoc.name,
        oilType, // From req.body, validated against oilTypeDoc
        fillDate: new Date(fillDate),
        volume: volume || 0,
        application,
        notes,
        healthScore: 100,
        lastHealthUpdate: new Date(),
      };

      equipment.oilHistory.push(newOil);
      await equipment.save();

      await createSystemNotification({
        equipmentId,
        companyId: req.user.companyId,
        userId: req.user._id,
        type: "system-update",
        shortMessage: `New oil added to ${equipment.name}`,
        detailedMessage: `Oil ${newOil.name} added to ${equipment.name}.`,
      });

      const addedOil = equipment.oilHistory[equipment.oilHistory.length - 1];
      console.log("[POST /api/equipment/:equipmentId/oil] Oil added:", {
        equipmentId,
        oilId: addedOil._id,
      });
      res.status(201).json({ success: true, data: addedOil });
    } catch (err) {
      console.error("[POST /api/equipment/:equipmentId/oil] Error:", err);
      next(err);
    }
  }
);

// PATCH /api/equipment/:equipmentId/oil/:oilId - Update existing oil
router.patch(
  "/:equipmentId/oil/:oilId",
  protect,
  authorize("admin", "analyst", "superadmin"),
  async (req, res, next) => {
    try {
      const { equipmentId, oilId } = req.params;
      const { brand, name, volume, fillDate, application, notes } = req.body;

      if (
        !mongoose.Types.ObjectId.isValid(equipmentId) ||
        !mongoose.Types.ObjectId.isValid(oilId)
      ) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid equipment or oil ID" });
      }

      const equipment = await Equipment.findOne({
        _id: equipmentId,
        companyId: req.user.companyId,
        deletedAt: null,
      });
      if (!equipment) {
        return res.status(404).json({
          success: false,
          message: "Equipment not found or unauthorized",
        });
      }

      const oilEntry = equipment.oilHistory.id(oilId);
      if (!oilEntry || oilEntry.deletedAt) {
        return res
          .status(404)
          .json({ success: false, message: "Oil not found or deleted" });
      }

      const updates = {};
      if (brand) updates["oilHistory.$.brand"] = brand;
      if (name) updates["oilHistory.$.name"] = name;
      if (volume !== undefined) updates["oilHistory.$.volume"] = volume;
      if (fillDate) updates["oilHistory.$.fillDate"] = new Date(fillDate);
      if (application) updates["oilHistory.$.application"] = application;
      if (notes !== undefined) updates["oilHistory.$.notes"] = notes;

      const updatedEquipment = await Equipment.findOneAndUpdate(
        { _id: equipmentId, "oilHistory._id": oilId },
        { $set: updates },
        { new: true }
      );

      const updatedOil = updatedEquipment.oilHistory.id(oilId);
      console.log(
        "[PATCH /api/equipment/:equipmentId/oil/:oilId] Oil updated:",
        { equipmentId, oilId }
      );
      res.status(200).json({ success: true, data: updatedOil });
    } catch (err) {
      console.error(
        "[PATCH /api/equipment/:equipmentId/oil/:oilId] Error:",
        err
      );
      next(err);
    }
  }
);

// PUT /api/equipment/:equipmentId/oil/:oilId/replace - Replace an oil
router.put(
  "/:equipmentId/oil/:oilId/replace",
  protect,
  authorize("admin", "analyst", "superadmin"),
  async (req, res, next) => {
    try {
      const { equipmentId, oilId } = req.params;
      const {
        oilTypeId,
        brand,
        name,
        oilType, // This is the string from req.body (e.g., "neat")
        fillDate,
        volume,
        application,
        notes,
      } = req.body;

      if (
        !mongoose.Types.ObjectId.isValid(equipmentId) ||
        !mongoose.Types.ObjectId.isValid(oilId)
      ) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid equipment or oil ID" });
      }
      if (!oilTypeId || !fillDate || !oilType) {
        return res.status(400).json({
          success: false,
          message: "oilTypeId, fillDate, and oilType are required",
        });
      }

      const equipment = await Equipment.findOne({
        _id: equipmentId,
        companyId: req.user.companyId,
        deletedAt: null,
      });
      if (!equipment) {
        return res.status(404).json({
          success: false,
          message: "Equipment not found or unauthorized",
        });
      }

      const oldOil = equipment.oilHistory.id(oilId);
      if (!oldOil || oldOil.deletedAt) {
        return res
          .status(404)
          .json({ success: false, message: "Oil not found or deleted" });
      }

      const oilTypeDoc = await OilType.findOne({
        _id: oilTypeId,
        isDeleted: false,
      });
      if (!oilTypeDoc) {
        return res
          .status(404)
          .json({ success: false, message: "Oil type not found" });
      }

      // Validate oilType matches OilType document
      if (oilType !== oilTypeDoc.type) {
        return res.status(400).json({
          success: false,
          message: `Oil type ${oilType} does not match stored type ${oilTypeDoc.type}`,
        });
      }

      // Move old oil to oilChangeHistory
      const oldOilData = {
        oilTypeId: oldOil.oilTypeId,
        brand: oldOil.brand,
        name: oldOil.name,
        oilType: oldOil.oilType,
        fillDate: oldOil.fillDate,
        volume: oldOil.volume,
        application: oldOil.application,
        notes: oldOil.notes,
        healthScore: oldOil.healthScore,
        replacedAt: new Date(),
      };
      equipment.oilChangeHistory.push(oldOilData);

      // Remove old oil from oilHistory
      equipment.oilHistory.pull(oilId);

      // Add new oil
      const newOil = {
        oilTypeId,
        brand: brand || oilTypeDoc.brand,
        name: name || oilTypeDoc.name,
        oilType, // Use the validated oilType from req.body
        fillDate: new Date(fillDate),
        volume: volume || 0,
        application,
        notes,
        healthScore: 100,
        lastHealthUpdate: new Date(),
      };
      equipment.oilHistory.push(newOil);

      // Recalculate equipment health
      const healthData = await calculateHealth(equipmentId);
      equipment.healthScore = healthData.equipmentHealth;
      equipment.lastHealthUpdate = new Date();

      await equipment.save();

      await createSystemNotification({
        equipmentId,
        companyId: req.user.companyId,
        userId: req.user._id,
        type: "system-update",
        shortMessage: `Oil replaced in ${equipment.name}`,
        detailedMessage: `Oil ${oldOil.name} replaced with ${newOil.name} in ${equipment.name}.`,
      });

      const addedOil = equipment.oilHistory[equipment.oilHistory.length - 1];
      console.log(
        "[PUT /api/equipment/:equipmentId/oil/:oilId/replace] Oil replaced:",
        { equipmentId, oilId }
      );
      res.status(200).json({ success: true, data: addedOil });
    } catch (err) {
      console.error(
        "[PUT /api/equipment/:equipmentId/oil/:oilId/replace] Error:",
        err
      );
      next(err);
    }
  }
);

// DELETE /api/equipment/:equipmentId/oil/:oilId - Soft delete oil
router.delete(
  "/:equipmentId/oil/:oilId",
  protect,
  authorize("admin", "analyst", "superadmin"),
  async (req, res, next) => {
    try {
      const { equipmentId, oilId } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(equipmentId) ||
        !mongoose.Types.ObjectId.isValid(oilId)
      ) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid equipment or oil ID" });
      }

      const equipment = await Equipment.findOne({
        _id: equipmentId,
        companyId: req.user.companyId,
        deletedAt: null,
      });
      if (!equipment) {
        return res.status(404).json({
          success: false,
          message: "Equipment not found or unauthorized",
        });
      }

      const oilEntry = equipment.oilHistory.id(oilId);
      if (!oilEntry || oilEntry.deletedAt) {
        return res.status(404).json({
          success: false,
          message: "Oil not found or already deleted",
        });
      }

      oilEntry.deletedAt = new Date();
      await equipment.save();

      // Recalculate equipment health
      const healthData = await calculateHealth(equipmentId);
      equipment.healthScore = healthData.equipmentHealth;
      equipment.lastHealthUpdate = new Date();
      await equipment.save();

      console.log(
        "[DELETE /api/equipment/:equipmentId/oil/:oilId] Oil soft-deleted:",
        { equipmentId, oilId }
      );
      res.status(200).json({ success: true, message: "Oil soft-deleted" });
    } catch (err) {
      console.error(
        "[DELETE /api/equipment/:equipmentId/oil/:oilId] Error:",
        err
      );
      next(err);
    }
  }
);

module.exports = router;
