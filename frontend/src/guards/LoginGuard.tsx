'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getDashboardHome } from '@/utils/routing';
import Loading from '@/components/common/Loading';

interface LoginGuardProps {
  children: React.ReactNode;
}

const LoginGuard = ({ children }: LoginGuardProps) => {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // Important: wait until loading finishes

    if (isAuthenticated && user) {
      const roleType = user.roleType;
      const primaryRole = user.roles?.[0]?.toLowerCase() || 'user';
      const dashboardPath = getDashboardHome(roleType, primaryRole);

      if (router) {
        router.replace(dashboardPath);
      }
    }
  }, [loading, isAuthenticated, user, router]);

  if (loading) {
    return <Loading size="medium" text="Checking session..." />;
  }

  if (isAuthenticated) {
    // Still return null to block children if already authenticated
    return null;
  }

  return <>{children}</>;
};

export default LoginGuard;
