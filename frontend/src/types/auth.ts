// src/types/auth.ts
export type UserRole =
  | 'superadmin'
  | 'admin'
  | 'manager'
  | 'analyst'
  | 'technician'
  | 'user';

export interface User {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  companyId: string;
  email: string;
  roles: string[];
  hasCompletedWelcome: boolean;
}

export interface ErrorResponse {
  message?: string;
  success?: boolean;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}
