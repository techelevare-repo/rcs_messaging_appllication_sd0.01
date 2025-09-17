import { Dialog, DialogTitle, DialogContent, Typography } from '@mui/material'

export default function InfoDialog({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>About This App</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle2" gutterBottom>
          This enterprise-level radiology AI app predicts cancer from chest X-rays, now in MVP. Grad-CAM explanations increase clinical trust. Your feedback helps us improve model accuracy and reliability.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Data privacy is strictly maintained.
        </Typography>
      </DialogContent>
    </Dialog>
  )
}
