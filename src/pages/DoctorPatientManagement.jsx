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
    Avatar,
    IconButton,
    Alert,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import {
    PersonAdd,
    Visibility,
    Assignment,
    People,
    MedicalServices,
    PersonRemove
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

export default function DoctorPatientManagement() {
    const { user, getPatients } = useAuth();
    const [patients, setPatients] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [dialogMode, setDialogMode] = useState('view'); // 'view', 'assign'

    useEffect(() => {
        if (user?.role === 'doctor') {
            fetchPatients();
            fetchAllUsers();
        }
    }, [user]);

    const fetchPatients = async () => {
        try {
            setLoading(true);
            const result = await getPatients();
            if (result.success) {
                setPatients(result.patients);
            } else {
                setError(result.message);
            }
        } catch (error) {
            console.error('Error fetching patients:', error);
            setError('Failed to fetch patients');
        } finally {
            setLoading(false);
        }
    };

    const fetchAllUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/auth/users', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                // Filter to only show patients who are not already assigned
                const unassignedPatients = response.data.users.filter(
                    u => u.role === 'patient' && !u.assignedDoctor
                );
                setAllUsers(unassignedPatients);
                console.log('Available patients:', unassignedPatients.length);
            }
        } catch (error) {
            console.error('Error fetching all users:', error);
            // If the route doesn't exist, show a helpful message
            setError('Patient assignment feature is not available. Please contact admin to assign patients.');
        }
    };

    const handleAssignPatient = async (patientId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/auth/assign-patient', {
                patientId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Refresh data and close dialog
            await fetchPatients();
            await fetchAllUsers();
            setOpenDialog(false);
        } catch (error) {
            console.error('Error assigning patient:', error);
            setError('Failed to assign patient');
        }
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

                fetchPatients();
                fetchAllUsers();
            } catch (error) {
                console.error('Error unassigning patient:', error);
                setError('Failed to unassign patient');
            }
        }
    };

    const handleViewPatient = (patient) => {
        setSelectedPatient(patient);
        setDialogMode('view');
        setOpenDialog(true);
    };

    const handleAssignDialog = () => {
        setSelectedPatient(null);
        setDialogMode('assign');
        setOpenDialog(true);
    };

    if (user?.role !== 'doctor') {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">
                    Access denied. Doctor privileges required.
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
                    Patient Management
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<PersonAdd />}
                    onClick={handleAssignDialog}
                >
                    Assign Patient
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
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar sx={{ bgcolor: 'primary.main' }}>
                                    <People />
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" color="text.secondary">
                                        Total Patients
                                    </Typography>
                                    <Typography variant="h4" fontWeight={600}>
                                        {patients.length}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={12} sm={4}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar sx={{ bgcolor: 'success.main' }}>
                                    <MedicalServices />
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" color="text.secondary">
                                        Available Patients
                                    </Typography>
                                    <Typography variant="h4" fontWeight={600}>
                                        {allUsers.length}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={12} sm={4}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar sx={{ bgcolor: 'info.main' }}>
                                    <Assignment />
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" color="text.secondary">
                                        Recent Assignments
                                    </Typography>
                                    <Typography variant="h4" fontWeight={600}>
                                        {patients.filter(p => new Date(p.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Patients Table */}
            <Card>
                <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        My Patients
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Patient</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Contact</TableCell>
                                    <TableCell>Medical History</TableCell>
                                    <TableCell>Assigned Date</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {patients.map((patient) => (
                                    <TableRow key={patient._id}>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Avatar sx={{ bgcolor: 'primary.main' }}>
                                                    {patient.firstName?.[0]}{patient.lastName?.[0]}
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="subtitle1" fontWeight={600}>
                                                        {patient.firstName} {patient.lastName}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        ID: {patient._id.slice(-6).toUpperCase()}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>{patient.email}</TableCell>
                                        <TableCell>
                                            {patient.patientInfo?.emergencyContact || 'Not provided'}
                                        </TableCell>
                                        <TableCell>
                                            {patient.patientInfo?.medicalHistory ?
                                                patient.patientInfo.medicalHistory.substring(0, 50) + '...' :
                                                'No history'
                                            }
                                        </TableCell>
                                        <TableCell>
                                            {new Date(patient.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <IconButton
                                                onClick={() => handleViewPatient(patient)}
                                                color="primary"
                                            >
                                                <Visibility />
                                            </IconButton>
                                            <IconButton
                                                onClick={() => handleUnassignPatient(patient._id)}
                                                color="error"
                                                title="Unassign Patient"
                                            >
                                                <PersonRemove />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>

            {/* Patient Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    {dialogMode === 'view' ? 'Patient Details' : 'Assign New Patient'}
                </DialogTitle>
                <DialogContent>
                    {dialogMode === 'view' && selectedPatient ? (
                        <Box sx={{ pt: 2 }}>
                            <Grid container spacing={2}>
                                <Grid size={6}>
                                    <TextField
                                        fullWidth
                                        label="First Name"
                                        value={selectedPatient.firstName}
                                        disabled
                                    />
                                </Grid>
                                <Grid size={6}>
                                    <TextField
                                        fullWidth
                                        label="Last Name"
                                        value={selectedPatient.lastName}
                                        disabled
                                    />
                                </Grid>
                                <Grid size={12}>
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        value={selectedPatient.email}
                                        disabled
                                    />
                                </Grid>
                                <Grid size={6}>
                                    <TextField
                                        fullWidth
                                        label="Emergency Contact"
                                        value={selectedPatient.patientInfo?.emergencyContact || ''}
                                        disabled
                                    />
                                </Grid>
                                <Grid size={6}>
                                    <TextField
                                        fullWidth
                                        label="Blood Type"
                                        value={selectedPatient.patientInfo?.bloodType || ''}
                                        disabled
                                    />
                                </Grid>
                                <Grid size={12}>
                                    <TextField
                                        fullWidth
                                        label="Medical History"
                                        value={selectedPatient.patientInfo?.medicalHistory || ''}
                                        multiline
                                        rows={3}
                                        disabled
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    ) : dialogMode === 'assign' ? (
                        <Box sx={{ pt: 2 }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Available Patients to Assign
                            </Typography>
                            {allUsers.length === 0 ? (
                                <Alert severity="info">
                                    No unassigned patients available.
                                    <br />
                                    <strong>To assign patients:</strong>
                                    <br />
                                    1. Contact an admin to create new patients
                                    <br />
                                    2. Or ask admin to unassign existing patients
                                    <br />
                                    3. Patients must be created first before they can be assigned
                                </Alert>
                            ) : (
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Name</TableCell>
                                                <TableCell>Email</TableCell>
                                                <TableCell>Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {allUsers.map((user) => (
                                                <TableRow key={user._id}>
                                                    <TableCell>{user.firstName} {user.lastName}</TableCell>
                                                    <TableCell>{user.email}</TableCell>
                                                    <TableCell>
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            onClick={() => handleAssignPatient(user._id)}
                                                        >
                                                            Assign
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </Box>
                    ) : null}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>
                        {dialogMode === 'view' ? 'Close' : 'Cancel'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
