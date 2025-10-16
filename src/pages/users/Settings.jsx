import React, { useState } from 'react';
import { useVision } from '../../state/VisionContext.jsx';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Slider from '@mui/material/Slider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import SaveIcon from '@mui/icons-material/Save';
import RestoreIcon from '@mui/icons-material/Restore';
import InfoIcon from '@mui/icons-material/Info';

const Settings = () => {
    const {
        confidenceThreshold,
        setConfidenceThreshold,
        processingMode,
        setProcessingMode,
        activeModels,
        clearAllModels
    } = useVision();

    const [localSettings, setLocalSettings] = useState({
        confidenceThreshold,
        processingMode,
        cameraResolution: '720p',
        maxFileSize: 50,
        autoSave: true,
        showBoundingBoxes: true,
        showConfidenceScores: true,
        enableNotifications: true,
        processingTimeout: 30,
        maxConcurrentModels: 3
    });

    const [hasChanges, setHasChanges] = useState(false);

    const handleSettingChange = (key, value) => {
        setLocalSettings(prev => ({
            ...prev,
            [key]: value
        }));
        setHasChanges(true);
    };

    const handleSaveSettings = () => {
        setConfidenceThreshold(localSettings.confidenceThreshold);
        setProcessingMode(localSettings.processingMode);
        // TODO: Save other settings to backend/localStorage
        setHasChanges(false);
    };

    const handleResetSettings = () => {
        setLocalSettings({
            confidenceThreshold,
            processingMode,
            cameraResolution: '720p',
            maxFileSize: 50,
            autoSave: true,
            showBoundingBoxes: true,
            showConfidenceScores: true,
            enableNotifications: true,
            processingTimeout: 30,
            maxConcurrentModels: 3
        });
        setHasChanges(false);
    };

    const resolutionOptions = [
        { value: '480p', label: '480p (640×480)', width: 640, height: 480 },
        { value: '720p', label: '720p (1280×720)', width: 1280, height: 720 },
        { value: '1080p', label: '1080p (1920×1080)', width: 1920, height: 1080 },
        { value: '4k', label: '4K (3840×2160)', width: 3840, height: 2160 }
    ];

    return (
        <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Typography variant="h4">
                    Settings & Configuration
                </Typography>
                <Stack direction="row" spacing={1}>
                    <Button
                        startIcon={<RestoreIcon />}
                        onClick={handleResetSettings}
                        variant="outlined"
                        disabled={!hasChanges}
                    >
                        Reset
                    </Button>
                    <Button
                        startIcon={<SaveIcon />}
                        onClick={handleSaveSettings}
                        variant="contained"
                        disabled={!hasChanges}
                    >
                        Save Changes
                    </Button>
                </Stack>
            </Stack>

            {hasChanges && (
                <Alert severity="info" sx={{ mb: 3 }}>
                    You have unsaved changes. Don't forget to save your settings.
                </Alert>
            )}

            <Grid container spacing={3}>
                {/* Model Configuration */}
                <Grid size={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Model Configuration
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Confidence Threshold
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        Minimum confidence score for detections to be displayed
                                    </Typography>
                                    <Box sx={{ px: 2 }}>
                                        <Slider
                                            value={localSettings.confidenceThreshold}
                                            onChange={(e, value) => handleSettingChange('confidenceThreshold', value)}
                                            min={0.1}
                                            max={1.0}
                                            step={0.05}
                                            marks={[
                                                { value: 0.1, label: '10%' },
                                                { value: 0.5, label: '50%' },
                                                { value: 0.8, label: '80%' },
                                                { value: 1.0, label: '100%' }
                                            ]}
                                            valueLabelDisplay="auto"
                                            valueLabelFormat={(value) => `${(value * 100).toFixed(0)}%`}
                                        />
                                    </Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Current: {(localSettings.confidenceThreshold * 100).toFixed(0)}%
                                    </Typography>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Processing Mode
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        Default processing mode for new sessions
                                    </Typography>
                                    <FormControl fullWidth>
                                        <InputLabel>Processing Mode</InputLabel>
                                        <Select
                                            value={localSettings.processingMode}
                                            label="Processing Mode"
                                            onChange={(e) => handleSettingChange('processingMode', e.target.value)}
                                        >
                                            <MenuItem value="camera">Live Camera Only</MenuItem>
                                            <MenuItem value="upload">File Upload Only</MenuItem>
                                            <MenuItem value="both">Both Camera & Upload</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Maximum Concurrent Models
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        Maximum number of models that can run simultaneously
                                    </Typography>
                                    <Box sx={{ px: 2 }}>
                                        <Slider
                                            value={localSettings.maxConcurrentModels}
                                            onChange={(e, value) => handleSettingChange('maxConcurrentModels', value)}
                                            min={1}
                                            max={7}
                                            step={1}
                                            marks={[
                                                { value: 1, label: '1' },
                                                { value: 3, label: '3' },
                                                { value: 5, label: '5' },
                                                { value: 7, label: '7' }
                                            ]}
                                            valueLabelDisplay="auto"
                                        />
                                    </Box>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Processing Timeout (seconds)
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        Maximum time to wait for model processing
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        value={localSettings.processingTimeout}
                                        onChange={(e) => handleSettingChange('processingTimeout', parseInt(e.target.value))}
                                        inputProps={{ min: 5, max: 300 }}
                                        helperText="Range: 5-300 seconds"
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Camera & Display Settings */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Camera & Display Settings
                            </Typography>

                            <FormControl fullWidth sx={{ mb: 3 }}>
                                <InputLabel>Default Camera Resolution</InputLabel>
                                <Select
                                    value={localSettings.cameraResolution}
                                    label="Default Camera Resolution"
                                    onChange={(e) => handleSettingChange('cameraResolution', e.target.value)}
                                >
                                    {resolutionOptions.map(option => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <Stack spacing={2}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={localSettings.showBoundingBoxes}
                                            onChange={(e) => handleSettingChange('showBoundingBoxes', e.target.checked)}
                                        />
                                    }
                                    label="Show Bounding Boxes"
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={localSettings.showConfidenceScores}
                                            onChange={(e) => handleSettingChange('showConfidenceScores', e.target.checked)}
                                        />
                                    }
                                    label="Show Confidence Scores"
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={localSettings.enableNotifications}
                                            onChange={(e) => handleSettingChange('enableNotifications', e.target.checked)}
                                        />
                                    }
                                    label="Enable Notifications"
                                />
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                {/* File Upload Settings */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                File Upload Settings
                            </Typography>

                            <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                                Maximum File Size (MB)
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Maximum file size for uploads
                            </Typography>
                            <Box sx={{ px: 2 }}>
                                <Slider
                                    value={localSettings.maxFileSize}
                                    onChange={(e, value) => handleSettingChange('maxFileSize', value)}
                                    min={10}
                                    max={200}
                                    step={10}
                                    marks={[
                                        { value: 10, label: '10MB' },
                                        { value: 50, label: '50MB' },
                                        { value: 100, label: '100MB' },
                                        { value: 200, label: '200MB' }
                                    ]}
                                    valueLabelDisplay="auto"
                                    valueLabelFormat={(value) => `${value}MB`}
                                />
                            </Box>

                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={localSettings.autoSave}
                                        onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                                    />
                                }
                                label="Auto-save Detection Results"
                                sx={{ mt: 3 }}
                            />
                        </CardContent>
                    </Card>
                </Grid>

                {/* Active Models Management */}
                <Grid size={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Active Models Management
                            </Typography>

                            {activeModels.length > 0 ? (
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        Currently active models ({activeModels.length}):
                                    </Typography>
                                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                                        {activeModels.map((model) => (
                                            <Chip
                                                key={model.key}
                                                label={model.name}
                                                color="primary"
                                                variant="outlined"
                                            />
                                        ))}
                                    </Stack>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={() => {
                                            if (window.confirm('Are you sure you want to clear all active models?')) {
                                                clearAllModels();
                                            }
                                        }}
                                    >
                                        Clear All Active Models
                                    </Button>
                                </Box>
                            ) : (
                                <Alert severity="info">
                                    No models are currently active. Visit the Models Catalog to select models.
                                </Alert>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Model Information */}
                <Grid size={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                <InfoIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                Model Information & Accuracy
                            </Typography>

                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                    <Box sx={{ textAlign: 'center', p: 2, border: '1px solid #253056', borderRadius: 1 }}>
                                        <Typography variant="h4" color="primary">
                                            94.2%
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            License Plate Recognition
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                    <Box sx={{ textAlign: 'center', p: 2, border: '1px solid #253056', borderRadius: 1 }}>
                                        <Typography variant="h4" color="primary">
                                            89.7%
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Lane Detection
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                    <Box sx={{ textAlign: 'center', p: 2, border: '1px solid #253056', borderRadius: 1 }}>
                                        <Typography variant="h4" color="primary">
                                            92.1%
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Emotion Detection
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                    <Box sx={{ textAlign: 'center', p: 2, border: '1px solid #253056', borderRadius: 1 }}>
                                        <Typography variant="h4" color="primary">
                                            87.3%
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Object Tracking
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>

                            <Divider sx={{ my: 2 }} />

                            <Typography variant="body2" color="text.secondary">
                                <strong>Datasets Used:</strong> OpenALPR ANPR Dataset, TuSimple Lane Dataset, UTKFace Dataset, COCO Dataset, GTSRB Dataset, FaceForensics++ Dataset, Sign Language MNIST
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Settings;