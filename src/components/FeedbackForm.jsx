import { useState } from 'react'
import { Box, Typography, Button, TextField, Stack, Snackbar } from '@mui/material'
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt'
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt'
import axios from 'axios'

export default function FeedbackForm() {
  const [feedback, setFeedback] = useState(undefined)
  const [comment, setComment] = useState('')
  const [snackbar, setSnackbar] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Replace with your feedback submission endpoint
    await axios.post('/api/feedback', { feedback, comment })
    setSnackbar(true)
    setFeedback(undefined)
    setComment('')
  }

  return (
    <Box sx={{ p: 3, bgcolor: 'white', borderRadius: 2, boxShadow: 1 }}>
      <Typography variant="h6">Prediction Feedback</Typography>
      <Stack direction="row" spacing={4} sx={{ my: 2 }}>
        <Button
          color={feedback === 'correct' ? 'success' : 'inherit'}
          variant={feedback === 'correct' ? 'contained' : 'outlined'}
          onClick={() => setFeedback('correct')}
          startIcon={<ThumbUpAltIcon />}
        >Correct</Button>
        <Button
          color={feedback === 'incorrect' ? 'error' : 'inherit'}
          variant={feedback === 'incorrect' ? 'contained' : 'outlined'}
          onClick={() => setFeedback('incorrect')}
          startIcon={<ThumbDownAltIcon />}
        >Incorrect</Button>
      </Stack>
      <TextField
        label="Optional Comments"
        value={comment}
        onChange={e => setComment(e.target.value)}
        multiline
        rows={3}
        fullWidth
      />
      <Button
        sx={{ mt: 2 }}
        disabled={!feedback}
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        fullWidth
      >Submit Feedback</Button>
      <Snackbar
        open={snackbar}
        autoHideDuration={3000}
        onClose={() => setSnackbar(false)}
        message="Feedback submitted. Thank you!"
      />
    </Box>
  )
}
