import { useState } from 'react';
import {
    Box,
    Avatar,
    Typography,
    IconButton,
    Menu,
    MenuItem,
    CircularProgress
} from '@mui/material';
import {
    Logout,
    Settings,
    Person
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function TopRightProfile() {
    const { user, loading, isAuthenticated, logout } = useAuth();
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
        handleMenuClose();
    };

    const handleSettings = () => {
        navigate('/settings');
        handleMenuClose();
    };

    const handleProfile = () => {
        navigate('/profile');
        handleMenuClose();
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={20} />
            </Box>
        );
    }

    if (!isAuthenticated || !user) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                    Not logged in
                </Typography>
                <IconButton
                    onClick={() => navigate('/login')}
                    sx={{ p: 0 }}
                >
                    <Avatar
                        sx={{
                            width: 32,
                            height: 32,
                            bgcolor: 'grey.300'
                        }}
                    >
                        ?
                    </Avatar>
                </IconButton>
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
                {user.firstName} {user.lastName}
            </Typography>
            <IconButton
                onClick={handleMenuOpen}
                sx={{ p: 0 }}
            >
                <Avatar
                    src={user.profilePicture}
                    alt={user.firstName}
                    sx={{
                        width: 32,
                        height: 32,
                        bgcolor: 'primary.main'
                    }}
                >
                    {user.firstName?.[0]?.toUpperCase()}
                </Avatar>
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <MenuItem onClick={handleProfile}>
                    <Person sx={{ mr: 1 }} />
                    Profile
                </MenuItem>
                <MenuItem onClick={handleSettings}>
                    <Settings sx={{ mr: 1 }} />
                    Settings
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                    <Logout sx={{ mr: 1 }} />
                    Logout
                </MenuItem>
            </Menu>
        </Box>
    );
}
