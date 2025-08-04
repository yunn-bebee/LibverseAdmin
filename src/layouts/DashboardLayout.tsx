import React, { useState, useEffect } from 'react';
import {
  ThemeProvider,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import { Outlet, Link as RouterLink } from 'react-router-dom';

import { lightTheme, darkTheme } from '../utils/CreateThemes';
import ThemeToggle from '../components/ThemeToggle';

const drawerWidth = 200;
const THEME_KEY = 'dashboard-theme-mode';

const menuItems = [
  {
    label: 'Dashboard',
    icon: <DashboardIcon />,
    to: '/dashboard',
  },
  {
    label: 'Settings',
    icon: <SettingsIcon />,
    to: '/settings',
  },
];

const DashboardLayout: React.FC = () => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const storedMode = localStorage.getItem(THEME_KEY) as 'light' | 'dark' | null;
    if (storedMode) {
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

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerContent = (
    <div>
      <Toolbar />
      <List>
        {menuItems.map(({ label, icon, to }) => (
          <ListItem
            key={label}
            button
            component={RouterLink as React.ElementType}
            to={to}
          >
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={label} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <ThemeProvider theme={mode === 'light' ? lightTheme : darkTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        {/* AppBar */}
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Dashboard
            </Typography>
            <ThemeToggle mode={mode} onToggle={handleToggle} />
          </Toolbar>
        </AppBar>

        {/* Sidebar for desktop */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>

        {/* Sidebar for mobile */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Main content area with proper spacing for tables */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            backgroundColor:
              mode === 'light'
                ? lightTheme.palette.background.default
                : darkTheme.palette.background.default,
          }}
        >
          <Toolbar />
          <Box
            sx={{
              width: '100%',
              maxWidth: 1280,
              mx: 'auto',
              px: 3,
              py: 4,
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default DashboardLayout;
