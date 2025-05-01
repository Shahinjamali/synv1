'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { parseDashboardPathDynamic } from '@/utils/path';
import { getDashboardHome, getRoleLevel } from '@/utils/routing';
import Loading from '@/components/common/Loading';

interface DashboardGuardProps {
  children: React.ReactNode;
}

const DashboardGuard = ({ children }: DashboardGuardProps) => {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return; // Wait for auth check to complete

    let redirectTo: string | null = null;

    if (!isAuthenticated || !user) {
      redirectTo = `/login?redirect=${encodeURIComponent(pathname)}`;
    } else if (pathname.startsWith('/dashboard/')) {
      const parsed = parseDashboardPathDynamic(pathname);

      if (!parsed) {
        console.warn(`Invalid dashboard path: ${pathname}`);
        redirectTo = '/forbidden';
      } else {
        const { roleType: pathRoleType, role: pathRole, sections } = parsed;
        const userRoleType = user.roleType;
        const userPrimaryRole = user.roles?.[0]?.toLowerCase() || 'user';

        // Check if user is accessing the wrong role type dashboard
        if (pathRoleType !== userRoleType) {
          console.warn(
            `RoleType mismatch: ${userRoleType} trying to access ${pathRoleType}`
          );
          redirectTo = getDashboardHome(userRoleType, userPrimaryRole);
        } else {
          const userLevel = getRoleLevel(userRoleType, userPrimaryRole);
          const requiredLevel = getRoleLevel(pathRoleType, pathRole);

          if (requiredLevel === 0) {
            console.warn(`Invalid required role: ${pathRole}`);
            redirectTo = '/forbidden';
          } else if (userLevel < requiredLevel) {
            console.warn(
              `Access denied: user level ${userLevel} < required level ${requiredLevel}`
            );
            redirectTo = '/forbidden';
          } else {
            // If visiting the base dashboard path without any section, redirect to overview
            const basePath = `/dashboard/${pathRoleType}/${pathRole}`;
            if (pathname === basePath && sections.length === 0) {
              redirectTo = getDashboardHome(
                pathRoleType as 'owner' | 'customer',
                pathRole
              );
            }
          }
        }
      }
    }

    if (redirectTo) {
      router.replace(redirectTo);
    }
  }, [loading, isAuthenticated, user, pathname, router]);

  if (loading) {
    return <Loading size="medium" text="Checking access..." />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default DashboardGuard;
