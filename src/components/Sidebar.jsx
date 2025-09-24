import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
  Divider,
} from '@mui/material';
import {
  Dashboard,
  CloudUpload,
  History,
  Assessment,
  Settings,
  Biotech,
  Menu as MenuIcon,
  Login,
  PersonAdd,
  AdminPanelSettings,
  Logout,
  People
} from '@mui/icons-material';
import UserProfile from './UserProfile';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const drawerWidth = 240;

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigationItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Upload & Analyze', icon: <CloudUpload />, path: '/upload' },
    { text: 'Scan History', icon: <History />, path: '/history' },
    { text: 'Reports & Analytics', icon: <Assessment />, path: '/reports' },
    { text: 'Settings', icon: <Settings />, path: '/settings' },
    { text: 'Developer Space', icon: <Biotech />, path: '/developer' },
  ];

  // Add admin navigation item if user is admin
  if (isAuthenticated && user?.role === 'admin') {
    navigationItems.push({ text: 'Admin Panel', icon: <AdminPanelSettings />, path: '/admin' });
  }

  // Add doctor patient management if user is doctor
  if (isAuthenticated && user?.role === 'doctor') {
    navigationItems.push({ text: 'Patient Management', icon: <People />, path: '/doctor-patients' });
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <>
      <Box
        sx={{
          p: 3,
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Biotech sx={{ fontSize: 28, color: 'primary.main' }} />
        <Typography variant="h6" fontWeight={600} color="primary.main">
          RadiologyAI
        </Typography>
      </Box>

      <UserProfile />

      <List sx={{ py: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {navigationItems.map((item) => (
          <ListItemButton
            key={item.text}
            component={Link}
            to={item.path}
            onClick={() => isMobile && handleDrawerToggle()}
            selected={
              location.pathname === item.path ||
              (location.pathname === '/' && item.path === '/dashboard')
            }
            sx={{
              mx: 2,
              mb: 1,
              borderRadius: 2,
              '&.Mui-selected': {
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': { backgroundColor: 'primary.dark' },
                '& .MuiListItemIcon-root': { color: 'white' },
              },
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <ListItemIcon sx={{ color: 'text.secondary' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{ fontWeight: 500 }}
            />
          </ListItemButton>
        ))}
        <Box sx={{ flexGrow: 1 }} />
        <Divider sx={{ my: 2 }} />

        {isAuthenticated ? (
          <ListItemButton
            onClick={handleLogout}
            sx={{
              mx: 2,
              mb: 2,
              borderRadius: 2,
              backgroundColor: 'error.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'error.dark',
                '& .MuiListItemIcon-root': { color: 'white' },
              },
            }}
          >
            <ListItemIcon sx={{ color: 'white' }}>
              <Logout />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              primaryTypographyProps={{ fontWeight: 600 }}
            />
          </ListItemButton>
        ) : (
          <>
            <ListItemButton
              onClick={handleLogin}
              sx={{
                mx: 2,
                mb: 1,
                borderRadius: 2,
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                  '& .MuiListItemIcon-root': { color: 'white' },
                },
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>
                <Login />
              </ListItemIcon>
              <ListItemText
                primary="Login"
                primaryTypographyProps={{ fontWeight: 600 }}
              />
            </ListItemButton>

            <ListItemButton
              onClick={handleRegister}
              sx={{
                mx: 2,
                mb: 2,
                borderRadius: 2,
                border: '2px solid',
                borderColor: 'primary.main',
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.light',
                  color: 'white',
                  '& .MuiListItemIcon-root': { color: 'white' },
                },
              }}
            >
              <ListItemIcon sx={{ color: 'primary.main' }}>
                <PersonAdd />
              </ListItemIcon>
              <ListItemText
                primary="Register"
                primaryTypographyProps={{ fontWeight: 600 }}
              />
            </ListItemButton>
          </>
        )}
      </List>

    </>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {isMobile && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{
            mr: 2,
            display: { md: 'none' },
            position: 'fixed',
            top: 10,
            left: 10,
            // Ensure it stays above the AppBar which is set to zIndex drawer + 1
            zIndex: (theme) => theme.zIndex.appBar + 1,
            bgcolor: 'background.paper',
            '&:hover': { bgcolor: 'action.hover' },
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={isMobile ? handleDrawerToggle : undefined}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          width: { md: drawerWidth },
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: 'background.paper',
            borderRight: '1px solid',
            borderColor: 'divider',
            height: '100vh',
            position: 'fixed',
          },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
}