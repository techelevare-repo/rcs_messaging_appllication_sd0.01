import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Grid,
    TextField,
    Button,
    Avatar,
    IconButton,
    Card,
    CardContent,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Menu,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    CircularProgress,
    Autocomplete,
    Alert,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Save } from "@mui/icons-material";
import { Close } from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";

export default function ProfilePage() {
    const { user, updateProfile } = useAuth();
    const [profile, setProfile] = useState({
        firstName: "",
        lastName: "",
        email: "",
        role: "patient",
        hospitalInfo: {
            hospitalName: "",
            hospitalAddress: "",
        },
        doctorInfo: {
            specialization: "",
            registrationNumber: "",
            licenseExpiry: "",
            department: "",
            shift: "",
            certifications: "",
        },
        patientInfo: {
            dateOfBirth: "",
            medicalHistory: "",
            emergencyContact: "",
            bloodType: "",
        },
    });
    const [preview, setPreview] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [isSaved, setIsSaved] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // Initialize profile with user data
    useEffect(() => {
        if (user) {
            setProfile({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email || "",
                role: user.role || "patient",
                hospitalInfo: user.hospitalInfo || {
                    hospitalName: "",
                    hospitalAddress: "",
                },
                doctorInfo: user.doctorInfo || {
                    specialization: "",
                    registrationNumber: "",
                    licenseExpiry: "",
                    department: "",
                    shift: "",
                    certifications: "",
                },
                patientInfo: user.patientInfo || {
                    dateOfBirth: "",
                    medicalHistory: "",
                    emergencyContact: "",
                    bloodType: "",
                },
            });
            setPreview(user.profilePicture);
        }
    }, [user]);

    const countries = [
        { code: "IN", label: "India", phone: "91", maxLength: 10, flag: "🇮🇳" },
        { code: "US", label: "United States", phone: "1", maxLength: 10, flag: "🇺🇸" },
        { code: "GB", label: "United Kingdom", phone: "44", maxLength: 10, flag: "🇬🇧" },
        { code: "CA", label: "Canada", phone: "1", maxLength: 10, flag: "🇨🇦" },
        { code: "AU", label: "Australia", phone: "61", maxLength: 9, flag: "🇦🇺" },
    ];

    const [selectedCountry, setSelectedCountry] = useState(countries[0]);

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile({ ...profile, [name]: value });
        setIsSaved(false);
    };

    const handleNestedChange = (section, field, value) => {
        setProfile({
            ...profile,
            [section]: {
                ...profile[section],
                [field]: value,
            },
        });
        setIsSaved(false);
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
                setProfile({ ...profile, profilePicture: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDeletePhoto = () => {
        setPreview(null);
        setProfile({ ...profile, profilePicture: null });
        handleMenuClose();
    };

    const handleSave = async () => {
        setLoading(true);
        setMessage("");

        let newErrors = {};
        if (!validateEmail(profile.email || "")) {
            newErrors.email = "Enter a valid email address";
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            try {
                const result = await updateProfile(profile);
                if (result.success) {
                    setIsSaved(true);
                    setMessage("Profile saved successfully!");
                } else {
                    setMessage(`Error: ${result.message}`);
                }
            } catch (error) {
                setMessage(`Error: ${error.message}`);
            }
        }
        setLoading(false);
    };

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    if (!user) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 2, display: "flex", justifyContent: "center", minHeight: "100vh", alignItems: "center" }}>
            <Card sx={{ width: "100%", maxWidth: 800, borderRadius: 3, boxShadow: 6 }}>
                <CardContent>
                    {/* Header */}
                    <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                        <Typography variant="h4" fontWeight={600}>
                            Profile Details
                        </Typography>
                        <IconButton onClick={handleMenuOpen}>
                            <MoreVertIcon />
                        </IconButton>
                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                            <MenuItem component="label" htmlFor="upload-avatar">
                                Change Photo
                            </MenuItem>
                            <MenuItem onClick={handleDeletePhoto}>Delete Photo</MenuItem>
                        </Menu>
                    </Box>

                    {message && (
                        <Alert severity={message.includes("Error") ? "error" : "success"} sx={{ mb: 2 }}>
                            {message}
                        </Alert>
                    )}

                    {/* Avatar */}
                    <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                        <Box position="relative" display="inline-block">
                            <Avatar
                                src={preview || user.profilePicture || undefined}
                                sx={{ width: 90, height: 90 }}
                            />
                        </Box>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
                        <input
                            accept="image/*"
                            style={{ display: "none" }}
                            id="upload-avatar"
                            type="file"
                            onChange={handleAvatarChange}
                        />
                        <label htmlFor="upload-avatar">
                            <Button variant="contained" component="span">
                                Upload Photo
                            </Button>
                        </label>
                    </Box>

                    {/* Personal Info */}
                    <Accordion defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="h5" fontWeight={600}>
                                Personal Information
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container spacing={2}>
                                <Grid size={12}>
                                    <TextField
                                        fullWidth
                                        label="First Name"
                                        name="firstName"
                                        value={profile.firstName || ""}
                                        onChange={handleChange}
                                        required
                                    />
                                </Grid>
                                <Grid size={6}>
                                    <TextField
                                        fullWidth
                                        label="Last Name"
                                        name="lastName"
                                        value={profile.lastName || ""}
                                        onChange={handleChange}
                                        required
                                    />
                                </Grid>
                                <Grid size={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        type="date"
                                        label="Date of Birth"
                                        name="dateOfBirth"
                                        value={profile.patientInfo?.dateOfBirth || ""}
                                        onChange={(e) => handleNestedChange("patientInfo", "dateOfBirth", e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                <Grid size={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        type="email"
                                        label="Email"
                                        name="email"
                                        value={profile.email || ""}
                                        onChange={handleChange}
                                        error={!!errors.email}
                                        helperText={errors.email}
                                        required
                                    />
                                </Grid>
                                <Grid size={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Emergency Contact"
                                        name="emergencyContact"
                                        value={profile.patientInfo?.emergencyContact || ""}
                                        onChange={(e) => handleNestedChange("patientInfo", "emergencyContact", e.target.value)}
                                    />
                                </Grid>
                                <Grid size={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Blood Type"
                                        name="bloodType"
                                        value={profile.patientInfo?.bloodType || ""}
                                        onChange={(e) => handleNestedChange("patientInfo", "bloodType", e.target.value)}
                                    />
                                </Grid>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>

                    {/* Hospital Info */}
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="h5" fontWeight={600}>
                                Hospital Information
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container spacing={2}>
                                <Grid size={12}>
                                    <TextField
                                        fullWidth
                                        label="Hospital Name"
                                        name="hospitalName"
                                        value={profile.hospitalInfo?.hospitalName || ""}
                                        onChange={(e) => handleNestedChange("hospitalInfo", "hospitalName", e.target.value)}
                                    />
                                </Grid>
                                <Grid size={12}>
                                    <TextField
                                        fullWidth
                                        label="Hospital Address"
                                        name="hospitalAddress"
                                        value={profile.hospitalInfo?.hospitalAddress || ""}
                                        onChange={(e) => handleNestedChange("hospitalInfo", "hospitalAddress", e.target.value)}
                                    />
                                </Grid>
                                <Grid size={12}>
                                    <FormControl fullWidth>
                                        <InputLabel id="role-label">Role</InputLabel>
                                        <Select
                                            labelId="role-label"
                                            name="role"
                                            value={profile.role || ""}
                                            onChange={handleChange}
                                        >
                                            <MenuItem value="patient">Patient</MenuItem>
                                            <MenuItem value="doctor">Doctor</MenuItem>
                                            <MenuItem value="admin">Admin</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>

                    {/* Medical Info (role-based) */}
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="h5" fontWeight={600}>
                                Medical Information
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container spacing={2}>
                                {/* Doctor fields */}
                                {profile.role === "doctor" && (
                                    <>
                                        <Grid size={6}>
                                            <TextField
                                                fullWidth
                                                label="Specialization"
                                                name="specialization"
                                                value={profile.doctorInfo?.specialization || ""}
                                                onChange={(e) => handleNestedChange("doctorInfo", "specialization", e.target.value)}
                                            />
                                        </Grid>
                                        <Grid size={6}>
                                            <TextField
                                                fullWidth
                                                label="Medical Registration Number"
                                                name="registrationNumber"
                                                value={profile.doctorInfo?.registrationNumber || ""}
                                                onChange={(e) => handleNestedChange("doctorInfo", "registrationNumber", e.target.value)}
                                            />
                                        </Grid>
                                        <Grid size={6}>
                                            <TextField
                                                fullWidth
                                                label="Department"
                                                name="department"
                                                value={profile.doctorInfo?.department || ""}
                                                onChange={(e) => handleNestedChange("doctorInfo", "department", e.target.value)}
                                            />
                                        </Grid>
                                        <Grid size={6}>
                                            <TextField
                                                fullWidth
                                                label="Shift Availability"
                                                name="shift"
                                                value={profile.doctorInfo?.shift || ""}
                                                onChange={(e) => handleNestedChange("doctorInfo", "shift", e.target.value)}
                                            />
                                        </Grid>
                                        <Grid size={12}>
                                            <TextField
                                                fullWidth
                                                label="Certifications"
                                                name="certifications"
                                                value={profile.doctorInfo?.certifications || ""}
                                                onChange={(e) => handleNestedChange("doctorInfo", "certifications", e.target.value)}
                                                multiline
                                                rows={2}
                                            />
                                        </Grid>
                                        <Grid size={6}>
                                            <TextField
                                                fullWidth
                                                type="date"
                                                label="License Expiry Date"
                                                name="licenseExpiry"
                                                value={profile.doctorInfo?.licenseExpiry || ""}
                                                onChange={(e) => handleNestedChange("doctorInfo", "licenseExpiry", e.target.value)}
                                                InputLabelProps={{ shrink: true }}
                                            />
                                        </Grid>
                                    </>
                                )}

                                {/* Patient fields */}
                                {profile.role === "patient" && (
                                    <Grid size={12}>
                                        <TextField
                                            fullWidth
                                            label="Medical History"
                                            name="medicalHistory"
                                            value={profile.patientInfo?.medicalHistory || ""}
                                            onChange={(e) => handleNestedChange("patientInfo", "medicalHistory", e.target.value)}
                                            multiline
                                            rows={3}
                                        />
                                    </Grid>
                                )}
                            </Grid>
                        </AccordionDetails>
                    </Accordion>

                    {/* Save Button */}
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid size={12}>
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                onClick={handleSave}
                                startIcon={<Save />}
                                sx={{ py: 1.2, borderRadius: 2 }}
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={20} /> : "Save Profile"}
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
}
