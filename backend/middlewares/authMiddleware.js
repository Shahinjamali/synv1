const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const roleHierarchy = require("../config/roleHierarchy");
const { hasRequiredRole } = require("../utils/roleUtils");

const protect = async (req, res, next) => {
  const token = req.cookies.token;
  console.log(
    "[Protect] Token in cookie:",
    token ? "✅ Present" : "❌ Missing"
  );

  if (!token) {
    console.log("[Protect] No token provided");
    return res
      .status(401)
      .json({ success: false, message: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("[Protect] Token decoded:", decoded);

    const user = await User.findById(
      new mongoose.Types.ObjectId(decoded.id)
    ).select("-password");

    if (!user) {
      console.log("[Protect] ❌ User not found for ID:", decoded.id);
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    console.log(
      `[Protect] ✅ User found: ${user.email}, roleType: ${user.roleType}, roles: ${user.roles}`
    );
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
    console.log(
      `[Authorize] Checking access for user: ${user?.email}, roleType: ${user?.roleType}, roles: ${user?.roles}`
    );

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
      console.log(
        `[Authorize] ❌ Access denied. Required: roleType=${requiredRoleType}, roles=${requiredRole}`
      );
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    console.log("[Authorize] ✅ Access granted");
    next();
  };
};

const checkCompanyPermission = (sections) => {
  return (req, res, next) => {
    console.log(
      `[checkCompanyPermission] Checking permissions for user: ${req.user?.email}, sections: ${sections}`
    );

    if (
      req.user.roles.includes("superadmin") &&
      req.user.roleType === "owner"
    ) {
      console.log(
        "[checkCompanyPermission] ✅ Superadmin bypass permission check"
      );
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
      console.log("[checkCompanyPermission] ❌ Permission denied");
      return res
        .status(403)
        .json({ success: false, message: "Permission denied" });
    }

    console.log("[checkCompanyPermission] ✅ Permission granted");
    next();
  };
};

const allowPublicOrProtectAccess = (entityVisibilityField = "visibility") => {
  return async (req, res, next) => {
    const entity = req.entity; // Assume you load product/service into req.entity earlier
    console.log("[allowPublicOrProtectAccess] Checking entity visibility...");

    if (!entity) {
      console.log("[allowPublicOrProtectAccess] ❌ No entity found");
      return res
        .status(404)
        .json({ success: false, message: "Entity not found" });
    }

    const visibility = entity[entityVisibilityField];

    if (visibility?.isPublic) {
      console.log(
        "[allowPublicOrProtectAccess] ✅ Public entity, access granted"
      );
      return next();
    }

    if (visibility?.requiresAuth) {
      if (!req.user) {
        console.log(
          "[allowPublicOrProtectAccess] ❌ Auth required but user not logged in"
        );
        return res
          .status(401)
          .json({ success: false, message: "Authentication required" });
      }
      console.log(
        "[allowPublicOrProtectAccess] ✅ Authenticated user, access granted"
      );
      return next();
    }

    if (Array.isArray(visibility?.restrictedRoles)) {
      if (
        !req.user ||
        !visibility.restrictedRoles.includes(req.user.roles[0])
      ) {
        console.log("[allowPublicOrProtectAccess] ❌ User role not permitted");
        return res
          .status(403)
          .json({ success: false, message: "Access restricted by role" });
      }
      console.log("[allowPublicOrProtectAccess] ✅ Role match, access granted");
      return next();
    }

    console.log("[allowPublicOrProtectAccess] ❌ Default: Access denied");
    return res.status(403).json({ success: false, message: "Access denied" });
  };
};

module.exports = {
  protect,
  authorize,
  checkCompanyPermission,
  allowPublicOrProtectAccess,
};
