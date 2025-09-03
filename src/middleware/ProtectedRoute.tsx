// src/components/routes/ProtectedRoute.tsx

import { CircularProgress } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      setIsAuthenticated(!!token);
    };

    checkAuth(); // check on mount

    // Optional: listen for token changes (logout/login in other tabs)
    const handleStorage = () => checkAuth();
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  // While checking auth state
  if (isAuthenticated === null) {
    return <CircularProgress/>; // or spinner
  }

  // If not authenticated, redirect
  if (!isAuthenticated) {
    console.log('Access denied. User is not authenticated.');
    return <Navigate to="/" replace />;
  }

  // If authenticated, render child routes
  return <Outlet />;
};

export default ProtectedRoute;
