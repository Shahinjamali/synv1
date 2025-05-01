'use client';

import {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { hasRequiredRole } from '@/utils/roles';
import {
  loginUser,
  adminUsers,
  logoutUser,
  checkAuthStatus,
} from '@/utils/api';

import { User, AuthContextType } from '@/types/auth';
import { ApiError } from 'next/dist/server/api-utils';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getDashboardRedirectPath = (
  roleType: 'owner' | 'customer',
  role: string
) => {
  return `/dashboard/${roleType}/${role}/${roleType === 'owner' ? 'overview' : 'overview'}`;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authState, setAuthState] = useState<
    'loading' | 'authenticated' | 'guest'
  >('loading');
  const router = useRouter();
  const searchParams = useSearchParams();
  const lastAuthCheck = useRef<number>(0);
  const hasCheckedOnce = useRef(false);

  const checkAuth = useCallback(async () => {
    const now = Date.now();
    if (now - lastAuthCheck.current < 10 * 1000) {
      return;
    }
    lastAuthCheck.current = now;

    setAuthState('loading');
    try {
      const res = await checkAuthStatus();
      setUser(res.data);
      setAuthState('authenticated');
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.error('checkAuth: Error in checkAuthStatus', {
        message: apiError.message || 'Unknown error',
        status: apiError,
      });
      setUser(null);
      setAuthState('guest');
    }
  }, []);

  useEffect(() => {
    if (!hasCheckedOnce.current) {
      hasCheckedOnce.current = true;
      checkAuth();
    }
  }, [checkAuth, authState, user]);

  const refreshAuth = useCallback(async () => {
    await checkAuth();
  }, [checkAuth]);

  const login = useCallback(
    async (
      email: string,
      password: string,
      isAdminLogin = false
    ): Promise<{ success: boolean; message?: string }> => {
      try {
        const res = isAdminLogin
          ? await adminUsers(email, password)
          : await loginUser(email, password);

        setUser(res.data);
        setAuthState('authenticated');

        await refreshAuth(); // ✅ Add this here!

        const userRole = res.data.roles[0] || 'user';
        const roleType = res.data.roleType;
        const redirectPath =
          searchParams.get('redirect') ||
          getDashboardRedirectPath(roleType, userRole);
        await router.push(redirectPath);

        return { success: true };
      } catch (error: unknown) {
        const apiError = error as ApiError;
        return { success: false, message: apiError.message || 'Login failed' };
      }
    },
    [setUser, setAuthState, router, searchParams, refreshAuth]
  );

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.error('logout: Error in logoutUser', {
        message: apiError.message || 'Unknown error',
        status: apiError,
      });
    } finally {
      setUser(null);
      setAuthState('guest');
      router.replace('/login');
    }
  }, [router]);

  const hasRole = useCallback(
    (roleType: 'owner' | 'customer', role: string) => {
      if (!user) {
        return false;
      }
      const hasRoleResult = hasRequiredRole(
        user.roleType,
        user.roles[0] || 'user',
        roleType,
        role
      );
      return hasRoleResult;
    },
    [user]
  );

  const value = useMemo(() => {
    const authContextValue = {
      user,
      isAuthenticated: authState === 'authenticated',
      loading: authState === 'loading',
      login,
      logout,
      refreshAuth,
      hasRole,
    };
    return authContextValue;
  }, [user, authState, login, logout, refreshAuth, hasRole]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    console.error('useAuth: Context is undefined, not within AuthProvider');
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
