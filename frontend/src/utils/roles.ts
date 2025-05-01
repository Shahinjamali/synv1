export interface RoleHierarchy {
  [key: string]: number;
}

export interface Roles {
  owner: RoleHierarchy;
  customer: RoleHierarchy;
}

export const ROLES: Roles = {
  owner: {
    superadmin: 4,
    manager: 3,
    admin: 2,
    user: 1,
  },
  customer: {
    admin: 5,
    manager: 4,
    analyst: 3,
    technician: 2,
    user: 1,
  },
};

export type RoleType = keyof Roles;

export const getRoleLevel = (roleType: RoleType, role: string): number => {
  const roleHierarchy = ROLES[roleType];
  if (!roleHierarchy) return 0;

  // Safely access, allow undefined, fallback to 0
  return roleHierarchy[role as keyof typeof roleHierarchy] ?? 0;
};

export const hasRequiredRole = (
  userRoleType: 'owner' | 'customer',
  userRole: string,
  requiredRoleType: 'owner' | 'customer',
  requiredRole: string
): boolean => {
  if (userRoleType !== requiredRoleType) return false;
  const userLevel = getRoleLevel(userRoleType, userRole);
  const requiredLevel = getRoleLevel(requiredRoleType, requiredRole);
  return userLevel >= requiredLevel;
};
