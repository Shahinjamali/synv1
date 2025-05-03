const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const roleHierarchy = require("../config/roleHierarchy");
const { hasRequiredRole } = require("../utils/roleUtils");

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
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("[Protect] ❌ Error verifying token:", err.message);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

const authorize = (requiredRoleType, requiredRole) => {
  return (req, res, next) => {
    const user = req.user;

    if (
      !user ||
      !user.roleType ||
      !user.roles ||
      !Array.isArray(user.roles) ||
      !user.roles.length ||
      !hasRequiredRole(
        user.roleType,
        user.roles[0] || "user",
        requiredRoleType,
        requiredRole
      )
    ) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    next();
  };
};

const checkCompanyPermission = (sections) => {
  return (req, res, next) => {
    if (
      req.user.roles.includes("superadmin") &&
      req.user.roleType === "owner"
    ) {
      return next();
    }

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

const allowPublicOrProtectAccess = (entityVisibilityField = "visibility") => {
  return async (req, res, next) => {
    const entity = req.entity; // Assume you load product/service into req.entity earlier

    if (!entity) {
      return res
        .status(404)
        .json({ success: false, message: "Entity not found" });
    }

    const visibility = entity[entityVisibilityField];

    if (visibility?.isPublic) {
      return next();
    }

    if (visibility?.requiresAuth) {
      if (!req.user) {
        return res
          .status(401)
          .json({ success: false, message: "Authentication required" });
      }
      return next();
    }

    if (Array.isArray(visibility?.restrictedRoles)) {
      if (
        !req.user ||
        !visibility.restrictedRoles.includes(req.user.roles[0])
      ) {
        return res
          .status(403)
          .json({ success: false, message: "Access restricted by role" });
      }
      return next();
    }

    return res.status(403).json({ success: false, message: "Access denied" });
  };
};

module.exports = {
  protect,
  authorize,
  checkCompanyPermission,
  allowPublicOrProtectAccess,
};
