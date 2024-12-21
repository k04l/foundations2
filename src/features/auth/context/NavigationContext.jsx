// src/features/auth/context/NavigationContext.jsx
import React, { createContext, useEffect, useState } from 'react';

export const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path) => {
    // Update the URL
    window.history.pushState({}, '', path);
    // Update our path state
    setCurrentPath(path);
  };

  return (
    <NavigationContext.Provider value={{ currentPath, navigate }}>
      {children}
    </NavigationContext.Provider>
  );
};
