import React from 'react';
import { useVision } from '../../state/VisionContext.jsx';
import Grid from '@mui/material/Unstable_Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { Link } from 'react-router-dom';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AssessmentIcon from '@mui/icons-material/Assessment';

const DashboardHome = () => {
    const { activeModels, hasActiveModels, detectionHistory } = useVision();

    return (
        <Box>
            <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
                Multi-Model Computer Vision Dashboard
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
                Enterprise AI Vision System for real-time computer vision processing with independent model selection
            </Typography>

            {!hasActiveModels && (
                <Alert severity="info" sx={{ mb: 3 }}>
                    No model is currently active. Visit the Models Catalog to select and activate a vision model for processing.
                </Alert>
            )}

            <Grid container spacing={3}>
                {/* Quick Stats */}
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card>
                        <CardContent>
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <VisibilityIcon color="primary" />
                                <Box>
                                    <Typography color="text.secondary" gutterBottom>
                                        Active Model
                                    </Typography>
                                    <Typography variant="h4">
                                        {activeModels.length > 0 ? '1' : '0'}
                                    </Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card>
                        <CardContent>
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <AssessmentIcon color="success" />
                                <Box>
                                    <Typography color="text.secondary" gutterBottom>
                                        Total Detections
                                    </Typography>
                                    <Typography variant="h4">
                                        {detectionHistory.length}
                                    </Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card>
                        <CardContent>
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <PlayArrowIcon color="warning" />
                                <Box>
                                    <Typography color="text.secondary" gutterBottom>
                                        Real-time Model
                                    </Typography>
                                    <Typography variant="h4">
                                        {activeModels.length > 0 && activeModels[0].supportsRealtime ? '1' : '0'}
                                    </Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card>
                        <CardContent>
                            <Typography color="text.secondary" gutterBottom>
                                Upload Model
                            </Typography>
                            <Typography variant="h4">
                                {activeModels.length > 0 && !activeModels[0].supportsRealtime ? '1' : '0'}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Active Models */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Active Model
                            </Typography>
                            {hasActiveModels ? (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        p: 2,
                                        border: '1px solid #253056',
                                        borderRadius: 1,
                                        bgcolor: 'background.paper'
                                    }}
                                >
                                    <Typography variant="body1" fontWeight={500}>
                                        {activeModels[0].name}
                                    </Typography>
                                    <Stack direction="row" spacing={0.5}>
                                        <Chip
                                            label={activeModels[0].category}
                                            size="small"
                                            variant="outlined"
                                            color="primary"
                                        />
                                        {activeModels[0].supportsRealtime && (
                                            <Chip
                                                label="Real-time"
                                                size="small"
                                                color="success"
                                                variant="outlined"
                                            />
                                        )}
                                    </Stack>
                                </Box>
                            ) : (
                                <Typography color="text.secondary">
                                    No model active. Select a model from the Models Catalog.
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Quick Actions */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Quick Actions
                            </Typography>
                            <Stack spacing={2}>
                                <Button
                                    component={Link}
                                    to="/models"
                                    variant="contained"
                                    fullWidth
                                    startIcon={<VisibilityIcon />}
                                >
                                    Browse Models Catalog
                                </Button>
                                <Button
                                    component={Link}
                                    to="/vision-processing"
                                    variant="outlined"
                                    fullWidth
                                    startIcon={<PlayArrowIcon />}
                                    disabled={!hasActiveModels}
                                >
                                    Start Vision Processing
                                </Button>
                                <Button
                                    component={Link}
                                    to="/results"
                                    variant="outlined"
                                    fullWidth
                                    startIcon={<AssessmentIcon />}
                                    disabled={detectionHistory.length === 0}
                                >
                                    View Results & Reports
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Recent Activity */}
                {detectionHistory.length > 0 && (
                    <Grid size={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Recent Detections
                                </Typography>
                                <Stack spacing={1}>
                                    {detectionHistory.slice(0, 5).map((result, index) => (
                                        <Box
                                            key={index}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                p: 1,
                                                border: '1px solid #253056',
                                                borderRadius: 1,
                                                bgcolor: 'background.paper'
                                            }}
                                        >
                                            <Box>
                                                <Typography variant="body2" fontWeight={500}>
                                                    {result.label}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {new Date(result.timestamp).toLocaleString()}
                                                </Typography>
                                            </Box>
                                            <Stack direction="row" spacing={1}>
                                                <Chip
                                                    label={result.model || 'Unknown'}
                                                    size="small"
                                                    color="primary"
                                                    variant="outlined"
                                                />
                                                <Chip
                                                    label={`${(result.confidence * 100).toFixed(1)}%`}
                                                    size="small"
                                                    color={result.confidence >= 0.8 ? 'success' : result.confidence >= 0.6 ? 'warning' : 'error'}
                                                />
                                            </Stack>
                                        </Box>
                                    ))}
                                </Stack>
                                {detectionHistory.length > 5 && (
                                    <Button
                                        component={Link}
                                        to="/results"
                                        variant="text"
                                        size="small"
                                        sx={{ mt: 1 }}
                                    >
                                        View All Results ({detectionHistory.length})
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
};

export default DashboardHome;


