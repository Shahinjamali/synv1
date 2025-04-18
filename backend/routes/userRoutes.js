const express = require("express");
const router = express.Router();
const { body, query, validationResult } = require("express-validator");
const User = require("../models/userModel");
const mongoose = require("mongoose");
const {
  protect,
  authorize,
  checkCompanyPermission,
} = require("../middlewares/authMiddleware");

const { auditLog } = require("../middlewares/auditMiddleware"); // Add this import
const Company = require("../models/companyModel");

router.get(
  "/",
  protect,
  authorize("admin"),
  [
    query("page").isInt({ min: 1 }).optional(),
    query("limit").isInt({ min: 1 }).optional(),
    query("search").optional().trim(),
    query("role").optional(),
    query("companyId").optional(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    const { page = 1, limit = 10, search, role, companyId } = req.query;

    try {
      let query = { isDeleted: false };

      if (search) {
        query = {
          ...query,
          $or: [
            { username: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        };
      }
      if (role) query.roles = role;
      if (companyId) query.companyId = companyId;

      const users = await User.find(query)
        .select("-password")
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .lean();
      const total = await User.countDocuments(query);

      res.json({
        success: true,
        data: users,
        total,
        pages: Math.ceil(total / limit),
        currentPage: parseInt(page),
      });
    } catch (err) {
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

router.post(
  "/bulk-delete",
  protect,
  authorize("admin"),
  [body("userIds").isArray().notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    const { userIds } = req.body;

    try {
      const result = await User.updateMany(
        { _id: { $in: userIds }, isDeleted: false },
        { isDeleted: true }
      );
      if (result.modifiedCount === 0)
        return res
          .status(404)
          .json({ success: false, message: "No users found to delete" });
      res.json({
        success: true,
        message: `${result.modifiedCount} users soft-deleted successfully`,
      });
    } catch (err) {
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

router.get("/:id", protect, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid user ID" });
  }

  const isAdmin = req.user.roles.includes("admin");
  const isSelf = req.user._id.toString() === req.params.id;

  if (!isAdmin && !isSelf) {
    return res.status(403).json({ success: false, message: "Unauthorized" });
  }

  try {
    const user = await User.findOne({
      _id: req.params.id,
      isDeleted: false,
    }).select("-password");
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post(
  "/",
  protect,
  authorize("admin"),
  [
    body("username").notEmpty().trim(),
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }),
    body("firstName").notEmpty().trim(),
    body("lastName").notEmpty().trim(),
    body("companyId").notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    const { username, email, password, firstName, lastName, companyId, roles } =
      req.body;

    try {
      const existingUser = await User.findOne({
        $or: [{ username }, { email }],
      });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Username or email already exists",
        });
      }

      const user = new User({
        username,
        email,
        password,
        firstName,
        lastName,
        companyId,
        roles: roles || ["user"],
        phone: "0000000000", // Temporary fallback
        position: "Unknown", // Temporary fallback
      });
      await user.save();
      res.status(201).json({
        success: true,
        data: { _id: user._id, username, email, roles: user.roles },
      });
    } catch (err) {
      console.error("[POST /api/users] Error:", err); // Log the full error
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

router.put("/:id", protect, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid user ID" });
  }

  const isAdmin = req.user.roles.includes("admin");
  const isSelf = req.user._id.toString() === req.params.id;

  if (!isAdmin && !isSelf) {
    return res.status(403).json({ success: false, message: "Unauthorized" });
  }

  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      req.body,
      { new: true, runValidators: true }
    ).select("-password");
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.delete("/:id", protect, authorize("admin"), async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid user ID" });
  }

  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    res.json({ success: true, message: "User soft-deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});
router.post(
  "/request",
  protect,
  authorize("admin"),
  [body("additionalUsers").isInt({ min: 1 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    const { additionalUsers } = req.body;
    try {
      // Placeholder for Synix approval process (e.g., queue request)
      console.log(
        `User ${req.user._id} requested ${additionalUsers} more users for company ${req.user.companyId}`
      );
      res.json({ success: true, message: "Request submitted to Synix" });
      // TODO: Implement Synix approval (e.g., email or admin queue)
    } catch (err) {
      console.error("Request error:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

router.put("/:id/roles", protect, authorize("admin"), async (req, res) => {
  const { roles, permissions } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, companyId: req.user.companyId, isDeleted: false },
      { roles, permissions },
      { new: true }
    ).select("-password");
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Example CRUD with permission matrix
router.put(
  "/equipment/:id",
  protect,
  checkCompanyPermission("equipment"),
  auditLog("update_equipment", (req, res) => ({ updates: req.body })),
  async (req, res) => {
    try {
      // Placeholder for equipment update logic
      // Replace with actual Equipment model logic
      res.json({ success: true, message: "Equipment updated" });
    } catch (err) {
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

module.exports = router;
