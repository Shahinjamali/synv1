// File: backend/routes/oilTypeRoutes.js
const express = require("express");
const router = express.Router();
const OilType = require("../models/oilTypeModel");
const Equipment = require("../models/equipmentModel");
const { protect, authorize } = require("../middlewares/authMiddleware");

// POST /api/oil-types - Create new oil type
router.post(
  "/",
  protect,
  authorize("admin", "analyst", "superadmin"),
  async (req, res, next) => {
    try {
      const { name, brand, properties, type } = req.body;

      if (!name || !brand) {
        return res
          .status(400)
          .json({ success: false, message: "Name and brand are required" });
      }

      const existingOilType = await OilType.findOne({
        name,
        brand,
        isDeleted: false,
      });
      if (existingOilType) {
        return res.status(200).json({ success: true, data: existingOilType });
      }

      const newOilType = new OilType({ name, brand, properties, type });
      await newOilType.save();

      res.status(201).json({ success: true, data: newOilType });
    } catch (err) {
      console.error("[POST /api/oil-types] Error:", err);
      next(err);
    }
  }
);

// GET /api/oil-types - Search oil types
router.get("/", protect, async (req, res, next) => {
  try {
    const { query, brand } = req.query;
    const searchQuery = { isDeleted: false }; // Only active oil types
    if (query) searchQuery.name = new RegExp(query, "i");
    if (brand) searchQuery.brand = new RegExp(brand, "i");
    const oilTypes = await OilType.find(searchQuery).lean();
    res.status(200).json({ success: true, data: oilTypes });
  } catch (err) {
    console.error("[GET /api/oil-types] Error:", err);
    next(err);
  }
});

// PATCH /api/oil-types/:id - Update oil type
router.patch(
  "/:id",
  protect,
  authorize("admin", "analyst", "superadmin"),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, brand, properties, type } = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid oil type ID" });
      }

      if (name && brand) {
        const existing = await OilType.findOne({
          name,
          brand,
          _id: { $ne: id },
          isDeleted: false,
        });
        if (existing) {
          return res
            .status(400)
            .json({
              success: false,
              message: "Oil type name and brand already exist",
            });
        }
      }

      const updates = {};
      if (name) updates.name = name;
      if (brand) updates.brand = brand;
      if (properties) updates.properties = properties;
      if (type) updates.type = type;

      const oilType = await OilType.findOneAndUpdate(
        { _id: id, isDeleted: false },
        { $set: updates },
        { new: true }
      );
      if (!oilType) {
        return res
          .status(404)
          .json({ success: false, message: "Oil type not found" });
      }

      res.status(200).json({ success: true, data: oilType });
    } catch (err) {
      console.error("[PATCH /api/oil-types/:id] Error:", err);
      next(err);
    }
  }
);

// DELETE /api/oil-types/:id - Soft delete oil type
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
          .json({ success: false, message: "Invalid oil type ID" });
      }

      // Check if in use by active equipment
      const inUse = await Equipment.findOne({
        "oilHistory.oilTypeId": id,
        "oilHistory.deletedAt": null,
        deletedAt: null,
      });
      if (inUse) {
        return res.status(400).json({
          success: false,
          message: "Cannot delete oil type in use by active equipment",
        });
      }

      const oilType = await OilType.findOneAndUpdate(
        { _id: id, isDeleted: false },
        { isDeleted: true },
        { new: true }
      );
      if (!oilType) {
        return res
          .status(404)
          .json({ success: false, message: "Oil type not found" });
      }

      console.log("[DELETE /api/oil-types/:id] Soft-deleted oil type:", id);
      res.status(200).json({ success: true, message: "Oil type soft-deleted" });
    } catch (err) {
      console.error("[DELETE /api/oil-types/:id] Error:", err);
      next(err);
    }
  }
);

module.exports = router;
