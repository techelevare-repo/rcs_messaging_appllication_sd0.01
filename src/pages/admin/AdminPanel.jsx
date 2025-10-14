import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    Alert,
    CircularProgress
} from '@mui/material';
import {
    PersonAdd,
    Edit,
    Delete,
    Visibility,
    AdminPanelSettings,
    PersonRemove
} from '@mui/icons-material';
import { useAuth } from '../../state/AuthContext';
import api from '../../services/api';

export default function AdminPanel() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [dialogMode, setDialogMode] = useState('view'); // 'view', 'edit', 'create'

    useEffect(() => {
        if (currentUser?.role === 'admin') {
            fetchAllUsers();
        }
    }, [currentUser]);

    const fetchAllUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/auth/admin/users');

            // Access properties directly from response, not from response.data
            if (response.success) {
                setUsers(response.users);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = () => {
        setSelectedUser({
            firstName: '',
            lastName: '',
            username: '',
            email: '',
            password: '',
            role: 'user'
        });
        setDialogMode('create');
        setOpenDialog(true);
    };

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setDialogMode('edit');
        setOpenDialog(true);
    };

    const handleViewUser = (user) => {
        setSelectedUser(user);
        setDialogMode('view');
        setOpenDialog(true);
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            return;
        }
        try {
            await api.delete(`/auth/admin/users/${userId}`);
            fetchAllUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            setError('Failed to delete user');
        }
    };

    const handleSaveUser = async () => {
        try {
            if (dialogMode === 'create') {
                await api.post('/auth/admin/users', selectedUser);
            } else if (dialogMode === 'edit') {
                await api.put(`/auth/admin/users/${selectedUser._id}`, selectedUser);
            }

            setOpenDialog(false);
            fetchAllUsers();
        } catch (error) {
            console.error('Error saving user:', error);
            setError('Failed to save user');
        }
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'admin': return 'error';
            case 'user': return 'primary';
            default: return 'default';
        }
    };

    if (currentUser?.role !== 'admin') {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">
                    Access denied. Admin privileges required.
                </Alert>
            </Box>
        );
    }

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3, mt: '60px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" fontWeight={600}>
                    Admin Panel
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<PersonAdd />}
                    onClick={handleCreateUser}
                >
                    Create User
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {/* Statistics Cards */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={12} sm={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="text.secondary">
                                Total Users
                            </Typography>
                            <Typography variant="h4" fontWeight={600}>
                                {users.length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={12} sm={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="text.secondary">
                                Admins
                            </Typography>
                            <Typography variant="h4" fontWeight={600}>
                                {users.filter(u => u.role === 'admin').length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={12} sm={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="text.secondary">
                                Regular Users
                            </Typography>
                            <Typography variant="h4" fontWeight={600}>
                                {users.filter(u => u.role === 'user').length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Users Table */}
            <Card>
                <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        All Users
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Username</TableCell>
                                    <TableCell>Role</TableCell>
                                    <TableCell>Created</TableCell>
                                    <TableCell>Last Login</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user._id}>
                                        <TableCell>{user.firstName} {user.lastName}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.username}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={user.role}
                                                color={getRoleColor(user.role)}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                                        </TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => handleViewUser(user)}>
                                                <Visibility />
                                            </IconButton>
                                            <IconButton onClick={() => handleEditUser(user)}>
                                                <Edit />
                                            </IconButton>
                                            {user._id !== currentUser?._id && (
                                                <IconButton
                                                    onClick={() => handleDeleteUser(user._id)}
                                                    color="error"
                                                >
                                                    <Delete />
                                                </IconButton>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>

            {/* User Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    {dialogMode === 'create' ? 'Create User' :
                        dialogMode === 'edit' ? 'Edit User' : 'User Details'}
                </DialogTitle>
                <DialogContent>
                    {selectedUser && (
                        <Box sx={{ pt: 2 }}>
                            <Grid container spacing={2}>
                                <Grid size={6}>
                                    <TextField
                                        fullWidth
                                        label="First Name"
                                        value={selectedUser.firstName}
                                        onChange={(e) => setSelectedUser({ ...selectedUser, firstName: e.target.value })}
                                        disabled={dialogMode === 'view'}
                                    />
                                </Grid>
                                <Grid size={6}>
                                    <TextField
                                        fullWidth
                                        label="Last Name"
                                        value={selectedUser.lastName}
                                        onChange={(e) => setSelectedUser({ ...selectedUser, lastName: e.target.value })}
                                        disabled={dialogMode === 'view'}
                                    />
                                </Grid>
                                <Grid size={6}>
                                    <TextField
                                        fullWidth
                                        label="Username"
                                        value={selectedUser.username}
                                        onChange={(e) => setSelectedUser({ ...selectedUser, username: e.target.value })}
                                        disabled={dialogMode === 'view'}
                                    />
                                </Grid>
                                <Grid size={6}>
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        value={selectedUser.email}
                                        onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                                        disabled={dialogMode === 'view'}
                                    />
                                </Grid>
                                {dialogMode === 'create' && (
                                    <Grid size={6}>
                                        <TextField
                                            fullWidth
                                            label="Password"
                                            type="password"
                                            value={selectedUser.password || ''}
                                            onChange={(e) => setSelectedUser({ ...selectedUser, password: e.target.value })}
                                            required
                                            helperText="Password is required for new users"
                                        />
                                    </Grid>
                                )}
                                <Grid size={12}>
                                    <FormControl fullWidth>
                                        <InputLabel>Role</InputLabel>
                                        <Select
                                            value={selectedUser.role}
                                            onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                                            disabled={dialogMode === 'view'}
                                        >
                                            <MenuItem value="user">User</MenuItem>
                                            <MenuItem value="admin">Admin</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>
                        {dialogMode === 'view' ? 'Close' : 'Cancel'}
                    </Button>
                    {dialogMode !== 'view' && (
                        <Button onClick={handleSaveUser} variant="contained">
                            {dialogMode === 'create' ? 'Create' : 'Save'}
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Box>
    );
}
