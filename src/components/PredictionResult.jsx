import { Card, CardContent, Typography, Chip, Box } from '@mui/material'

export default function PredictionResult({ prediction, confidence, probabilities }) {
  const getColor = (prediction) => {
    switch(prediction?.toLowerCase()) {
      case 'malignant': return 'error';
      case 'benign': return 'success';
      case 'non-nodule': return 'info';
      default: return 'default';
    }
  };

  const confidencePercent = confidence ? Math.round(confidence * 100) : 0;

  return (
    <Card sx={{ mb: 2, bgcolor: '#e3f2fd' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Prediction Result</Typography>
        
        <Box sx={{ mb: 2 }}>
          <Chip
            label={prediction || 'Unknown'}
            color={getColor(prediction)}
            sx={{ mt: 1, mb: 1, fontWeight: 'bold' }}
          />
        </Box>

        <Typography variant="body1" gutterBottom>
          Confidence: {confidencePercent}%
        </Typography>

        {probabilities && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Detailed Probabilities:
            </Typography>
            {Object.entries(probabilities).map(([key, value]) => (
              <Typography key={key} variant="body2" sx={{ ml: 2 }}>
                {key}: {Math.round(value * 100)}%
              </Typography>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  )
}
