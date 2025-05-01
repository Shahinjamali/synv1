'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { getDashboardHome } from '@/utils/routing';
import Loading from '@/components/common/Loading';

export default function DashboardPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (isAuthenticated && user) {
      const roleType = user.roleType;
      const primaryRole = user.roles?.[0]?.toLowerCase() || 'user';
      const homePath = getDashboardHome(roleType, primaryRole);

      router.replace(homePath);
    } else {
      router.replace('/login');
    }
  }, [loading, isAuthenticated, user, router]);

  if (loading) return <Loading size="large" text="Loading dashboard..." />;

  return null;
}
