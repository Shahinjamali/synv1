// utils/path.ts

export interface DashboardPathInfo {
  roleType: 'owner' | 'customer';
  role: string;
  sections: string[];
}
export function parseDashboardPathDynamic(
  pathname: string
): DashboardPathInfo | null {
  const parts = pathname.split('/').filter(Boolean);

  // Basic structure must be at least: /dashboard/{roleType}/{role}
  if (parts.length < 3 || parts[0] !== 'dashboard') {
    return null;
  }

  const [, roleType, role, ...sections] = parts;

  // Validate roleType strictly
  if (roleType !== 'owner' && roleType !== 'customer') {
    return null;
  }

  // Ensure role is provided
  if (!role || typeof role !== 'string') {
    return null;
  }

  // Return structured path info
  return {
    roleType: roleType as 'owner' | 'customer',
    role: role.toLowerCase(), // normalize role to lowercase
    sections: sections.map((section) => section.toLowerCase()), // normalize all sections too
  };
}
