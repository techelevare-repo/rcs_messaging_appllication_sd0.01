import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Paper, TextField, Button, Typography, Alert } from '@mui/material';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');
        try {
            const res = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
            if (res.data.success) {
                if (res.data.token) {
                    // Auto-redirect to reset page with the token when available (dev flow)
                    navigate(`/reset-password?token=${encodeURIComponent(res.data.token)}`);
                    return;
                }
                setMessage('If the email exists, we sent reset instructions.');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setError(res.data.message || 'Failed to request password reset');
            }
        } catch (err) {
            setMessage('If the email exists, we sent reset instructions.');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
            <Paper elevation={3} sx={{ p: 4, maxWidth: 420, width: '90%' }}>
                <Typography variant="h5" gutterBottom>Forgot Password</Typography>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
                <form onSubmit={handleSubmit}>
                    <TextField fullWidth required type="email" label="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }} disabled={loading}>Request Reset</Button>
                </form>
                <Button onClick={() => navigate('/login')}
                    fullWidth variant="outlined" sx={{ mt: 2 }} >
                    Back to Login
                </Button>
            </Paper>
        </Box>
    );
}


