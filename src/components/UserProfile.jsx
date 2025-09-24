import { Box, Avatar, Typography, CircularProgress } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

export default function UserProfile() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <CircularProgress size={20} />
      </Box>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Avatar
          sx={{
            width: 40,
            height: 40,
            bgcolor: 'grey.300'
          }}
        >
          ?
        </Avatar>
        <Box>
          <Typography variant="subtitle2" fontWeight={600}>
            Not logged in
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Please login
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Avatar
        src={user.profilePicture}
        alt={user.firstName}
        sx={{
          width: 40,
          height: 40,
          bgcolor: 'primary.main'
        }}
      >
        {user.firstName?.[0]?.toUpperCase()}
      </Avatar>
      <Box>
        <Typography variant="subtitle2" fontWeight={600}>
          {user.firstName} {user.lastName}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {user.email}
        </Typography>
      </Box>
    </Box>
  );
}