import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Paper, TextField, Button, Typography, Alert } from '@mui/material';

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const token = searchParams.get('token') || '';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/auth/reset-password', { token, password });
            if (res.data.success) {
                setMessage('Password reset successful. Redirecting to login...');
                setTimeout(() => navigate('/login'), 1500);
            } else {
                setError(res.data.message || 'Failed to reset password');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
            <Paper elevation={3} sx={{ p: 4, maxWidth: 420, width: '90%' }}>
                <Typography variant="h5" gutterBottom>Reset Password</Typography>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
                <form onSubmit={handleSubmit}>
                    <TextField fullWidth required type="password" label="New Password" value={password} onChange={(e) => setPassword(e.target.value)} sx={{ mb: 2 }} />
                    <TextField fullWidth required type="password" label="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }} disabled={loading}>Reset Password</Button>
                </form>
            </Paper>
        </Box>
    );
}



