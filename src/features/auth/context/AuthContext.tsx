import { createContext } from 'react';

export interface AuthUser {
  id?: string;
  email?: string;
  name?: string;
  [key: string]: any;
}

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<any>;
  loginWithToken: (token: string) => void;
  logout: () => void;
  setUser: (user: AuthUser | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
