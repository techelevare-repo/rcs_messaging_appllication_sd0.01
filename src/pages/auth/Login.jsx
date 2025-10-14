import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../state/AuthContext.jsx';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, loading } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const result = await login(email, password);

        if (result.success) {
            const redirectTo = location.state?.from?.pathname || '/';
            navigate(redirectTo, { replace: true });
        } else {
            setError(result.message || 'Login failed');
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
                                Welcome Back
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                                Sign in to your Vision AI account
                            </Typography>
                        </Box>

                        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

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
                        <TextField
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                            {loading ? 'Logging in...' : 'Sign In'}
                        </Button>

                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                Don't have an account? <Link to="/register" style={{ color: '#4f7cff', textDecoration: 'none', fontWeight: 500 }}>Create Account</Link>
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

export default Login;


