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
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Badge,
  styled,
  Tooltip,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import BookIcon from '@mui/icons-material/Book';
import ForumIcon from '@mui/icons-material/Forum';
import EventIcon from '@mui/icons-material/Event';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GavelIcon from '@mui/icons-material/Gavel';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Outlet, Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { lightTheme, darkTheme } from '../utils/CreateThemes';
import ThemeToggle from '../components/ThemeToggle';
import { useAuth } from '../contexts/AuthContext';
import { routes } from '../app/route';

const drawerWidth = 200;
const THEME_KEY = 'dashboard-theme-mode';

const menuItems = [
  {
    label: 'Dashboard',
    icon: <DashboardIcon fontSize="small" />,
    to: routes.admin.dashboard,
    match: routes.admin.dashboard,
  },
  {
    label: 'Users',
    icon: <PeopleIcon fontSize="small" />,
    to: routes.admin.users.index,
    match: routes.admin.users.index,
  },
  {
    label: 'Books',
    icon: <BookIcon fontSize="small" />,
    to: routes.admin.books.index,
    match: routes.admin.books.index,
  },
  {
    label: 'Forums',
    icon: <ForumIcon fontSize="small" />,
    to: routes.admin.forums.index,
    match: routes.admin.forums.index,
  },
  {
    label: 'Events',
    icon: <EventIcon fontSize="small" />,
    to: routes.admin.events.index,
    match: routes.admin.events.index,
  },
  {
    label: 'Challenges',
    icon: <EmojiEventsIcon fontSize="small" />,
    to: routes.admin.challenges.index,
    match: routes.admin.challenges.index,
  },
  {
    label: 'Moderation',
    icon: <GavelIcon fontSize="small" />,
    to: routes.admin.posts.reported,
    match: routes.admin.posts.reported
  },
];

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

const DashboardLayout: React.FC = () => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const open = Boolean(anchorEl);
  const isSmallScreen = useMediaQuery('(max-width:786px)');

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

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await logout();
    navigate(routes.login);
  };

  const formatLastLogin = (dateString?: string) => {
    if (!dateString) return 'Never logged in';
    const date = new Date(dateString);
    return `Last: ${date.toLocaleDateString()}`;
  };

  const isActive = (path: string) => {
    return location.pathname === path || 
           location.pathname.startsWith(path + '/');
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ minHeight: '38px' }}>
        <Typography variant="h6" noWrap sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
          Admin Panel
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ flex: 1, p: 0.5 }}>
        {menuItems.map(({ label, icon, to, match }) => (
          <ListItem
            key={label}
            button
            component={RouterLink as React.ElementType}
            to={to}
            selected={isActive(match)}
            sx={{
              borderRadius: 1,
              mb: 0.5,
              px: 1.5,
              py: 0.75,
              '&.Mui-selected': {
                backgroundColor: mode === 'light' ? 'rgba(1, 237, 196, 0.2)' : 'rgba(1, 237, 196, 0.3)',
                color: mode === 'light' ? '#23085A' : '#01EDC4',
                '& .MuiListItemIcon-root': {
                  color: mode === 'light' ? '#23085A' : '#01EDC4',
                },
              },
              '&:hover': {
                backgroundColor: mode === 'light' ? 'rgba(1, 237, 196, 0.1)' : 'rgba(1, 237, 196, 0.2)',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: '30px' }}>{icon}</ListItemIcon>
            <ListItemText 
              primary={label} 
              primaryTypographyProps={{ 
                fontSize: '0.85rem',
                fontWeight: isActive(match) ? 600 : 'normal'
              }} 
            />
          </ListItem>
        ))}
      </List>
      {user && (
        <Box sx={{ 
          p: 1, 
          backgroundColor: mode === 'light' ? 'rgba(0, 0, 0, 0.02)' : 'rgba(255, 255, 255, 0.05)',
          fontSize: '0.7rem',
          color: mode === 'light' ? '#4A3C8C' : '#E0E0E0'
        }}>
          {formatLastLogin(user.lastLogin)}
        </Box>
      )}
    </Box>
  );

  return (
    <ThemeProvider theme={mode === 'light' ? lightTheme : darkTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <AppBar
          position="fixed"
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            boxShadow: 'none',
            backgroundColor: mode === 'light' ? '#23085A' : '#1A0A4A',
            color: 'white',
            height: '48px',
            justifyContent: 'center'
          }}
        >
          <Toolbar sx={{ 
            minHeight: '48px !important', 
            px: isSmallScreen ? 1 : 1.5,
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {isSmallScreen && (
                <IconButton
                  color="inherit"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 1 }}
                >
                  <MenuIcon fontSize="small" />
                </IconButton>
              )}
              <Typography 
                variant="h6" 
                noWrap 
                sx={{ 
                  fontSize: '0.95rem', 
                  fontWeight: 600,
                  marginLeft: isSmallScreen ? 0 : '8px' // Adjust margin based on screen size
                }}
              >
                Dashboard
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ThemeToggle mode={mode} onToggle={handleToggle} />
              
              <Tooltip title="Notifications">
                <IconButton color="inherit" size="small" sx={{ p: 0.75 }}>
                  <Badge badgeContent={4} color="error" overlap="circular">
                    <NotificationsIcon fontSize="small" />
                  </Badge>
                </IconButton>
              </Tooltip>

              <IconButton onClick={handleMenuOpen} size="small" sx={{ p: 0.5 }}>
                <StyledBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  variant="dot"
                >
                  <Avatar
                    alt={user?.name || 'User'}
                    src={'/static/images/avatar/1.jpg'}
                    sx={{ width: 26, height: 26, fontSize: '0.75rem' }}
                  >
                    {user?.name?.charAt(0) || 'U'}
                  </Avatar>
                </StyledBadge>
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        {!isSmallScreen && (
          <Drawer
            variant="permanent"
            sx={{
              '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
                borderRight: 'none',
              },
            }}
            open
          >
            {drawerContent}
          </Drawer>
        )}

        {isSmallScreen && (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
              },
            }}
          >
            {drawerContent}
          </Drawer>
        )}

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            backgroundColor: (theme) => theme.palette.background.default,
            width: { xs: '100%', sm: '80%', md: '78%', lg: '85%', xl: '100%' },
            py: 1,
            px: { xs: 2, sm: 3 },
            marginLeft: isSmallScreen ? 0 : `${drawerWidth}px`,
            transition: (theme) => theme.transitions.create('margin', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          }}
        >
          <Toolbar sx={{ minHeight: '48px !important' }} />
          <Box sx={{ p: 1.5 }}>
            <Outlet />
          </Box>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          onClick={handleMenuClose}
          PaperProps={{
            elevation: 3,
            sx: {
              width: 160,
              overflow: 'visible',
              mt: 0.5,
              '& .MuiAvatar-root': {
                width: 26,
                height: 26,
                ml: -0.5,
                mr: 1,
              },
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={() => navigate('/profile')} sx={{ py: 0.75 }}>
            <ListItemIcon sx={{ minWidth: '30px' }}>
              <AccountCircleIcon fontSize="small" />
            </ListItemIcon>
            <Typography variant="body2">Profile</Typography>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout} sx={{ py: 0.75 }}>
            <ListItemIcon sx={{ minWidth: '30px' }}>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <Typography variant="body2">Logout</Typography>
          </MenuItem>
        </Menu>
      </Box>
    </ThemeProvider>
  );
};

export default DashboardLayout;