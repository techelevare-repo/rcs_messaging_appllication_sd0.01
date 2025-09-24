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
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

export default function AdminDashboard() {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [dialogMode, setDialogMode] = useState('view'); // 'view', 'edit', 'create'

    useEffect(() => {
        if (user?.role === 'admin') {
            fetchAllUsers();
        }
    }, [user]);

    const fetchAllUsers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/auth/admin/users', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setUsers(response.data.users);
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
            role: 'patient',
            hospitalInfo: {},
            doctorInfo: {},
            patientInfo: {}
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

    const handleUnassignPatient = async (patientId) => {
        if (window.confirm('Are you sure you want to unassign this patient?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.post('http://localhost:5000/api/auth/unassign-patient', {
                    patientId
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                fetchAllUsers();
            } catch (error) {
                console.error('Error unassigning patient:', error);
                setError('Failed to unassign patient');
            }
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            return;
        }
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/auth/admin/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchAllUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            setError('Failed to delete user');
        }
    };

    const handleSaveUser = async () => {
        try {
            const token = localStorage.getItem('token');

            if (dialogMode === 'create') {
                await axios.post('http://localhost:5000/api/auth/admin/users', selectedUser, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else if (dialogMode === 'edit') {
                await axios.put(`http://localhost:5000/api/auth/admin/users/${selectedUser._id}`, selectedUser, {
                    headers: { Authorization: `Bearer ${token}` }
                });
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
            case 'doctor': return 'primary';
            case 'patient': return 'success';
            default: return 'default';
        }
    };

    if (user?.role !== 'admin') {
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
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" fontWeight={600}>
                    Admin Dashboard
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
                                Doctors
                            </Typography>
                            <Typography variant="h4" fontWeight={600}>
                                {users.filter(u => u.role === 'doctor').length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={12} sm={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="text.secondary">
                                Patients
                            </Typography>
                            <Typography variant="h4" fontWeight={600}>
                                {users.filter(u => u.role === 'patient').length}
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
                                    <TableCell>Role</TableCell>
                                    <TableCell>Hospital</TableCell>
                                    <TableCell>Assigned Doctor</TableCell>
                                    <TableCell>Created</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user._id}>
                                        <TableCell>{user.firstName} {user.lastName}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={user.role}
                                                color={getRoleColor(user.role)}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {user.hospitalInfo?.hospitalName || 'N/A'}
                                        </TableCell>
                                        <TableCell>
                                            {user.assignedDoctor ?
                                                `Dr. ${user.assignedDoctor.firstName || ''} ${user.assignedDoctor.lastName || ''}` :
                                                'Unassigned'
                                            }
                                        </TableCell>
                                        <TableCell>
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => handleViewUser(user)}>
                                                <Visibility />
                                            </IconButton>
                                            <IconButton onClick={() => handleEditUser(user)}>
                                                <Edit />
                                            </IconButton>
                                            {user.role === 'patient' && user.assignedDoctor && (
                                                <IconButton
                                                    onClick={() => handleUnassignPatient(user._id)}
                                                    color="warning"
                                                    title="Unassign Patient"
                                                >
                                                    <PersonRemove />
                                                </IconButton>
                                            )}
                                            <IconButton
                                                onClick={() => handleDeleteUser(user._id)}
                                                color="error"
                                            >
                                                <Delete />
                                            </IconButton>
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
                                            <MenuItem value="patient">Patient</MenuItem>
                                            <MenuItem value="doctor">Doctor</MenuItem>
                                            <MenuItem value="admin">Admin</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                {selectedUser.role === 'doctor' && (
                                    <>
                                        <Grid size={6}>
                                            <TextField
                                                fullWidth
                                                label="Specialization"
                                                value={selectedUser.doctorInfo?.specialization || ''}
                                                onChange={(e) => setSelectedUser({
                                                    ...selectedUser,
                                                    doctorInfo: { ...selectedUser.doctorInfo, specialization: e.target.value }
                                                })}
                                                disabled={dialogMode === 'view'}
                                            />
                                        </Grid>
                                        <Grid size={6}>
                                            <TextField
                                                fullWidth
                                                label="Registration Number"
                                                value={selectedUser.doctorInfo?.registrationNumber || ''}
                                                onChange={(e) => setSelectedUser({
                                                    ...selectedUser,
                                                    doctorInfo: { ...selectedUser.doctorInfo, registrationNumber: e.target.value }
                                                })}
                                                disabled={dialogMode === 'view'}
                                            />
                                        </Grid>
                                    </>
                                )}

                                <Grid size={12}>
                                    <TextField
                                        fullWidth
                                        label="Hospital Name"
                                        value={selectedUser.hospitalInfo?.hospitalName || ''}
                                        onChange={(e) => setSelectedUser({
                                            ...selectedUser,
                                            hospitalInfo: { ...selectedUser.hospitalInfo, hospitalName: e.target.value }
                                        })}
                                        disabled={dialogMode === 'view'}
                                    />
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
