import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { lightTheme, darkTheme } from '../utils/CreateThemes';
import ThemeToggle from '../components/ThemeToggle';
import { Outlet } from 'react-router-dom'; // 👈 important

const THEME_KEY = 'dashboard-theme-mode';

const DashboardLayout: React.FC = () => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const storedMode = localStorage.getItem(THEME_KEY) as 'light' | 'dark' | null;
    if (storedMode === 'light' || storedMode === 'dark') {
      setMode(storedMode);
    }
  }, []);

  const handleToggle = () => {
    setMode((prev) => {
      const newMode = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem(THEME_KEY, newMode);
      return newMode;
    });
  };

  return (
    <ThemeProvider theme={mode === 'light' ? lightTheme : darkTheme}>
      <div
        style={{
          backgroundColor:
            mode === 'light'
              ? lightTheme.palette.background.default
              : darkTheme.palette.background.default,
          minHeight: '100vh',
          width: '100%',
        }}
      >
        <ThemeToggle mode={mode} onToggle={handleToggle} />
        <Outlet /> {/* 👈 Replaces {children} */}
      </div>
    </ThemeProvider>
  );
};

export default DashboardLayout;
