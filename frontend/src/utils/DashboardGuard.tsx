'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import { UserRole } from '@/types/auth';
import Loading from '@/components/ui/Loading';

interface DashboardGuardProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
}

const DashboardGuard = ({
  children,
  requiredRoles = [],
}: DashboardGuardProps) => {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const userRole = user?.roles?.[0] || 'user';
  const safeRequiredRoles = Array.isArray(requiredRoles) ? requiredRoles : [];

  useEffect(() => {
    if (loading || !router.isReady) return;

    if (!isAuthenticated) {
      console.log('DashboardGuard - Not authenticated, redirecting to /login');
      router.push('/login');
      return;
    }

    // Allow sub-routes under /dashboard/[role]
    const validPathPrefix = `/dashboard/${userRole}`;
    if (!router.asPath.startsWith(validPathPrefix)) {
      console.log(
        'DashboardGuard - Role mismatch, redirecting to:',
        validPathPrefix
      );
      router.push(validPathPrefix);
      return;
    }

    if (safeRequiredRoles.length > 0 && !safeRequiredRoles.includes(userRole)) {
      console.log(
        'DashboardGuard - Unauthorized role, redirecting to:',
        validPathPrefix
      );
      router.push(validPathPrefix);
      return;
    }
  }, [
    loading,
    router,
    isAuthenticated,
    user,
    userRole,
    safeRequiredRoles,
    router.isReady,
  ]);

  if (loading || !router.isReady) {
    return <Loading size="medium" text="Loading Dashboard..." />;
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
};

export default DashboardGuard;
