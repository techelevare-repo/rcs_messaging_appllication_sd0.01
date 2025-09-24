import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar
} from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

export default function Profile() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography>Loading profile...</Typography>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardContent>
          <Typography>Please login to view your profile</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ width: 56, height: 56, mr: 2, bgcolor: 'primary.main' }}>
            <PersonIcon fontSize="large" />
          </Avatar>
          <Box>
            <Typography variant="h5" gutterBottom sx={{ mb: 0 }}>
              {user.firstName} {user.lastName}
            </Typography>
            <Typography color="text.secondary" sx={{ textTransform: 'capitalize' }}>
              {user.role}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography sx={{ mb: 1 }}>
            <strong>Email:</strong> {user.email}
          </Typography>
          <Typography>
            <strong>Member since:</strong> {new Date(user.createdAt).toLocaleDateString()}
          </Typography>
          {user.role === 'doctor' && user.doctorInfo?.specialization && (
            <Typography sx={{ mt: 1 }}>
              <strong>Specialization:</strong> {user.doctorInfo.specialization}
            </Typography>
          )}
          {user.hospitalInfo?.hospitalName && (
            <Typography sx={{ mt: 1 }}>
              <strong>Hospital:</strong> {user.hospitalInfo.hospitalName}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}