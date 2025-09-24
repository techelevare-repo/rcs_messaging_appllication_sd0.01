import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Alert,
  LinearProgress,
  Chip,
  Paper,
  Divider
} from '@mui/material';
import {
  CloudUpload,
  Image,
  Analytics,
  Warning,
  CheckCircle,
  Info
} from '@mui/icons-material';

export default function TestUpload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPrediction(null);
      setError(null);
      setMessage('');
    }
  };

  const handleUpload = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found. Please login first.');
        return;
      }

      setLoading(true);
      setError(null);
      setPrediction(null);

      const formData = new FormData();
      formData.append('xray', file);

      console.log('Starting upload...');
      console.log('File:', file.name);

      const response = await axios.post('http://localhost:5000/api/predict', formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Upload response:', response.data);

      if (response.data.success) {
        setPrediction({
          prediction: response.data.prediction.result,
          confidence: response.data.prediction.confidence,
          probabilities: response.data.prediction.probabilities
        });
        setMessage('Analysis completed successfully');
      } else {
        setError('Failed to get prediction results');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
      <Card elevation={3}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Analytics sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h5" component="h1">
              X-Ray Analysis
            </Typography>
          </Box>

          <Paper
            variant="outlined"
            sx={{
              p: 3,
              mb: 3,
              textAlign: 'center',
              border: '2px dashed',
              borderColor: file ? 'primary.main' : 'grey.300',
              bgcolor: file ? 'primary.50' : 'grey.50'
            }}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              id="x-ray-upload"
            />
            <label htmlFor="x-ray-upload">
              <Button
                variant="contained"
                component="span"
                disabled={loading}
                startIcon={<CloudUpload />}
                size="large"
                sx={{ mb: 2 }}
              >
                {file ? 'Change File' : 'Choose X-Ray Image'}
              </Button>
            </label>

            {file ? (
              <Box>
                <Image sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                <Typography variant="h6" color="primary">
                  {file.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB • {file.type}
                </Typography>
              </Box>
            ) : (
              <Box>
                <Image sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
                <Typography variant="body1" color="text.secondary">
                  Select an X-ray image to analyze
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Supported formats: JPG, PNG, JPEG
                </Typography>
              </Box>
            )}
          </Paper>

          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            disabled={!file || loading}
            fullWidth
            size="large"
            sx={{ mb: 2, py: 1.5 }}
          >
            {loading ? 'Analyzing X-Ray...' : 'Analyze X-Ray'}
          </Button>

          {loading && (
            <Box sx={{ width: '100%', mb: 2 }}>
              <LinearProgress />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                Processing your X-ray image...
              </Typography>
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} icon={<Warning />}>
              <Typography variant="h6">Analysis Failed</Typography>
              <Typography>{error}</Typography>
            </Alert>
          )}

          {prediction && (
            <Box sx={{ mt: 2 }}>
              <Alert
                severity={prediction.prediction === 'non-nodule' ? 'success' : prediction.prediction === 'benign' ? 'info' : 'warning'}
                sx={{ mb: 2 }}
                icon={prediction.prediction === 'non-nodule' ? <CheckCircle /> : prediction.prediction === 'benign' ? <Info /> : <Warning />}
              >
                <Typography variant="h6" component="div" gutterBottom>
                  Analysis Result: {prediction.prediction?.charAt(0).toUpperCase() + prediction.prediction?.slice(1) || 'Unknown'}
                </Typography>
                <Typography>
                  {prediction.prediction === 'non-nodule' && 'No suspicious nodules detected in the image. The X-ray appears normal.'}
                  {prediction.prediction === 'benign' && 'A nodule was detected but appears to have benign characteristics. Regular follow-up may be recommended.'}
                  {prediction.prediction === 'malignant' && 'Suspicious nodule detected with characteristics suggesting potential malignancy. Further investigation is strongly recommended.'}
                </Typography>
              </Alert>

              <Card variant="outlined" elevation={1}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <Analytics sx={{ mr: 1 }} />
                    Analysis Details
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Confidence Score
                      </Typography>
                      <Chip
                        label={`${Math.round(prediction.confidence * 100)}%`}
                        color={prediction.confidence > 0.8 ? 'success' : prediction.confidence > 0.6 ? 'warning' : 'error'}
                        variant="outlined"
                        size="large"
                      />
                    </Box>

                    {prediction.probabilities && (
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Probability Distribution
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2">Non-nodule:</Typography>
                            <Chip
                              label={`${(prediction.probabilities[0] * 100).toFixed(1)}%`}
                              size="small"
                              color={prediction.probabilities[0] > 0.5 ? 'success' : 'default'}
                            />
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2">Malignant:</Typography>
                            <Chip
                              label={`${(prediction.probabilities[1] * 100).toFixed(1)}%`}
                              size="small"
                              color={prediction.probabilities[1] > 0.5 ? 'error' : 'default'}
                            />
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2">Benign:</Typography>
                            <Chip
                              label={`${(prediction.probabilities[2] * 100).toFixed(1)}%`}
                              size="small"
                              color={prediction.probabilities[2] > 0.5 ? 'info' : 'default'}
                            />
                          </Box>
                        </Box>
                      </Box>
                    )}

                    <Divider />

                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        File Information
                      </Typography>
                      {file && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <Typography variant="body2">
                            <strong>Name:</strong> {file.name}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Size:</strong> {(file.size / (1024 * 1024)).toFixed(2)} MB
                          </Typography>
                          <Typography variant="body2">
                            <strong>Type:</strong> {file.type}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Note: This is an AI-assisted analysis and should not be used as the sole basis for medical decisions.
                Please consult with a qualified healthcare professional for proper diagnosis.
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}