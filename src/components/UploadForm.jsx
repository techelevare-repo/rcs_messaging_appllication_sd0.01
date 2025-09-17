import { useState } from 'react'
import { Box, Button, Typography, LinearProgress } from '@mui/material'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function UploadForm() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleFileChange = (e) => {
    setFile(e.target.files)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) return
    setLoading(true)
    const formData = new FormData()
    formData.append('xray', file)

    // Replace the URL with your backend API endpoint
    try {
      const res = await axios.post('/api/predict', formData)
      const { prediction, gradcam_url, confidence } = res.data
      navigate('/results', { state: { prediction, gradcam_url, confidence } })
    } catch (err) {
      alert('Upload failed. Please try again!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ p: 3, bgcolor: 'white', borderRadius: 2, boxShadow: 1 }}>
      <Typography variant="h6" gutterBottom>
        Upload Chest X-ray
      </Typography>
      <form onSubmit={handleSubmit}>
        <input
          accept="image/*"
          type="file"
          style={{ display: 'block', marginBottom: 16 }}
          onChange={handleFileChange}
          required
        />
        <Button variant="contained" color="primary" type="submit" disabled={loading || !file} fullWidth>
          {loading ? 'Uploading...' : 'Upload'}
        </Button>
        {loading && <LinearProgress sx={{ mt: 2 }} />}
      </form>
    </Box>
  )
}
