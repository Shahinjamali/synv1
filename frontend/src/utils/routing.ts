export const ROLES = {
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

const DEFAULT_SECTIONS: Record<'owner' | 'customer', string> = {
  owner: 'overview',
  customer: 'overview',
};

export const getDashboardHome = (
  roleType: 'owner' | 'customer',
  role: string
): string => {
  const defaultSection = DEFAULT_SECTIONS[roleType] || 'overview';
  return `/dashboard/${roleType}/${role.toLowerCase()}/${defaultSection}`;
};

export const getRoleLevel = (roleType: string, role: string): number => {
  if (!(roleType in ROLES)) return 0;
  const roleObject = ROLES[roleType as keyof typeof ROLES];
  return roleObject[role.toLowerCase() as keyof typeof roleObject] || 0;
};
