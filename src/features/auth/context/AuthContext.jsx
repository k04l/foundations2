// src/features/auth/context/AuthContext.jsx

import { createContext, useState, useEffect } from 'react';

// Create and export the context
export const AuthContext = createContext({
  user: null,
  loading: true,
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
  setUser: () => {}
});

// The context gets its values from the provider, which we'll define separately

