const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

let roleHierarchy;
try {
  roleHierarchy = require("../config/roleHierarchy");
} catch (err) {
  console.error("[authMiddleware] Failed to load roleHierarchy:", err);
  throw new Error("roleHierarchy configuration failed to load");
}

const protect = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not authenticated" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(
      new mongoose.Types.ObjectId(decoded.id)
    ).select("-password");
    if (!user) {
      console.log("Protect Middleware - User not found for ID:", decoded.id);
      console.log(
        "Protect Middleware - All users in DB:",
        await User.find().select(
          "_id username roles companyId hasCompletedWelcome"
        )
      );
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error("Protect Middleware - Error:", err.message);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    const hasRole = req.user.roles.some((role) => roles.includes(role));
    const hasLevel = roles.some(
      (role) => req.user.roleLevel >= (roleHierarchy[role] || 1)
    );
    if (!hasRole && !hasLevel) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }
    next();
  };
};

const checkCompanyPermission = (sections) => {
  return (req, res, next) => {
    const hasPermission = Array.isArray(sections)
      ? sections.every((section) =>
          req.user.permissions.some(
            (perm) => perm.section === section && perm.level === "readWrite"
          )
        )
      : req.user.permissions.some(
          (perm) => perm.section === sections && perm.level === "readWrite"
        );
    if (!hasPermission) {
      return res
        .status(403)
        .json({ success: false, message: "Permission denied" });
    }
    next();
  };
};

module.exports = { protect, authorize, checkCompanyPermission };
