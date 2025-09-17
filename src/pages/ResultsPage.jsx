import { useLocation, useNavigate } from 'react-router-dom'
import PredictionResult from '../components/PredictionResult'
import GradCamView from '../components/GradCamView'
import { Button, Box } from '@mui/material'

export default function ResultsPage() {
  const { state } = useLocation()
  const navigate = useNavigate()
  if (!state) return <Box p={3}>No result found. Please upload an X-ray.</Box>

  return (
    <Box sx={{ maxWidth: 600, m: 'auto', mt: 3 }}>
      <PredictionResult prediction={state.prediction} confidence={state.confidence} />
      <GradCamView gradcamUrl={state.gradcam_url} />
      <Button variant="outlined" sx={{ mt: 2 }} onClick={() => navigate('/feedback')}>
        Give Feedback
      </Button>
    </Box>
  )
}
