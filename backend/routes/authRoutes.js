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
  windowMs: 15 * 60 * 1000,
  max: 1000,
});

const generateToken = (id, roles) => {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET not defined");
  return jwt.sign({ id, roles }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

router.get("/check-auth", async (req, res) => {
  const token = req.cookies.token;
  if (!token)
    return res
      .status(401)
      .json({ success: false, message: "Not authenticated" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        roles: user.roles,
        permissions: user.permissions || [],
        companyId: user.companyId,
        hasCompletedWelcome: user.hasCompletedWelcome,
      },
    });
  } catch (err) {
    res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
});

router.post(
  "/register",
  [
    body("username").notEmpty().trim(),
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }),
    body("firstName").notEmpty().trim(),
    body("lastName").notEmpty().trim(),
    body("phone").notEmpty().trim(),
    body("position").notEmpty().trim(),
    body("companyId").notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    const {
      username,
      email,
      password,
      firstName,
      lastName,
      companyId,
      phone,
      position,
      roles,
      companyPermissions,
    } = req.body;

    if (
      !username ||
      !email ||
      !password ||
      !firstName ||
      !lastName ||
      !companyId ||
      !phone ||
      !position
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    try {
      const existingUser = await User.findOne({
        $or: [{ username }, { email: email.toLowerCase() }],
      });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Username or email already exists",
        });
      }

      const company = await Company.findById(companyId);
      if (!company) {
        return res.status(400).json({
          success: false,
          message: "Invalid company ID",
        });
      }

      const existingAdmin = await User.findOne({
        companyId,
        roles: { $in: ["admin", "superadmin"] },
      });
      if (existingAdmin && roles?.includes("admin")) {
        return res.status(400).json({
          success: false,
          message: "An admin already exists for this company",
        });
      }

      const user = new User({
        username,
        email: email.toLowerCase(),
        password,
        firstName,
        lastName,
        companyId,
        phone,
        position,
        roles: roles || ["user"],
        companyPermissions: companyPermissions || {},
      });

      const companyUsers = await User.countDocuments({ companyId });
      if (companyUsers === 0) user.isInitialAdmin = true;

      await user.save();

      const token = generateToken(user._id, user.roles);
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      res.status(201).json({
        success: true,
        data: { _id: user._id, username, email, roles: user.roles },
      });
    } catch (err) {
      console.error("Register error:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

router.post(
  "/login",
  limiter,
  [body("email").isEmail().normalizeEmail(), body("password").notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    const { email, password, rememberMe } = req.body;

    try {
      const user = await User.findOne({ email: email.toLowerCase() }).select(
        "+password"
      );
      if (!user || !(await user.matchPassword(password))) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid email or password" });
      }

      const token = generateToken(user._id, user.roles);
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      };
      if (rememberMe) cookieOptions.maxAge = 30 * 24 * 60 * 60 * 1000;

      res.cookie("token", token, cookieOptions);
      res.status(200).json({
        success: true,
        data: {
          _id: user._id,
          username: user.username,
          email,
          roles: user.roles,
          hasCompletedWelcome: user.hasCompletedWelcome,
        },
      });
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

router.post("/logout", (req, res) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("User logged out:", decoded.id);
    } catch (err) {
      console.warn("Invalid token on logout:", err.message);
    }
  }
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({ success: true, message: "Logged out successfully" });
});

router.get("/profile", protect, async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      _id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      roles: req.user.roles,
      companyId: req.user.companyId,
      companyPermissions: req.user.companyPermissions,
    },
  });
});

router.get("/admin", protect, authorize("admin", "superadmin"), (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome Admin",
    data: {
      _id: req.user._id,
      username: req.user.username,
      roles: req.user.roles,
    },
  });
});

router.get(
  "/company/manage-users",
  protect,
  checkCompanyPermission("canManageUsers"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Access granted: You can manage users",
      data: { _id: req.user._id, username: req.user.username },
    });
  }
);

// Added /setup route
router.post("/setup", protect, authorize("admin"), async (req, res) => {
  const { companyName, address, industry, contactPhone, contactEmail } =
    req.body;
  if (!req.user.isInitialAdmin) {
    return res
      .status(403)
      .json({ success: false, message: "Not initial Admin" });
  }
  try {
    const company = await Company.findOneAndUpdate(
      { _id: req.user.companyId },
      {
        companyName,
        address: {
          street: address.street,
          city: address.city,
          postalCode: address.postalCode,
          country: address.country,
          additionalInfo: address.additionalInfo || "",
        },
        industryId: industry, // Assuming industry is an ID
        contact: {
          email: contactEmail,
          phone: contactPhone,
        },
        isSetupComplete: true,
      },
      { new: true, runValidators: true }
    );
    if (!company)
      return res
        .status(404)
        .json({ success: false, message: "Company not found" });
    res.json({ success: true, data: company });
  } catch (err) {
    console.error("Setup error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/complete-welcome", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    user.hasCompletedWelcome = true;
    await user.save();
    res.status(200).json({ success: true, message: "Welcome setup completed" });
  } catch (err) {
    console.error("[POST /api/auth/complete-welcome] Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
