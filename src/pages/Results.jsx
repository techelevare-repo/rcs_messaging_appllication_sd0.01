import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Stack,
  CircularProgress
} from '@mui/material';

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const prediction = location.state?.prediction;

  if (!prediction) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">No prediction data available</Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Go Back
        </Button>
      </Box>
    );
  }

  const confidence = Math.round(prediction.confidence * 100);
  
  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Stack spacing={3}>
            <Typography variant="h5" gutterBottom>
              Prediction Results
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress 
                  variant="determinate" 
                  value={confidence} 
                  size={80}
                  color={prediction.result === 'Normal' ? 'success' : 'error'}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="caption" component="div" color="text.secondary">
                    {`${confidence}%`}
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography variant="h6" color={prediction.result === 'Normal' ? 'success.main' : 'error.main'}>
                  {prediction.result}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Category: {prediction.category}
                </Typography>
              </Box>
            </Box>

            {prediction.imageUrl && (
              <Box>
                <Typography variant="subtitle1" gutterBottom>X-ray Image</Typography>
                <img 
                  src={`http://localhost:5000${prediction.imageUrl}`}
                  alt="X-ray result" 
                  style={{ 
                    maxWidth: '100%', 
                    height: 'auto',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }} 
                />
              </Box>
            )}

            <Button 
              variant="contained" 
              onClick={() => navigate('/')}
              sx={{ mt: 2 }}
            >
              Upload Another Image
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}