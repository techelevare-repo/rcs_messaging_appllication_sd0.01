import { useState } from 'react';
import { 
  Box, Card, CardContent, Typography, Button, LinearProgress,
  Grid, Chip, Rating, TextField, Divider, Dialog, DialogContent, 
  DialogTitle, IconButton, Tab, Tabs
} from '@mui/material';
import { CloudUpload, Visibility, Send, Close, ZoomIn, ZoomOut } from '@mui/icons-material';

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [gradcamOpen, setGradcamOpen] = useState(false);
  const [gradcamTab, setGradcamTab] = useState(0);
  const [zoom, setZoom] = useState(1);

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0]; // Get the first file from the FileList
    if (!selectedFile) return;
    
    setFile(selectedFile);
    setUploading(true);
    
    setTimeout(() => {
      setResults({
        classification: Math.random() > 0.3 ? 'Normal' : 'Abnormal',
        confidence: Math.round(85 + Math.random() * 10),
        processingTime: '2.4s',
        gradcamAvailable: true,
        additionalMetrics: {
          sensitivity: 94.1,
          specificity: 89.7,
          auc: 0.921
        }
      });
      setUploading(false);
    }, 2500);
  };

  const handleFeedbackSubmit = () => {
    alert('Feedback submitted successfully!');
    setRating(0);
    setFeedback('');
  };

  const showGradCAM = () => {
    setGradcamOpen(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h2" gutterBottom fontWeight={600} sx={{ mb: 4 }}>
        Upload X-Ray Image
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box
                sx={{
                  border: '2px dashed',
                  borderColor: 'primary.main',
                  borderRadius: 3,
                  p: 6,
                  textAlign: 'center',
                  bgcolor: 'action.hover',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': { bgcolor: 'action.selected' }
                }}
                onClick={() => document.getElementById('file-input').click()}
              >
                <CloudUpload sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
                <Typography variant="h4" gutterBottom fontWeight={600}>
                  Drag & drop your X-ray image here
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  or click to browse files
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Supported formats: DICOM (.dcm), JPEG (.jpg), PNG (.png)
                </Typography>
              </Box>
              
              <input
                id="file-input"
                type="file"
                hidden
                accept=".dcm,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
              />

              {uploading && (
                <Box sx={{ mt: 3 }}>
                  <LinearProgress sx={{ mb: 2, height: 8, borderRadius: 4 }} />
                  <Typography variant="body2" sx={{ textAlign: 'center' }}>
                    Analyzing X-ray... Please wait
                  </Typography>
                </Box>
              )}

              {file && (
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Typography variant="h6" gutterBottom>Selected Image</Typography>
                  <img
                    src={URL.createObjectURL(file)}
                    alt="X-ray preview"
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: 300, 
                      borderRadius: 8,
                      border: '1px solid #ddd'
                    }}
                  />
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={6}>
          {results && (
            <Card>
              <CardContent>
                <Typography variant="h3" gutterBottom fontWeight={600}>
                  Analysis Results
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body1">Classification:</Typography>
                    <Chip 
                      label={results.classification}
                      color={results.classification === 'Normal' ? 'success' : 'error'}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body1">Confidence:</Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {results.confidence}%
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body1">Processing Time:</Typography>
                    <Typography variant="body1">{results.processingTime}</Typography>
                  </Box>
                </Box>

                {results.gradcamAvailable && (
                  <Button
                    variant="contained"
                    startIcon={<Visibility />}
                    fullWidth
                    onClick={showGradCAM}
                    sx={{ mb: 3, py: 1.5, textTransform: 'none' }}
                  >
                    Show Grad-CAM Heatmap
                  </Button>
                )}

                <Divider sx={{ my: 3 }} />

                <Typography variant="h4" gutterBottom>
                  Rate this prediction
                </Typography>
                <Rating
                  value={rating}
                  onChange={(event, newValue) => setRating(newValue)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Additional feedback (optional)"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="contained"
                  startIcon={<Send />}
                  disabled={rating === 0}
                  onClick={handleFeedbackSubmit}
                  sx={{ textTransform: 'none', py: 1.5 }}
                >
                  Submit Feedback
                </Button>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      {/* Grad-CAM Dialog */}
      <Dialog 
        open={gradcamOpen} 
        onClose={() => setGradcamOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" fontWeight={600}>Grad-CAM Heatmap Visualization</Typography>
          <IconButton onClick={() => setGradcamOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Tabs value={gradcamTab} onChange={(e, val) => setGradcamTab(val)} sx={{ mb: 2 }}>
            <Tab label="Original Image" />
            <Tab label="Heatmap Overlay" />
            <Tab label="Side by Side" />
          </Tabs>
          
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Button
              startIcon={<ZoomIn />}
              onClick={() => setZoom(prev => Math.min(prev + 0.2, 3))}
              size="small"
            >
              Zoom In
            </Button>
            <Button
              startIcon={<ZoomOut />}
              onClick={() => setZoom(prev => Math.max(prev - 0.2, 0.5))}
              size="small"
            >
              Zoom Out
            </Button>
            <Typography variant="body2" sx={{ alignSelf: 'center', ml: 2 }}>
              Zoom: {Math.round(zoom * 100)}%
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center', overflow: 'auto', maxHeight: 600 }}>
            {gradcamTab === 0 && file && (
              <img
                src={URL.createObjectURL(file)}
                alt="Original X-ray"
                style={{ 
                  transform: `scale(${zoom})`,
                  maxWidth: '100%',
                  borderRadius: 8,
                  transition: 'transform 0.2s'
                }}
              />
            )}
            {gradcamTab === 1 && (
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Heatmap highlighting regions of interest for AI decision making
                </Typography>
                <Box 
                  sx={{ 
                    width: '100%', 
                    height: 400, 
                    bgcolor: 'action.hover', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    borderRadius: 2,
                    transform: `scale(${zoom})`,
                    transition: 'transform 0.2s'
                  }}
                >
                  <Typography variant="h6" color="text.secondary">
                    Grad-CAM Heatmap Visualization
                    <br />
                    <small>(Mock visualization - integrate with your ML model)</small>
                  </Typography>
                </Box>
              </Box>
            )}
            {gradcamTab === 2 && (
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle1" gutterBottom>Original</Typography>
                  {file && (
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Original"
                      style={{ 
                        width: '100%', 
                        borderRadius: 8,
                        transform: `scale(${zoom})`,
                        transition: 'transform 0.2s'
                      }}
                    />
                  )}
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1" gutterBottom>With Heatmap</Typography>
                  <Box 
                    sx={{ 
                      width: '100%', 
                      height: 300, 
                      bgcolor: 'action.hover',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 2,
                      transform: `scale(${zoom})`,
                      transition: 'transform 0.2s'
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Heatmap overlay
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
