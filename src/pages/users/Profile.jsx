import React, { useState, useEffect } from 'react';
import { useAuth } from '../../state/AuthContext.jsx';
import visionAPI from '../../services/api';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SaveIcon from '@mui/icons-material/Save';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const Profile = () => {
    const { user, logout, updateUser } = useAuth();
    const [profile, setProfile] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        role: 'user',
        profilePicture: null
    });
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});

    // Initialize profile with user data
    useEffect(() => {
        if (user) {
            setProfile({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                username: user.username || '',
                email: user.email || '',
                role: user.role || 'user',
                profilePicture: user.profilePicture || null
            });
            setPreview(user.profilePicture);
        }
    }, [user]);

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile({ ...profile, [name]: value });
        setMessage('');
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                setPreview(base64String);
                setProfile({ ...profile, profilePicture: base64String });
                updateUser({ ...user, profilePicture: base64String });
                // updateProfilePicture(base64String); 
                // setPreview(reader.result);
                // setProfile({ ...profile, profilePicture: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        setMessage('');

        let newErrors = {};
        if (!profile.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }
        if (!profile.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }
        if (!profile.username.trim()) {
            newErrors.username = 'Username is required';
        }
        if (!validateEmail(profile.email)) {
            newErrors.email = 'Enter a valid email address';
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            try {
                // For now, just show success message since we don't have update profile API
                updateUser({ ...user, ...profile });
                setMessage('Profile updated successfully!');
            } catch (error) {
                setMessage(`Error: ${error.message}`);
            }
        }
        setLoading(false);
    };

    if (!user) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3, mt: '60px' }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
                Profile
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
                Manage your account information and preferences
            </Typography>

            <Grid container spacing={3}>
                {/* <Grid size={{ xs: 12, md: 4 }}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Avatar
                                src={preview || user.profilePicture || undefined}
                                sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                            >
                                {user.firstName?.[0]}{user.lastName?.[0]}
                            </Avatar>
                            <Typography variant="h6" gutterBottom>
                                {user.firstName} {user.lastName}
                            </Typography>
                            <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 2 }}>
                                <Chip
                                    icon={user.role === 'admin' ? <AdminPanelSettingsIcon /> : <PersonIcon />}
                                    label={user.role === 'admin' ? 'Administrator' : 'User'}
                                    color={user.role === 'admin' ? 'error' : 'primary'}
                                    variant="outlined"
                                />
                            </Stack>
                            <input
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="upload-avatar"
                                type="file"
                                onChange={handleAvatarChange}
                            />
                            <label htmlFor="upload-avatar">
                                <Button variant="outlined" component="span" size="small">
                                    Change Photo
                                </Button>
                            </label>
                        </CardContent>
                    </Card>
                </Grid> */}

                <Grid size={{ xs: 12 }}>
    <Card sx={{ display: 'flex', alignItems: 'center', p: 3, width: '100%', flexWrap: { xs: 'wrap', sm: 'nowrap'}, }}>
        <Avatar
            src={preview || user.profilePicture || undefined}
            sx={{ width: 120, height: 120, mr: { xs: 0, sm: 3}, mb: { xs: 2, sm: 0 }, }} 
        >
            {user.firstName?.[0]}{user.lastName?.[0]}
        </Avatar>

        <Box sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom>
                {user.firstName} {user.lastName}
            </Typography>

            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <Chip
                    icon={user.role === 'admin' ? <AdminPanelSettingsIcon /> : <PersonIcon />}
                    label={user.role === 'admin' ? 'Administrator' : 'User'}
                    color={user.role === 'admin' ? 'error' : 'primary'}
                    variant="outlined"
                />
            </Stack>

            <input
                accept="image/*"
                style={{ display: 'none' }}
                id="upload-avatar"
                type="file"
                onChange={handleAvatarChange}
            />
            <label htmlFor="upload-avatar">
                <Button variant="outlined" component="span" size="small">
                    Change Photo
                </Button>
            </label>
        </Box>
    </Card>
</Grid>


                <Grid size={{ xs: 12, md: 8 }}>
                    <Card>
                        <CardContent>
                            {message && (
                                <Alert severity={message.includes('Error') ? 'error' : 'success'} sx={{ mb: 2 }}>
                                    {message}
                                </Alert>
                            )}

                            <Accordion defaultExpanded>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography variant="h6">
                                        Personal Information
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Grid container spacing={2}>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField
                                                fullWidth
                                                label="First Name"
                                                name="firstName"
                                                value={profile.firstName}
                                                onChange={handleChange}
                                                error={!!errors.firstName}
                                                helperText={errors.firstName}
                                                required
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField
                                                fullWidth
                                                label="Last Name"
                                                name="lastName"
                                                value={profile.lastName}
                                                onChange={handleChange}
                                                error={!!errors.lastName}
                                                helperText={errors.lastName}
                                                required
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField
                                                fullWidth
                                                label="Username"
                                                name="username"
                                                value={profile.username}
                                                onChange={handleChange}
                                                error={!!errors.username}
                                                helperText={errors.username}
                                                required
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField
                                                fullWidth
                                                type="email"
                                                label="Email"
                                                name="email"
                                                value={profile.email}
                                                onChange={handleChange}
                                                error={!!errors.email}
                                                helperText={errors.email}
                                                required
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12 }}>
                                            <FormControl fullWidth>
                                                <InputLabel id="role-label">Role</InputLabel>
                                                <Select
                                                    labelId="role-label"
                                                    name="role"
                                                    value={profile.role}
                                                    onChange={handleChange}
                                                    disabled
                                                >
                                                    <MenuItem value="user">User</MenuItem>
                                                    <MenuItem value="admin">Administrator</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>

                            <Accordion>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography variant="h6">
                                        Account Information
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Grid container spacing={2}>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField
                                                fullWidth
                                                label="User ID"
                                                value={user._id || 'N/A'}
                                                disabled
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField
                                                fullWidth
                                                label="Last Login"
                                                value={user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
                                                disabled
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField
                                                fullWidth
                                                label="Account Created"
                                                value={user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                                disabled
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField
                                                fullWidth
                                                label="Profile Updated"
                                                value={user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'N/A'}
                                                disabled
                                                variant="outlined"
                                            />
                                        </Grid>
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>

                            <Box sx={{ mt: 3 }}>
                                <Button
                                    variant="contained"
                                    onClick={handleSave}
                                    startIcon={<SaveIcon />}
                                    disabled={loading}
                                    sx={{ mr: 2 }}
                                >
                                    {loading ? <CircularProgress size={20} /> : 'Save Changes'}
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={logout}
                                >
                                    Logout
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Profile;