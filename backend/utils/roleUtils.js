const roleHierarchy = require("../config/roleHierarchy");

const getRoleLevel = (roleType, role) => {
  return roleHierarchy[roleType]?.[role] || 0;
};

const hasRequiredRole = (
  userRoleType,
  userRole,
  requiredRoleType,
  requiredRole
) => {
  if (userRoleType !== requiredRoleType) return false;
  const userLevel = getRoleLevel(userRoleType, userRole);
  const requiredLevel = getRoleLevel(requiredRoleType, requiredRole);
  return userLevel >= requiredLevel;
};

module.exports = { getRoleLevel, hasRequiredRole };
