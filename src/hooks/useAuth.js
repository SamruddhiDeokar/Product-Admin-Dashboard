'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/api/authAPI';
import { ROUTES } from '@/utils/constants';

/**
 * Hook for managing authentication state and actions
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Initialize auth state from storage on mount
  useEffect(() => {
    try {
      const storedToken = authAPI.getToken();
      const storedUser = authAPI.getCurrentUser();

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
        setIsAuthenticated(true);
      } else {
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error('Failed to restore auth session:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Login handler
  const login = useCallback(
    async (username, password) => {
      setIsLoading(true);
      setError(null);

      const result = await authAPI.login(username, password);

      if (result.success) {
        setToken(result.data.token);
        setUser(result.data);
        setIsAuthenticated(true);
        setIsLoading(false);
        router.push(ROUTES.DASHBOARD);
        return { success: true };
      } else {
        setError(result.error);
        setIsLoading(false);
        return { success: false, error: result.error };
      }
    },
    [router]
  );

  // Logout handler
  const logout = useCallback(() => {
    authAPI.logout();
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    router.push(ROUTES.LOGIN);
  }, [router]);

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
  };
};
