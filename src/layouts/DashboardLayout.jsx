

import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../state/AuthContext.jsx';
import { useVision } from '../state/VisionContext.jsx';
import {
  AppBar,
  Toolbar,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Typography,
  Button,
  Chip,
  Stack,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const { activeModels, hasActiveModels } = useVision();
  const navigate = useNavigate();

  // Dropdown menu
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  // Profile photo preview dialog
  const [openPreview, setOpenPreview] = useState(false);
  const handleOpenPreview = () => setOpenPreview(true);
  const handleClosePreview = () => setOpenPreview(false);

  const handleProfileSettings = () => {
    navigate('/profile');
    handleMenuClose();
  };
 
   const handleSettings = () => {
    navigate('/settings');
    handleMenuClose();
  };


  const handleLogout = () => {
    logout();
    handleMenuClose();
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: 300,
          [`& .MuiDrawer-paper`]: {
            width: 300,
            background: 'linear-gradient(180deg, #0b1220, #101a2d)',
            color: '#fff',
            borderRight: '1px solid #1e2a3a',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography
            variant="h5"
            component={Link}
            to="/"
            sx={{
              color: 'inherit',
              textDecoration: 'none',
              fontWeight: 'bold',
              letterSpacing: 0.5,
            }}
          >
            Vision UI
          </Typography>
        </Box>

        <List>
          {[
            { text: 'Dashboard', to: '/' },
            { text: 'Models Catalog', to: '/models' },
            { text: 'Vision Processing', to: '/vision-processing' },
            { text: 'Results & Reports', to: '/results' },
            { text: 'Profile', to: '/profile' },
            { text: 'Settings', to: '/settings' },
          ].map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton component={NavLink} to={item.to}>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}

          {user?.role === 'admin' && (
            <>
              <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.1)' }} />
              <ListItem disablePadding>
                <ListItemButton component={NavLink} to="/admin">
                  <ListItemText primary="Admin Panel" />
                </ListItemButton>
              </ListItem>
            </>
          )}
        </List>
      </Drawer>

      {/* Main Section */}
      <Box sx={{ flex: 1, ml: '300px' }}>
        {/* Navbar */}
        <AppBar
          position="fixed"
        //   color="transparent"
        //   elevation={0}
          sx={{
            width: 'calc(100% - 300px)',
            ml: '300px',
            borderBottom: '1px solid #253056',
            background: 'linear-gradient(90deg, #0b1220, #101a2d)',
            px: 3,
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between', py: 2, minHeight: 80 }}>
            {/* Left - Model Info */}
            <Stack direction="row" spacing={1} alignItems="center">
              {hasActiveModels ? (
                <>
                  <Chip label="Active Model" size="small" color="success" />
                  <Typography variant="body1" color="rgba(255,255,255,0.8)">
                    {activeModels[0].name}
                  </Typography>
                </>
              ) : (
                <Chip label="Active model" size="small" color="default" />                
              )}
            </Stack>

            {/* Right - Profile section */}
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: 'white',
                  fontSize: '1.25rem',
                  mr: 1,
                }}
              >
                {user?.firstName ? `${user.firstName} ${user.lastName}` : 'User'}
              </Typography>

              {/* Profile Photo (click to enlarge) */}
              <IconButton onClick={handleOpenPreview} sx={{ p: 0 }}>
                <Avatar
                  src={user?.profilePicture || undefined}
                  alt={user?.firstName}
                  sx={{
                    width: 48,
                    height: 48,
                    bgcolor: '#1976d2',
                    fontWeight: 600,
                    color: 'white',
                    border: '2px solid #1e2a3a',
                  }}
                >
                  {user?.firstName?.[0] || 'U'}
                </Avatar>
              </IconButton>

              {/* 3-dot menu */}
              <IconButton onClick={handleMenuOpen}>
                <MoreVertIcon sx={{ color: 'white' }} />
              </IconButton>

              {/* Dropdown Menu */}
              <Menu
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    mt: 1.5,
                    backgroundColor: '#0b1220',
                    color: 'white',
                    borderRadius: 2,
                    minWidth: 180,
                    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                  },
                }}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem onClick={handleProfileSettings}>Profile </MenuItem>
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />
                <MenuItem onClick={handleSettings}>Setting </MenuItem>
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />
                <MenuItem onClick={handleLogout} sx={{ color: '#ff5252' }}>
                  Logout
                </MenuItem>
              </Menu>
            </Stack>
          </Toolbar>
        </AppBar>

        {/* Main Page Content */}
        <Box component="main" sx={{ p: 3 }}>
          <Outlet />
        </Box>
      </Box>

      {/* Profile Photo Preview Dialog */}
      <Dialog open={openPreview} onClose={handleClosePreview}>
        <Box
          sx={{
            p: 2,
            backgroundColor: '#0b1220',
            textAlign: 'center',
            borderRadius: 2,
          }}
        >
          <Avatar
            src={user?.profilePicture || undefined}
            alt={user?.firstName}
            sx={{
              width: 200,
              height: 200,
              mx: 'auto',
              bgcolor: '#1976d2',
              fontSize: 60,
              fontWeight: 600,
              color: 'white',
            }}
          >
            {user?.firstName?.[0] || 'U'}
          </Avatar>
          <Typography
            variant="h6"
            sx={{ mt: 2, color: 'white', fontWeight: 600 }}
          >
            {user?.firstName} {user?.lastName}
          </Typography>
        </Box>
      </Dialog>
    </Box>
  );
};

export default DashboardLayout;
