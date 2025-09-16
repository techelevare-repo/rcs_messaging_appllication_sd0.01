import { Box, Grid, Card, CardContent, Typography, Button, List, ListItem, ListItemText, Chip } from '@mui/material';
import { CloudUpload, History, Assessment, TrendingUp, CheckCircle, Warning, Analytics } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const mockStats = { totalScans: 1247, normalCases: 1089, abnormalCases: 158, accuracyRate: 94.2 };
const mockActivity = [
  { id: 1, patientId: 'PAT-2025-001', time: '08:30', result: 'Normal', confidence: 92.3 },
  { id: 2, patientId: 'PAT-2025-002', time: '07:45', result: 'Abnormal', confidence: 87.1 },
  { id: 3, patientId: 'PAT-2025-003', time: '07:15', result: 'Normal', confidence: 95.7 }
];

export default function DashboardPage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 3 }}>
      {/* Welcome Section */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h1" sx={{ mb: 1, fontWeight: 700 }}>
          Welcome to RadiologyAI
        </Typography>
        <Typography variant="h5" color="text.secondary">
          Advanced AI-powered cancer detection for chest X-rays
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' } }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ 
                width: 56, height: 56, borderRadius: '50%', 
                bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <TrendingUp sx={{ color: 'white', fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="h2" fontWeight={700}>1,247</Typography>
                <Typography variant="body2" color="text.secondary">Total Scans</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} lg={3}>
          <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' } }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ 
                width: 56, height: 56, borderRadius: '50%', 
                bgcolor: 'success.main', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <CheckCircle sx={{ color: 'white', fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="h2" fontWeight={700}>1,089</Typography>
                <Typography variant="body2" color="text.secondary">Normal Cases</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' } }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ 
                width: 56, height: 56, borderRadius: '50%', 
                bgcolor: 'warning.main', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Warning sx={{ color: 'white', fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="h2" fontWeight={700}>158</Typography>
                <Typography variant="body2" color="text.secondary">Abnormal Cases</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' } }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ 
                width: 56, height: 56, borderRadius: '50%', 
                bgcolor: 'secondary.main', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Analytics sx={{ color: 'white', fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="h2" fontWeight={700}>94.2%</Typography>
                <Typography variant="body2" color="text.secondary">Accuracy Rate</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dashboard Grid */}
      <Grid container spacing={3}>
        {/* Recent Activity */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h3" gutterBottom fontWeight={600}>
                Recent Activity
              </Typography>
              <List>
                {mockActivity.map((activity) => (
                  <ListItem key={activity.id} sx={{ px: 0, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <ListItemText
                      primary={`Scan completed for ${activity.patientId}`}
                      secondary={`${activity.time} - Confidence: ${activity.confidence}%`}
                    />
                    <Chip 
                      label={activity.result}
                      color={activity.result === 'Normal' ? 'success' : 'error'}
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h3" gutterBottom fontWeight={600}>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<CloudUpload />}
                  fullWidth
                  onClick={() => navigate('/upload')}
                  sx={{ py: 1.5, textTransform: 'none', fontWeight: 500 }}
                >
                  Upload X-ray
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<History />}
                  fullWidth
                  onClick={() => navigate('/history')}
                  sx={{ py: 1.5, textTransform: 'none', fontWeight: 500 }}
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
