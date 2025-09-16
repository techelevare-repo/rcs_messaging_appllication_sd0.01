import { 
  Box, Typography, Grid, Card, CardContent, Slider, 
  FormControlLabel, Switch, Select, MenuItem, FormControl, 
  InputLabel, TextField, Button, Divider
} from '@mui/material';
import { Save, RestartAlt } from '@mui/icons-material';
import { useState } from 'react';

export default function SettingsPage() {
  const [modelConfidence, setModelConfidence] = useState(80);
  const [autoProcessing, setAutoProcessing] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [modelVersion, setModelVersion] = useState('v2.1.0');

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h2" gutterBottom fontWeight={600} sx={{ mb: 4 }}>
        Settings
      </Typography>

      <Grid container spacing={3}>
        {/* Model Configuration */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h3" gutterBottom fontWeight={600}>
                Model Configuration
              </Typography>

              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom>
                  Confidence Threshold: {modelConfidence}%
                </Typography>
                <Slider
                  value={modelConfidence}
                  onChange={(e, value) => setModelConfidence(value)}
                  min={50}
                  max={95}
                  step={5}
                  marks={[
                    { value: 50, label: '50%' },
                    { value: 70, label: '70%' },
                    { value: 90, label: '90%' }
                  ]}
                  sx={{ mt: 2 }}
                />
                <Typography variant="caption" color="text.secondary">
                  Minimum confidence level required for automatic classification
                </Typography>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ mb: 3 }}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Model Version</InputLabel>
                  <Select
                    value={modelVersion}
                    onChange={(e) => setModelVersion(e.target.value)}
                    label="Model Version"
                  >
                    <MenuItem value="v2.1.0">v2.1.0 (Current)</MenuItem>
                    <MenuItem value="v2.0.3">v2.0.3 (Previous)</MenuItem>
                    <MenuItem value="v1.9.2">v1.9.2 (Legacy)</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ mb: 3 }}>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={autoProcessing}
                      onChange={(e) => setAutoProcessing(e.target.checked)}
                    />
                  }
                  label="Enable Auto-Processing"
                />
                <Typography variant="caption" display="block" color="text.secondary">
                  Automatically process uploaded images without manual confirmation
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.checked)}
                    />
                  }
                  label="Email Notifications"
                />
                <Typography variant="caption" display="block" color="text.secondary">
                  Receive email alerts for abnormal scan results
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  sx={{ textTransform: 'none', fontWeight: 500 }}
                >
                  Save Changes
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<RestartAlt />}
                  sx={{ textTransform: 'none', fontWeight: 500 }}
                >
                  Reset to Default
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* System Information */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h3" gutterBottom fontWeight={600}>
                System Information
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Version</Typography>
                <Typography variant="body1" fontWeight={500}>RadiologyAI v3.2.1</Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Last Updated</Typography>
                <Typography variant="body1" fontWeight={500}>September 12, 2025</Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">GPU Status</Typography>
                <Typography variant="body1" fontWeight={500} color="success.main">Active</Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Storage Used</Typography>
                <Typography variant="body1" fontWeight={500}>2.4 GB / 10 GB</Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="API Endpoint"
                  value="https://api.radiologyai.com/v1"
                  size="small"
                  InputProps={{ readOnly: true }}
                />
              </Box>

              <Button
                variant="outlined"
                fullWidth
                sx={{ mt: 2, textTransform: 'none', fontWeight: 500 }}
              >
                Check for Updates
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
