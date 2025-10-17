"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserSession, SessionData } from '@/lib/auth/types';
import {
  getSession,
  saveSession,
  clearSession,
  isSessionValid,
  hasRole,
  hasAnyRole,
  hasAllRoles,
} from '@/lib/auth/session';

interface AuthContextType {
  user: UserSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: UserSession) => void;
  logout: () => void;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  hasAllRoles: (roles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Component mount olduğunda session'ı kontrol et
    const session = getSession();
    if (session && session.isAuthenticated) {
      setUser(session.user);
    }
    setIsLoading(false);
  }, []);

  const login = (userData: UserSession) => {
    setUser(userData);
    saveSession(userData);
  };

  const logout = () => {
    setUser(null);
    clearSession();
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: user !== null,
    isLoading,
    login,
    logout,
    hasRole: (role: string) => hasRole(role),
    hasAnyRole: (roles: string[]) => hasAnyRole(roles),
    hasAllRoles: (roles: string[]) => hasAllRoles(roles),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
