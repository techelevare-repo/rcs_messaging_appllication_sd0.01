import { useState, useEffect } from 'react';
import { Box, Grid, Card, CardContent, Typography, Button, List, ListItem, ListItemText, Chip, CircularProgress, Alert } from '@mui/material';
import { CloudUpload, History, Assessment, TrendingUp, CheckCircle, Warning, Analytics } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState({ totalScans: 0, normalCases: 0, abnormalCases: 0, accuracyRate: 0 });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to view dashboard');
        setLoading(false);
        return;
      }

      const response = await axios.get('http://localhost:5000/api/predict/dashboard/stats', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data && response.data.success) {
        setStats(response.data.stats);
        setRecentActivity(response.data.recentActivity);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mb: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={fetchDashboardData}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Welcome Section */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h2" sx={{ color: 'text.primary', fontWeight: 600, mb: 1 }}>
          Welcome back, {user?.firstName || 'User'}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {user?.role === 'doctor'
            ? 'Monitor your patients\' chest X-ray analysis results'
            : 'Advanced AI-powered cancer detection for chest X-rays'
          }
        </Typography>
        {user?.role === 'doctor' && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Role: Doctor | Specialization: {user?.doctorInfo?.specialization || 'Not specified'}
          </Typography>
        )}
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={12} sm={6} lg={3}>
          <Card sx={{
            height: '100%',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-2px)' },
            borderRadius: 2
          }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Box sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <TrendingUp sx={{ color: 'white', fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight={600}>{stats.totalScans}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>Total Scans</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={12} sm={6} lg={3}>
          <Card sx={{
            height: '100%',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-2px)' },
            borderRadius: 2
          }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Box sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  bgcolor: 'success.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <CheckCircle sx={{ color: 'white', fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight={600}>{stats.normalCases}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>Normal Cases</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={12} sm={6} lg={3}>
          <Card sx={{
            height: '100%',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-2px)' },
            borderRadius: 2
          }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Box sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  bgcolor: 'warning.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Warning sx={{ color: 'white', fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight={600}>{stats.abnormalCases}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>Abnormal Cases</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={12} sm={6} lg={3}>
          <Card sx={{
            height: '100%',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-2px)' },
            borderRadius: 2
          }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Box sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  bgcolor: 'secondary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Analytics sx={{ color: 'white', fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight={600}>
                    {user?.role === 'doctor' ? stats.totalPatients || 0 : stats.accuracyRate}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {user?.role === 'doctor' ? 'Total Patients' : 'Accuracy Rate'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activity and Quick Actions */}
      <Grid container spacing={2}>
        <Grid size={12} md={8}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Recent Activity
              </Typography>
              <List sx={{ '& .MuiListItem-root': { px: 0 } }}>
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity) => (
                    <ListItem
                      key={activity.id}
                      divider
                      sx={{
                        py: 1.5,
                        '&:last-child': {
                          borderBottom: 'none'
                        }
                      }}
                    >
                      <ListItemText
                        primary={`Scan completed for ${activity.patientName || activity.patientId}`}
                        secondary={`${activity.time} - Confidence: ${activity.confidence}%`}
                        primaryTypographyProps={{
                          variant: 'body1',
                          fontWeight: 500,
                          sx: { mb: 0.5 }
                        }}
                        secondaryTypographyProps={{
                          variant: 'body2',
                          color: 'text.secondary'
                        }}
                      />
                      <Chip
                        label={activity.result}
                        color={activity.result === 'Normal' ? 'primary' : 'error'}
                        size="small"
                        sx={{
                          borderRadius: 1,
                          fontSize: '0.75rem',
                          fontWeight: 500
                        }}
                      />
                    </ListItem>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText
                      primary="No recent activity"
                      secondary="Upload your first X-ray to get started"
                      primaryTypographyProps={{
                        variant: 'body1',
                        color: 'text.secondary'
                      }}
                      secondaryTypographyProps={{
                        variant: 'body2',
                        color: 'text.secondary'
                      }}
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid size={12} md={4}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Button
                  variant="contained"
                  startIcon={<CloudUpload />}
                  fullWidth
                  onClick={() => navigate('/upload')}
                  sx={{
                    py: 1,
                    borderRadius: 1.5,
                    textTransform: 'none',
                    fontWeight: 500
                  }}
                >
                  Upload X-ray
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<History />}
                  fullWidth
                  onClick={() => navigate('/history')}
                  sx={{
                    py: 1,
                    borderRadius: 1.5,
                    textTransform: 'none',
                    fontWeight: 500
                  }}
                >
                  View History
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
