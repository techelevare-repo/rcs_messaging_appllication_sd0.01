import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  CircularProgress,
  Popover,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import { Check as CheckIcon, Cancel as CancelIcon } from '@mui/icons-material';

// Memoized validation icon component to prevent unnecessary rerenders
const ValidationIcon = React.memo(({ isValid }) => (
  <ListItemIcon>
    {isValid ? (
      <CheckIcon color="success" />
    ) : (
      <CancelIcon color="error" />
    )}
  </ListItemIcon>
));

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'patient',
    hospitalInfo: {
      hospitalName: '',
      hospitalAddress: ''
    },
    doctorInfo: {
      specialization: '',
      registrationNumber: '',
      department: '',
      shift: '',
      certifications: ''
    },
    patientInfo: {
      dateOfBirth: '',
      medicalHistory: '',
      emergencyContact: '',
      bloodType: ''
    }
  });
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [passwordFocused, setPasswordFocused] = React.useState(false);
  const passwordFieldRef = React.useRef(null);

  const { firstName, lastName, username, email, password, confirmPassword } = formData;

  // Memoized password validation function
  const validatePassword = React.useCallback((pass) => ({
    hasCapital: /[A-Z]/.test(pass),
    hasSmall: /[a-z]/.test(pass),
    hasDigit: /\d/.test(pass),
    hasSpecial: /[!@#$%^&*]/.test(pass),
    hasLength: pass.length >= 8
  }), []);

  // Memoized password validation result
  const passwordValidation = React.useMemo(
    () => validatePassword(password || ''),
    [validatePassword, password]
  );

  // Memoized password validity check
  const isPasswordValid = React.useMemo(
    () => Object.values(passwordValidation).every(Boolean),
    [passwordValidation]
  );

  // Memoized form change handler
  const handleChange = React.useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  }, []);

  // Fixed password field handlers - removed immediate blur closing
  const handlePasswordFocus = React.useCallback(() => {
    setPasswordFocused(true);
  }, []);

  const handlePasswordBlur = React.useCallback((e) => {
    // Only close popover if not clicking on the popover itself
    const relatedTarget = e.relatedTarget;
    if (!relatedTarget || !e.currentTarget.contains(relatedTarget)) {
      // Use timeout to prevent immediate closing
      setTimeout(() => {
        setPasswordFocused(false);
      }, 150);
    }
  }, []);

  // Handle popover close
  const handlePopoverClose = React.useCallback(() => {
    setPasswordFocused(false);
  }, []);

  // Memoized submit handler
  const handleSubmit = React.useCallback(async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Check if all password requirements are met
    if (!isPasswordValid) {
      setError('Password does not meet all requirements');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Remove confirmPassword from the data sent to backend
      const { confirmPassword, ...registrationData } = formData;
      const result = await register(registrationData);

      if (result.success) {
        // Redirect to dashboard after successful registration
        navigate('/dashboard');
      } else {
        setError(result.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }, [formData, password, confirmPassword, isPasswordValid, navigate, register]);

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default'
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 400,
          width: '90%'
        }}
      >
        <Typography variant="h5" component="h1" gutterBottom>
          Register for RadiologyAI
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={6}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="First Name"
                name="firstName"
                value={firstName}
                onChange={handleChange}
                autoFocus
              />
            </Grid>
            <Grid size={6}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Last Name"
                name="lastName"
                value={lastName}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <TextField
            margin="normal"
            required
            fullWidth
            label="Username"
            name="username"
            value={username}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            name="email"
            type="email"
            value={email}
            onChange={handleChange}
          />

          <FormControl margin="normal" fullWidth required>
            <InputLabel>Role</InputLabel>
            <Select
              name="role"
              value={formData.role}
              onChange={handleChange}
              label="Role"
            >
              <MenuItem value="patient">Patient</MenuItem>
              <MenuItem value="doctor">Doctor</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
          <Box position="relative">
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={password}
              onChange={handleChange}
              onFocus={handlePasswordFocus}
              onBlur={handlePasswordBlur}
              error={password.length > 0 && !isPasswordValid}
              helperText={password.length > 0 && !isPasswordValid ? "Password doesn't meet requirements" : ""}
              ref={passwordFieldRef}
              inputProps={{
                'aria-label': 'Password',
                'aria-describedby': 'password-requirements',
                autoComplete: 'new-password'
              }}
              FormHelperTextProps={{
                sx: { mb: 1 }
              }}
            />
          </Box>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={handleChange}
            error={confirmPassword.length > 0 && password !== confirmPassword}
            helperText={
              confirmPassword.length > 0 && password !== confirmPassword
                ? "Passwords don't match"
                : ""
            }
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading || !isPasswordValid || password !== confirmPassword}
          >
            {loading ? <CircularProgress size={24} /> : 'Register'}
          </Button>
        </form>

        <Typography variant="body2" align="center">
          Already have an account?{' '}
          <Link
            component="button"
            variant="body2"
            onClick={() => navigate('/login')}
          >
            Sign in
          </Link>
        </Typography>

        <Popover
          id="password-requirements"
          open={passwordFocused && Boolean(passwordFieldRef.current)}
          anchorEl={passwordFieldRef.current}
          onClose={handlePopoverClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left'
          }}
          PaperProps={{
            sx: {
              mt: 1,
              pointerEvents: 'auto' // Allow interaction with popover
            }
          }}
          disableRestoreFocus
          disableAutoFocus
          disableEnforceFocus
          sx={{
            '& .MuiPopover-paper': {
              width: 'auto',
              maxWidth: '100%'
            }
          }}
        >
          <List sx={{ p: 1, width: 280 }} aria-label="Password requirements">
            <ListItem dense>
              <ValidationIcon isValid={passwordValidation.hasCapital} />
              <ListItemText
                primary="One uppercase letter (A-Z)"
                primaryTypographyProps={{ variant: 'body2' }}
                aria-live="polite"
              />
            </ListItem>
            <ListItem dense>
              <ValidationIcon isValid={passwordValidation.hasSmall} />
              <ListItemText
                primary="One lowercase letter (a-z)"
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
            <ListItem dense>
              <ValidationIcon isValid={passwordValidation.hasDigit} />
              <ListItemText
                primary="One number (0-9)"
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
            <ListItem dense>
              <ValidationIcon isValid={passwordValidation.hasSpecial} />
              <ListItemText
                primary="One special character (!@#$%^&*)"
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
            <ListItem dense>
              <ValidationIcon isValid={passwordValidation.hasLength} />
              <ListItemText
                primary="Minimum 8 characters"
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
          </List>
        </Popover>
      </Paper>
    </Box>
  );
};

export default Register;
