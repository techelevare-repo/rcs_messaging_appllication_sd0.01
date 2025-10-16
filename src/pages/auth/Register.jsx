import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../state/AuthContext.jsx';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const Register = () => {
    const navigate = useNavigate();
    const { register, loading } = useAuth();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('user');
    const [error, setError] = useState('');
    const [passwordErrors, setPasswordErrors] = useState([]);

    const validatePassword = (password) => {
        const errors = [];
        if (password.length < 8) {
            errors.push('Password must be at least 8 characters long');
        }
        if (!/[A-Z]/.test(password)) {
            errors.push('Password must contain at least one uppercase letter');
        }
        if (!/[a-z]/.test(password)) {
            errors.push('Password must contain at least one lowercase letter');
        }
        if (!/[0-9]/.test(password)) {
            errors.push('Password must contain at least one number');
        }
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
            errors.push('Password must contain at least one special character');
        }
        return errors;
    };

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        setPasswordErrors(validatePassword(newPassword));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // Validate password strength
        const passwordValidationErrors = validatePassword(password);
        if (passwordValidationErrors.length > 0) {
            setError('Password does not meet requirements');
            return;
        }

        const userData = {
            firstName,
            lastName,
            username,
            email,
            password,
            role
        };

        const result = await register(userData);

        if (result.success) {
            navigate('/', { replace: true });
        } else {
            setError(result.message || 'Registration failed');
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0b1020 0%, #111933 50%, #1a2332 100%)',
            padding: 2
        }}>
            <Container maxWidth="sm">
                <Card sx={{
                    width: '100%',
                    borderRadius: 3,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                    backgroundColor: 'background.paper',
                    border: '1px solid #253056'
                }} component="form" onSubmit={onSubmit}>
                    <CardContent sx={{ p: 4 }}>
                        <Box sx={{ textAlign: 'center', mb: 3 }}>
                            <Typography variant="h4" fontWeight={600} gutterBottom sx={{ color: 'text.primary' }}>
                                Create Account
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                                Join the Vision AI Platform
                            </Typography>
                        </Box>

                        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="First Name"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    fullWidth
                                    required
                                    margin="normal"
                                    sx={{
                                        '& .MuiInputLabel-root': { color: 'text.secondary', fontWeight: 500 },
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: 'background.default',
                                            '& fieldset': { borderColor: '#253056', borderWidth: 2 },
                                            '&:hover fieldset': { borderColor: 'primary.main', borderWidth: 2 },
                                            '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: 2 },
                                            '& input': { color: 'text.primary', fontWeight: 500 }
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Last Name"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    fullWidth
                                    required
                                    margin="normal"
                                    sx={{
                                        '& .MuiInputLabel-root': { color: 'text.secondary', fontWeight: 500 },
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: 'background.default',
                                            '& fieldset': { borderColor: '#253056', borderWidth: 2 },
                                            '&:hover fieldset': { borderColor: 'primary.main', borderWidth: 2 },
                                            '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: 2 },
                                            '& input': { color: 'text.primary', fontWeight: 500 }
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    label="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    fullWidth
                                    required
                                    margin="normal"
                                    sx={{
                                        '& .MuiInputLabel-root': { color: 'text.secondary', fontWeight: 500 },
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: 'background.default',
                                            '& fieldset': { borderColor: '#253056', borderWidth: 2 },
                                            '&:hover fieldset': { borderColor: 'primary.main', borderWidth: 2 },
                                            '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: 2 },
                                            '& input': { color: 'text.primary', fontWeight: 500 }
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    label="Email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    fullWidth
                                    required
                                    margin="normal"
                                    sx={{
                                        '& .MuiInputLabel-root': { color: 'text.secondary', fontWeight: 500 },
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: 'background.default',
                                            '& fieldset': { borderColor: '#253056', borderWidth: 2 },
                                            '&:hover fieldset': { borderColor: 'primary.main', borderWidth: 2 },
                                            '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: 2 },
                                            '& input': { color: 'text.primary', fontWeight: 500 }
                                        }
                                    }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <FormControl fullWidth margin="normal">
                                    <InputLabel id="role-label" sx={{ color: 'text.secondary', fontWeight: 500 }}>Account Type</InputLabel>
                                    <Select
                                        labelId="role-label"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        label="Account Type"
                                        sx={{
                                            backgroundColor: 'background.default',
                                            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#253056', borderWidth: 2 },
                                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main', borderWidth: 2 },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main', borderWidth: 2 },
                                            '& .MuiSelect-select': { color: 'text.primary', fontWeight: 500 }
                                        }}
                                    >
                                        <MenuItem value="user">
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                <PersonIcon fontSize="small" />
                                                <span>User</span>
                                            </Stack>
                                        </MenuItem>
                                        <MenuItem value="admin">
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                <AdminPanelSettingsIcon fontSize="small" />
                                                <span>Administrator</span>
                                            </Stack>
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <Box sx={{ mt: 2, mb: 1 }}>
                                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                                        Password Requirements:
                                    </Typography>
                                    <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap">
                                        <Chip
                                            label="8+ characters"
                                            size="small"
                                            color={password.length >= 8 ? 'success' : 'default'}
                                            variant="outlined"
                                            sx={{
                                                borderColor: password.length >= 8 ? '#4caf50' : '#e0e0e0',
                                                color: password.length >= 8 ? '#4caf50' : '#666666'
                                            }}
                                        />
                                        <Chip
                                            label="Uppercase"
                                            size="small"
                                            color={/[A-Z]/.test(password) ? 'success' : 'default'}
                                            variant="outlined"
                                            sx={{
                                                borderColor: /[A-Z]/.test(password) ? '#4caf50' : '#e0e0e0',
                                                color: /[A-Z]/.test(password) ? '#4caf50' : '#666666'
                                            }}
                                        />
                                        <Chip
                                            label="Lowercase"
                                            size="small"
                                            color={/[a-z]/.test(password) ? 'success' : 'default'}
                                            variant="outlined"
                                            sx={{
                                                borderColor: /[a-z]/.test(password) ? '#4caf50' : '#e0e0e0',
                                                color: /[a-z]/.test(password) ? '#4caf50' : '#666666'
                                            }}
                                        />
                                        <Chip
                                            label="Number"
                                            size="small"
                                            color={/[0-9]/.test(password) ? 'success' : 'default'}
                                            variant="outlined"
                                            sx={{
                                                borderColor: /[0-9]/.test(password) ? '#4caf50' : '#e0e0e0',
                                                color: /[0-9]/.test(password) ? '#4caf50' : '#666666'
                                            }}
                                        />
                                        <Chip
                                            label="Special"
                                            size="small"
                                            color={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? 'success' : 'default'}
                                            variant="outlined"
                                            sx={{
                                                borderColor: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? '#4caf50' : '#e0e0e0',
                                                color: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? '#4caf50' : '#666666'
                                            }}
                                        />
                                    </Stack>
                                </Box>
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    label="Password"
                                    type="password"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    fullWidth
                                    required
                                    margin="normal"
                                    error={passwordErrors.length > 0}
                                    helperText={passwordErrors.length > 0 ? passwordErrors[0] : ''}
                                    sx={{
                                        '& .MuiInputLabel-root': { color: 'text.secondary', fontWeight: 500 },
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: 'background.default',
                                            '& fieldset': { borderColor: '#253056', borderWidth: 2 },
                                            '&:hover fieldset': { borderColor: 'primary.main', borderWidth: 2 },
                                            '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: 2 },
                                            '& input': { color: 'text.primary', fontWeight: 500 }
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    label="Confirm Password"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    fullWidth
                                    required
                                    margin="normal"
                                    error={password !== confirmPassword && confirmPassword.length > 0}
                                    helperText={password !== confirmPassword && confirmPassword.length > 0 ? 'Passwords do not match' : ''}
                                    sx={{
                                        '& .MuiInputLabel-root': { color: 'text.secondary', fontWeight: 500 },
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: 'background.default',
                                            '& fieldset': { borderColor: '#253056', borderWidth: 2 },
                                            '&:hover fieldset': { borderColor: 'primary.main', borderWidth: 2 },
                                            '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: 2 },
                                            '& input': { color: 'text.primary', fontWeight: 500 }
                                        }
                                    }}
                                />
                            </Grid>
                        </Grid>

                        <Button
                            type="submit"
                            variant="contained"
                            disabled={loading}
                            fullWidth
                            sx={{
                                mt: 3,
                                py: 1.5,
                                fontSize: '1.1rem',
                                borderRadius: 2,
                                backgroundColor: 'primary.main',
                                '&:hover': {
                                    backgroundColor: 'primary.dark'
                                }
                            }}
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </Button>

                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                Already have an account? <Link to="/login" style={{ color: '#4f7cff', textDecoration: 'none', fontWeight: 500 }}>Login</Link>
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

export default Register;


