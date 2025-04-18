const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Order } = require("../models/orderModel");
const { protect, authorize } = require("../middlewares/authMiddleware");

// ✅ GET all orders (Users See Their Orders, Admins See All, Paginated)
router.get("/", protect, async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = req.user.roles.includes("admin")
      ? {}
      : { userId: req.user._id }; // Admins see all, users see their own orders

    if (status) query.status = status;

    const orders = await Order.find(query)
      .populate("userId", "username email")
      .populate("items.productId", "name price")
      .sort({ orderDate: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
    });
  } catch (err) {
    next(err);
  }
});

// ✅ GET order by ID (Users Can Only See Their Orders, Admins See All)
router.get("/:id", protect, async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await Order.findById(req.params.id)
      .populate("userId", "username email")
      .populate("items.productId", "name price")
      .lean();

    if (!order) return res.status(404).json({ message: "Order not found" });

    // ✅ Restrict users to their own orders unless admin
    if (
      !req.user.roles.includes("admin") &&
      order.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Unauthorized access to order" });
    }

    res.json(order);
  } catch (err) {
    next(err);
  }
});

// ✅ POST create order (Authenticated Users)
router.post("/", protect, async (req, res, next) => {
  try {
    const { items, shippingAddress } = req.body;
    if (!items || !Array.isArray(items) || !shippingAddress) {
      return res
        .status(400)
        .json({ message: "Items and shipping address are required" });
    }

    const newOrder = new Order({ ...req.body, userId: req.user._id });
    await newOrder.save();

    res.status(201).json(newOrder);
  } catch (err) {
    next(err);
  }
});

// ✅ PUT update order (Admin Only)
router.put("/:id", protect, authorize("admin"), async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedOrder)
      return res.status(404).json({ message: "Order not found" });

    res.json(updatedOrder);
  } catch (err) {
    next(err);
  }
});

// ✅ DELETE order (Admin Only)
router.delete("/:id", protect, authorize("admin"), async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
