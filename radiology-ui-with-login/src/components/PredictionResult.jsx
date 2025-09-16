import { Card, CardContent, Typography, Chip } from '@mui/material'

export default function PredictionResult({ prediction, confidence }) {
  return (
    <Card sx={{ mb: 2, bgcolor: '#e3f2fd' }}>
      <CardContent>
        <Typography variant="h6">Prediction</Typography>
        <Chip
          label={prediction === 'Abnormal' ? 'Abnormal' : 'Normal'}
          color={prediction === 'Abnormal' ? 'error' : 'success'}
          sx={{ mt: 1, mb: 1, fontWeight: 'bold' }}
        />
        <Typography variant="body2" sx={{ mt: 1 }}>
          Confidence: {confidence ? `${Math.round(confidence * 100)}%` : 'N/A'}
        </Typography>
      </CardContent>
    </Card>
  )
}
