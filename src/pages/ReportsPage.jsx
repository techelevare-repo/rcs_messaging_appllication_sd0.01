import { 
  Box, Typography, Grid, Card, CardContent, Button, 
  LinearProgress, List, ListItem, ListItemText, Chip
} from '@mui/material';
import { FileDownload, Assessment, TrendingUp, Print } from '@mui/icons-material';

export default function ReportsPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h2" gutterBottom fontWeight={600} sx={{ mb: 4 }}>
        Reports & Analytics
      </Typography>

      <Grid container spacing={3}>
        {/* Generate Report Section */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ height: 'fit-content' }}>
            <CardContent>
              <Typography variant="h3" gutterBottom fontWeight={600}>
                Generate Report
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Export detailed analysis reports
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<FileDownload />}
                  fullWidth
                  sx={{ py: 1.5, textTransform: 'none', fontWeight: 500 }}
                >
                  Download Weekly Report
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<FileDownload />}
                  fullWidth
                  sx={{ py: 1.5, textTransform: 'none', fontWeight: 500 }}
                >
                  Download Monthly Report
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Print />}
                  fullWidth
                  sx={{ py: 1.5, textTransform: 'none', fontWeight: 500 }}
                >
                  Print Current Report
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Statistics Overview */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ height: 'fit-content' }}>
            <CardContent>
              <Typography variant="h3" gutterBottom fontWeight={600}>
                Statistics Overview
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                View comprehensive analytics
              </Typography>

              <List sx={{ p: 0 }}>
                <ListItem sx={{ px: 0, py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <ListItemText 
                    primary="Model Accuracy" 
                    secondary="Current performance metrics"
                  />
                  <Chip label="94.2%" color="success" />
                </ListItem>
                <ListItem sx={{ px: 0, py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <ListItemText 
                    primary="Processing Speed" 
                    secondary="Average analysis time"
                  />
                  <Chip label="2.4s" color="primary" />
                </ListItem>
                <ListItem sx={{ px: 0, py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <ListItemText 
                    primary="Daily Scans" 
                    secondary="Today's completed scans"
                  />
                  <Chip label="47" color="info" />
                </ListItem>
                <ListItem sx={{ px: 0, py: 1 }}>
                  <ListItemText 
                    primary="System Uptime" 
                    secondary="Current operational status"
                  />
                  <Chip label="99.8%" color="success" />
                </ListItem>
              </List>

              <Button
                variant="contained"
                startIcon={<Assessment />}
                fullWidth
                sx={{ mt: 3, py: 1.5, textTransform: 'none', fontWeight: 500 }}
              >
                View Detailed Analytics
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
