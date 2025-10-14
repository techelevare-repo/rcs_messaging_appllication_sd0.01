import React from 'react';
import { Link } from 'react-router-dom';
import Grid from '@mui/material/Unstable_Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { useVision } from '../../state/VisionContext.jsx';

const models = [
    {
        key: 'license-plate-recognition',
        name: 'License Plate Recognition',
        description: 'Detect and read vehicle license numbers using EasyOCR/YOLOv8',
        library: 'EasyOCR / YOLOv8',
        dataset: 'OpenALPR ANPR Dataset',
        category: 'Vehicle Detection',
        supportsRealtime: true,
        supportsUpload: true
    },
    {
        key: 'lane-detection',
        name: 'Real-Time Lane Detection',
        description: 'Identify lane boundaries for driving assistance',
        library: 'OpenCV + Canny + Hough',
        dataset: 'TuSimple Lane Dataset',
        category: 'Autonomous Driving',
        supportsRealtime: true,
        supportsUpload: true
    },
    {
        key: 'emotion-age-gender',
        name: 'Emotion, Age & Gender Detection',
        description: 'Predict facial expression, age range, and gender',
        library: 'DeepFace / FaceNet',
        dataset: 'UTKFace Dataset',
        category: 'Face Analytics',
        supportsRealtime: true,
        supportsUpload: true
    },
    {
        key: 'object-tracking',
        name: 'Object Tracking in Videos',
        description: 'Track moving objects using bounding boxes',
        library: 'OpenCV + DeepSORT / YOLO',
        dataset: 'COCO Dataset',
        category: 'Object Detection',
        supportsRealtime: false,
        supportsUpload: true
    },
    {
        key: 'traffic-sign-detection',
        name: 'Traffic Sign Detection',
        description: 'Detect and classify road signs',
        library: 'CNN / YOLOv5',
        dataset: 'GTSRB Dataset',
        category: 'Traffic Analysis',
        supportsRealtime: true,
        supportsUpload: true
    },
    {
        key: 'deepfake-detection',
        name: 'Deepfake Detection & Generation',
        description: 'Detect manipulated faces and optionally create synthetic faces',
        library: 'Xception / MesoNet',
        dataset: 'FaceForensics++ Dataset',
        category: 'Media Analysis',
        supportsRealtime: false,
        supportsUpload: true
    },
    {
        key: 'hand-gesture-recognition',
        name: 'Hand Gesture Recognition',
        description: 'Detect and classify hand poses for controls',
        library: 'MediaPipe / OpenCV',
        dataset: 'Sign Language MNIST',
        category: 'Gesture Control',
        supportsRealtime: true,
        supportsUpload: true
    },
];

const ModelsCatalog = () => {
    const { addModel, activeModels, clearAllModels } = useVision();

    return (
        <Box>
            <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
                Multi-Model Computer Vision Application
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
                Select and configure vision models for real-time processing. Each model works independently - only one model can be active at a time.
            </Typography>

            <Grid container spacing={3}>
                {models.map((m) => (
                    <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={m.key}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                                    <Typography variant="h6" fontWeight={600}>
                                        {m.name}
                                    </Typography>
                                    <Chip
                                        label={m.category}
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                    />
                                </Stack>

                                <Typography color="text.secondary" sx={{ mb: 2 }}>
                                    {m.description}
                                </Typography>

                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        <strong>Library:</strong> {m.library}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Dataset:</strong> {m.dataset}
                                    </Typography>
                                </Box>

                                <Stack direction="row" spacing={1}>
                                    <Chip
                                        label={m.supportsRealtime ? "Real-time" : "Upload Only"}
                                        size="small"
                                        color={m.supportsRealtime ? "success" : "warning"}
                                        variant="outlined"
                                    />
                                    <Chip
                                        label={m.supportsUpload ? "File Upload" : "Camera Only"}
                                        size="small"
                                        color="info"
                                        variant="outlined"
                                    />
                                </Stack>
                            </CardContent>

                            <CardActions sx={{ p: 2, pt: 0 }}>
                                <Button
                                    size="small"
                                    variant="contained"
                                    onClick={() => addModel(m)}
                                    disabled={activeModels.length > 0 && activeModels[0].key === m.key}
                                    fullWidth
                                >
                                    {activeModels.length > 0 && activeModels[0].key === m.key ? 'Currently Active' : 'Activate Model'}
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {activeModels.length > 0 && (
                <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid #253056' }}>
                    <Typography variant="h6" gutterBottom>
                        🎯 Currently Active Model
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 2 }}>
                        {activeModels[0].name} is currently active. You can switch to a different model or deactivate it.
                    </Typography>
                    <Stack direction="row" spacing={2}>
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={clearAllModels}
                            color="error"
                        >
                            Deactivate Current Model
                        </Button>
                    </Stack>
                </Box>
            )}
        </Box>
    );
};

export default ModelsCatalog;


