import React, { useState } from 'react';
import { useVision } from '../../state/VisionContext.jsx';
import Grid from '@mui/material/Unstable_Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import CameraFeed from '../../shared/CameraFeed.jsx';
import FileUpload from '../../shared/FileUpload.jsx';
import ModelSelector from '../../shared/ModelSelector.jsx';
import ResultsDisplay from '../../shared/ResultsDisplay.jsx';

const VisionProcessing = () => {
    const { activeModels, hasActiveModels, processingMode, setProcessingMode } = useVision();
    const [currentTab, setCurrentTab] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [detectionResults, setDetectionResults] = useState([]);

    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
        setProcessingMode(newValue === 0 ? 'camera' : 'upload');
    };

    const handleStartProcessing = () => {
        setIsProcessing(true);
        // TODO: Implement actual model processing
        // This will be connected to the backend APIs
    };

    const handleStopProcessing = () => {
        setIsProcessing(false);
        // TODO: Stop model processing
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
                Vision Processing Center
            </Typography>

            {!hasActiveModels && (
                <Alert severity="info" sx={{ mb: 3 }}>
                    No model is currently active. Please select a model from the Models Catalog to start processing.
                </Alert>
            )}

            <Grid container spacing={3}>
                {/* Model Selection Panel */}
                <Grid size={{ xs: 12, lg: 4 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Active Model
                            </Typography>
                            <ModelSelector />

                            {hasActiveModels && (
                                <Stack spacing={2} sx={{ mt: 3 }}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Processing Controls
                                    </Typography>
                                    <Stack direction="row" spacing={1}>
                                        <Button
                                            variant="contained"
                                            onClick={handleStartProcessing}
                                            disabled={isProcessing}
                                            fullWidth
                                        >
                                            {isProcessing ? 'Processing...' : 'Start Processing'}
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            onClick={handleStopProcessing}
                                            disabled={!isProcessing}
                                        >
                                            Stop
                                        </Button>
                                    </Stack>
                                </Stack>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Main Processing Area */}
                <Grid size={{ xs: 12, lg: 8 }}>
                    <Card>
                        <CardContent>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                                <Tabs value={currentTab} onChange={handleTabChange}>
                                    <Tab label="Live Camera" />
                                    <Tab label="File Upload" />
                                </Tabs>
                            </Box>

                            {currentTab === 0 && (
                                <Box>
                                    <Typography variant="h6" gutterBottom>
                                        Live Camera Processing
                                    </Typography>
                                    <CameraFeed />
                                </Box>
                            )}

                            {currentTab === 1 && (
                                <Box>
                                    <Typography variant="h6" gutterBottom>
                                        File Upload Processing
                                    </Typography>
                                    <FileUpload />
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Results Display */}
                {hasActiveModels && (
                    <Grid size={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Detection Results
                                </Typography>
                                <ResultsDisplay results={detectionResults} />
                            </CardContent>
                        </Card>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
};

export default VisionProcessing;
