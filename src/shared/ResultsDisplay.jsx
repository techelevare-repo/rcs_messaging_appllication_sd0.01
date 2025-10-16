import React from 'react';
import { useVision } from '../state/VisionContext.jsx';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DownloadIcon from '@mui/icons-material/Download';
// Timeline components not available in current MUI version, using alternative layout

const ResultsDisplay = ({ results = [] }) => {
    const { clearDetectionHistory, exportDetectionHistory } = useVision();
    if (results.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', py: 4 }}>
                <Alert severity="info">
                    No detection results yet. Start processing to see results here.
                </Alert>
            </Box>
        );
    }

    const formatTimestamp = (timestamp) => {
        return new Date(timestamp).toLocaleString();
    };

    const getConfidenceColor = (confidence) => {
        if (confidence >= 0.8) return 'success';
        if (confidence >= 0.6) return 'warning';
        return 'error';
    };

    const renderDetectionItem = (detection, index) => {
        return (
            <Box key={index} sx={{ mb: 2 }}>
                <Card variant="outlined">
                    <CardContent>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
                            <Typography variant="subtitle1" fontWeight={500}>
                                {detection.label}
                            </Typography>
                            <Stack direction="row" spacing={1}>
                                <Chip
                                    label={`${(detection.confidence * 100).toFixed(1)}%`}
                                    size="small"
                                    color={getConfidenceColor(detection.confidence)}
                                />
                                <Chip
                                    label={formatTimestamp(detection.timestamp)}
                                    size="small"
                                    variant="outlined"
                                    color="info"
                                />
                            </Stack>
                        </Stack>

                        {detection.boundingBox && (
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                Position: ({detection.boundingBox.x}, {detection.boundingBox.y})
                                Size: {detection.boundingBox.width} × {detection.boundingBox.height}
                            </Typography>
                        )}

                        {detection.model && (
                            <Chip
                                label={detection.model}
                                size="small"
                                variant="outlined"
                                color="primary"
                                sx={{ mr: 1 }}
                            />
                        )}

                        {detection.additionalInfo && (
                            <Accordion sx={{ mt: 1 }}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography variant="body2">Additional Details</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography variant="body2" color="text.secondary">
                                        {JSON.stringify(detection.additionalInfo, null, 2)}
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        )}
                    </CardContent>
                </Card>
            </Box>
        );
    };

    const renderModelSummary = () => {
        const modelCounts = results.reduce((acc, result) => {
            const model = result.model || 'Unknown';
            acc[model] = (acc[model] || 0) + 1;
            return acc;
        }, {});

        return (
            <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Detection Summary
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                    {Object.entries(modelCounts).map(([model, count]) => (
                        <Chip
                            key={model}
                            label={`${model}: ${count}`}
                            color="primary"
                            variant="outlined"
                        />
                    ))}
                </Stack>
            </Box>
        );
    };

    return (
        <Box>
            {renderModelSummary()}

            <Typography variant="h6" gutterBottom>
                Detection Results
            </Typography>

            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<DeleteOutlineIcon />}
                    onClick={clearDetectionHistory}
                >
                    Delete History
                </Button>
                <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    startIcon={<DownloadIcon />}
                    onClick={exportDetectionHistory}
                >
                    Export
                </Button>
            </Stack>

            <Stack spacing={2}>
                {results.map((result, index) => renderDetectionItem(result, index))}
            </Stack>
        </Box>
    );
};

export default ResultsDisplay;
