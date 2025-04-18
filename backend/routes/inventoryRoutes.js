const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Inventory } = require("../models/inventoryModel");
const { protect, authorize } = require("../middlewares/authMiddleware");

// ✅ GET all inventory (Authenticated Users, Company-Specific, Paginated)
router.get("/", protect, async (req, res, next) => {
  try {
    const { productId, location, status, page = 1, limit = 10 } = req.query;
    const query = req.user.roles.includes("admin")
      ? {}
      : { companyId: req.user.companyId }; // Admins see all, others see their company only

    if (productId) query.productId = productId;
    if (location) query.location = location;
    if (status) query.status = status;

    const inventory = await Inventory.find(query)
      .populate("productId", "name category")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    const total = await Inventory.countDocuments(query);

    res.json({
      inventory,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
    });
  } catch (err) {
    next(err);
  }
});

// ✅ GET inventory by ID (Authenticated Users, Company-Specific)
router.get("/:id", protect, async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid inventory ID" });
    }

    const inventory = await Inventory.findOne({
      _id: req.params.id,
      companyId: req.user.roles.includes("admin")
        ? { $exists: true }
        : req.user.companyId, // Admins see all, others see their company only
    })
      .populate("productId", "name category")
      .lean();

    if (!inventory)
      return res.status(404).json({ message: "Inventory not found" });

    res.json(inventory);
  } catch (err) {
    next(err);
  }
});

// ✅ POST create inventory (Admin Only)
router.post("/", protect, authorize("admin"), async (req, res, next) => {
  try {
    const { productId, batchNumber, location, quantity } = req.body;
    if (!productId || !batchNumber || !location || quantity === undefined) {
      return res.status(400).json({
        message:
          "Product ID, batch number, location, and quantity are required",
      });
    }

    const newInventory = new Inventory({
      ...req.body,
      companyId: req.user.companyId,
    });
    await newInventory.save();

    res.status(201).json(newInventory);
  } catch (err) {
    next(err);
  }
});

// ✅ PUT update inventory (Admin Only)
router.put("/:id", protect, authorize("admin"), async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid inventory ID" });
    }

    const updatedInventory = await Inventory.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedInventory)
      return res.status(404).json({ message: "Inventory not found" });

    res.json(updatedInventory);
  } catch (err) {
    next(err);
  }
});

// ✅ DELETE inventory (Admin Only)
router.delete("/:id", protect, authorize("admin"), async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid inventory ID" });
    }

    const inventory = await Inventory.findByIdAndDelete(req.params.id);
    if (!inventory)
      return res.status(404).json({ message: "Inventory not found" });

    res.json({ message: "Inventory deleted successfully" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
