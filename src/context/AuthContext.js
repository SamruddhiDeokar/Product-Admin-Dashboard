'use client';

import React, { createContext, useContext } from 'react';
import { useAuth } from '@/hooks/useAuth';

/**
 * Auth Context
 * Provides authentication state and methods to the entire app
 */
const AuthContextObject = createContext(null);

export const AuthProvider = ({ children }) => {
  const auth = useAuth();

  return (
    <AuthContextObject.Provider value={auth}>
      {children}
    </AuthContextObject.Provider>
  );
};

/**
 * Custom hook to use Auth Context
 */
export const useAuthContext = () => {
  const context = useContext(AuthContextObject);

  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }

  return context;
};
