import { Card, CardContent, Typography } from '@mui/material'

export default function GradCamView({ gradcamUrl }) {
  if (!gradcamUrl) return null
  return (
    <Card>
      <CardContent>
        <Typography variant="subtitle1" gutterBottom>
          Grad-CAM Region Highlight
        </Typography>
        <img
          src={gradcamUrl}
          alt="Grad-CAM Heatmap"
          style={{ width: '100%', borderRadius: 8 }}
        />
      </CardContent>
    </Card>
  )
}
