'use client';

import {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from 'react';
import { useRouter } from 'next/navigation';
import { User, AuthContextType } from '@/types/auth';
import { ApiError } from '@/types/api';
import { loginUser, logoutUser, checkAuthStatus } from '@/utils/api';
import GlobalLoader from '@/components/common/GlobalLoader';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({
  children,
  loader,
}: {
  children: React.ReactNode;
  loader?: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [authState, setAuthState] = useState<
    'loading' | 'authenticated' | 'guest'
  >('loading');
  const router = useRouter();
  const lastAuthCheck = useRef<number>(0);
  const hasCheckedOnce = useRef(false);

  const checkAuth = useCallback(() => {
    const now = Date.now();

    if (process.env.NODE_ENV === 'development') {
      if (now - lastAuthCheck.current < 300) {
        console.log('[AuthProvider] Skipped redundant auth check (throttled)');
        return;
      }
      lastAuthCheck.current = now;
    }

    setAuthState('loading');

    checkAuthStatus()
      .then((res) => {
        setUser(res.data);
        setAuthState('authenticated');
      })
      .catch((error: unknown) => {
        const apiError = error as ApiError;
        console.error(
          '[AuthProvider] Auth check failed:',
          apiError.message || 'Unknown error'
        );
        setUser(null);
        setAuthState('guest');
      });
  }, []);

  useEffect(() => {
    if (!hasCheckedOnce.current) {
      hasCheckedOnce.current = true;
      if (process.env.NODE_ENV === 'production') {
        checkAuth();
      } else {
        setTimeout(checkAuth, 500);
      }
    }
  }, [checkAuth]);

  const login = async (email: string, password: string) => {
    try {
      const res = await loginUser(email, password);
      setUser(res.data);
      setAuthState('authenticated');
      const role = res.data.roles?.[0] || 'user';
      await router.push(`/dashboard/${role}`);
      return { success: true };
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.error('Login error:', apiError.message || 'Login failed');
      return { success: false, message: apiError.message || 'Login failed' };
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.warn('Logout error:', apiError.message || 'Unknown error');
    } finally {
      setUser(null);
      setAuthState('guest');
      router.replace('/login');
    }
  };

  const refreshAuth = async () => {
    checkAuth();
  };

  const loading = authState === 'loading';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: authState === 'authenticated',
        loading,
        login,
        logout,
        refreshAuth,
      }}
    >
      {loading ? (loader ?? <GlobalLoader stage="auth" />) : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
