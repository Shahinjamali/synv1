const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const rateLimit = require("express-rate-limit");
const User = require("../models/userModel");
const Company = require("../models/companyModel");
const {
  protect,
  authorize,
  checkCompanyPermission,
} = require("../middlewares/authMiddleware");

const limiter = rateLimit({
  windowMs: 15 * 60 * 60 * 1000,
  max: 1000,
});

const generateToken = (id, roles, roleType) => {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET not defined");
  return jwt.sign({ id, roles, roleType }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// ========== [ POST /api/auth/login ] ==========
router.post(
  "/login",
  limiter,
  [body("email").isEmail().normalizeEmail(), body("password").notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email: email.toLowerCase() }).select(
        "+password"
      );

      if (!user) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid email or password" });
      }

      const isPasswordMatch = await user.matchPassword(password);
      if (!isPasswordMatch) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid email or password" });
      }

      const token = generateToken(user._id, user.roles, user.roleType);

      const cookieOptions = {
        httpOnly: true,
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
      };

      res.cookie("token", token, cookieOptions);

      res.status(200).json({
        success: true,
        data: {
          _id: user._id,
          username: user.username,
          email: user.email,
          roles: user.roles,
          roleType: user.roleType,
          hasCompletedWelcome: user.hasCompletedWelcome,
        },
      });
    } catch (err) {
      console.error("❌ [Login] Server error:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

// ========== [ POST /api/auth/logout ] ==========
router.post("/logout", async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json({ success: true, message: "Logged out successfully" });
});

// ========== [ GET /api/auth/check-auth ] ==========
router.get("/check-auth", protect, async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not authenticated" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.error("❌ [CheckAuth] Server error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
