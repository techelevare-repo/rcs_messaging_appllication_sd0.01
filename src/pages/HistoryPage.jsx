import { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert, Grid, Card, CardContent, CardMedia, Chip, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

export default function HistoryPage() {
  const { user, getPatients } = useAuth();
  const [predictions, setPredictions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found. Please log in.');
          setLoading(false);
          return;
        }

        // If user is a doctor, fetch patients first
        if (user?.role === 'doctor') {
          const patientsResult = await getPatients();
          if (patientsResult.success) {
            setPatients(patientsResult.patients);
          }
        }

        // Fetch predictions
        const url = selectedPatient && user?.role === 'doctor'
          ? `http://localhost:5000/api/predict/history?patientId=${selectedPatient}`
          : 'http://localhost:5000/api/predict/history';

        const response = await axios.get(url, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.data.success) {
          throw new Error(response.data.message || 'Failed to fetch history');
        }

        const data = response.data;
        setPredictions(data.predictions || []);
      } catch (err) {
        console.error('Error fetching history:', err);
        setError(err.response?.data?.message || 'Error loading prediction history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user, selectedPatient, getPatients]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom fontWeight={600}>
          Scan History
        </Typography>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom fontWeight={600}>
        {user?.role === 'doctor' ? 'Patient Scan History' : 'My Scan History'}
      </Typography>

      {user?.role === 'doctor' && patients.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth sx={{ maxWidth: 300 }}>
            <InputLabel>Select Patient</InputLabel>
            <Select
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
              label="Select Patient"
            >
              <MenuItem value="">
                <em>All Patients</em>
              </MenuItem>
              {patients.map((patient) => (
                <MenuItem key={patient._id} value={patient._id}>
                  {patient.firstName} {patient.lastName} ({patient.email})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}

      {predictions.length === 0 ? (
        <Alert severity="info">No predictions found. Upload an image to start analyzing.</Alert>
      ) : (
        <Grid container spacing={3}>
          {predictions.map((prediction) => (
            <Grid size={12} sm={6} md={4} key={prediction._id || prediction.id}>
              <Card sx={{ height: '100%' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={`http://localhost:5000${prediction.imageUrl}`}
                  alt={`Scan ${prediction._id || prediction.id}`}
                  sx={{ objectFit: 'contain', bgcolor: 'black' }}
                />
                <CardContent>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                      <Chip
                        label={prediction.result}
                        color={prediction.result === 'Normal' ? 'success' : 'error'}
                      />
                      <Chip
                        label={prediction.category}
                        color={prediction.category === 'benign' ? 'info' :
                          prediction.category === 'malignant' ? 'error' : 'default'}
                        variant="outlined"
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Confidence: {(prediction.confidence * 100).toFixed(2)}%
                    </Typography>
                    {prediction.patientName && (
                      <Typography variant="body2" color="text.secondary">
                        Patient: {prediction.patientName}
                      </Typography>
                    )}
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Date: {new Date(prediction.createdAt).toLocaleString()}
                  </Typography>
                  {prediction.gradcamUrl && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        GradCAM Visualization
                      </Typography>
                      <CardMedia
                        component="img"
                        height="200"
                        image={`http://localhost:5000${prediction.gradcamUrl}`}
                        alt="GradCAM Visualization"
                        sx={{ objectFit: 'contain', bgcolor: 'black' }}
                      />
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}