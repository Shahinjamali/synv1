'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const Admin = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        if (user?.roleType === 'owner' && user?.roles.includes('superadmin')) {
          router.push('/admin/dashboard');
        } else if (
          user?.roleType === 'customer' &&
          user?.roles.includes('admin')
        ) {
          router.push('/dashboard/admin');
        } else {
          router.push('/admin/login');
        }
      } else {
        router.push('/admin/login');
      }
    }
  }, [loading, isAuthenticated, user, router]);

  return null;
};

export default Admin;
