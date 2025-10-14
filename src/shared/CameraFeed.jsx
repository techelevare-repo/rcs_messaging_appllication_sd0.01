import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useVision } from '../state/VisionContext.jsx';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import VideocamIcon from '@mui/icons-material/Videocam';

const RESOLUTIONS = [
    { key: '720p', width: 1280, height: 720 },
    { key: '1080p', width: 1920, height: 1080 },
    { key: '480p', width: 640, height: 480 },
];

const CameraFeed = () => {
    const { activeModels, confidenceThreshold, addDetectionResult } = useVision();

    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const rafRef = useRef(0);
    const processingRef = useRef(false);

    const [devices, setDevices] = useState([]);
    const [deviceId, setDeviceId] = useState('');
    const [resolutionKey, setResolutionKey] = useState('720p');
    const [active, setActive] = useState(false);
    const [error, setError] = useState('');
    const [fps, setFps] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [detectionCount, setDetectionCount] = useState(0);

    const selectedResolution = useMemo(
        () => RESOLUTIONS.find((r) => r.key === resolutionKey) || RESOLUTIONS[0],
        [resolutionKey]
    );

    const stopProcessing = useCallback(() => {
        cancelAnimationFrame(rafRef.current);
        setIsProcessing(false);
        processingRef.current = false;
    }, []);

    const stopStream = useCallback(() => {
        cancelAnimationFrame(rafRef.current);
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((t) => t.stop());
            streamRef.current = null;
        }
        setActive(false);
        stopProcessing();
    }, [stopProcessing]);

    const startStream = useCallback(async () => {
        setError('');
        try {
            const constraints = {
                video: {
                    deviceId: deviceId ? { exact: deviceId } : undefined,
                    width: { ideal: selectedResolution.width },
                    height: { ideal: selectedResolution.height },
                },
                audio: false,
            };
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
                setActive(true);
            }

            // FPS meter
            let last = performance.now();
            let frames = 0;
            const tick = () => {
                const now = performance.now();
                frames += 1;
                if (now - last >= 1000) {
                    setFps(frames);
                    frames = 0;
                    last = now;
                }
                rafRef.current = requestAnimationFrame(tick);
            };
            rafRef.current = requestAnimationFrame(tick);
        } catch (e) {
            setError(e?.message || 'Unable to access camera');
            stopStream();
        }
    }, [deviceId, selectedResolution, stopStream]);

    const captureSnapshot = useCallback(() => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;
        const width = video.videoWidth;
        const height = video.videoHeight;
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, width, height);
    }, []);

    const processFrame = useCallback(async () => {
        if (!activeModels.length || processingRef.current) return;

        const video = videoRef.current;
        if (!video || video.readyState !== video.HAVE_ENOUGH_DATA) return;

        processingRef.current = true;
        setIsProcessing(true);

        try {
            // Create a temporary canvas to capture the current frame
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            tempCanvas.width = video.videoWidth;
            tempCanvas.height = video.videoHeight;
            tempCtx.drawImage(video, 0, 0);

            // Convert to blob for processing
            const blob = await new Promise(resolve => tempCanvas.toBlob(resolve, 'image/jpeg', 0.8));

            // TODO: Send to backend for model processing
            // For now, simulate processing with mock results
            const mockResults = activeModels.map(model => ({
                label: `${model.name} Detection`,
                confidence: Math.random() * 0.4 + 0.6, // 0.6-1.0
                boundingBox: {
                    x: Math.random() * (video.videoWidth - 100),
                    y: Math.random() * (video.videoHeight - 100),
                    width: 50 + Math.random() * 50,
                    height: 50 + Math.random() * 50
                },
                model: model.name,
                additionalInfo: {
                    timestamp: new Date().toISOString(),
                    frameSize: { width: video.videoWidth, height: video.videoHeight }
                }
            }));

            // Filter results by confidence threshold
            const filteredResults = mockResults.filter(result => result.confidence >= confidenceThreshold);

            // Add to detection history
            filteredResults.forEach(result => {
                addDetectionResult(result);
                setDetectionCount(prev => prev + 1);
            });

        } catch (error) {
            console.error('Error processing frame:', error);
        } finally {
            processingRef.current = false;
            setIsProcessing(false);
        }
    }, [activeModels, confidenceThreshold, addDetectionResult]);

    const startProcessing = useCallback(() => {
        if (!activeModels.length) {
            setError('No active models selected. Please select models from the Models Catalog.');
            return;
        }

        const processLoop = () => {
            if (active && activeModels.length > 0) {
                processFrame();
                rafRef.current = requestAnimationFrame(processLoop);
            }
        };

        rafRef.current = requestAnimationFrame(processLoop);
    }, [active, activeModels, processFrame]);

    useEffect(() => {
        let unmounted = false;
        const enumerate = async () => {
            try {
                const list = await navigator.mediaDevices.enumerateDevices();
                const cams = list.filter((d) => d.kind === 'videoinput');
                if (!unmounted) {
                    setDevices(cams);
                    if (!deviceId && cams[0]?.deviceId) setDeviceId(cams[0].deviceId);
                }
            } catch (e) {
                // ignore, will surface on getUserMedia
            }
        };
        enumerate();
        return () => {
            unmounted = true;
        };
    }, [deviceId]);

    useEffect(() => {
        return () => stopStream();
    }, [stopStream]);

    return (
        <Box>
            {/* Camera Controls */}
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                <FormControl size="small" sx={{ minWidth: 220 }}>
                    <InputLabel id="camera-device-label">Camera</InputLabel>
                    <Select
                        labelId="camera-device-label"
                        label="Camera"
                        value={deviceId}
                        onChange={(e) => setDeviceId(e.target.value)}
                    >
                        {devices.map((d) => (
                            <MenuItem key={d.deviceId} value={d.deviceId}>
                                {d.label || `Camera ${d.deviceId.substring(0, 6)}`}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel id="res-label">Resolution</InputLabel>
                    <Select
                        labelId="res-label"
                        label="Resolution"
                        value={resolutionKey}
                        onChange={(e) => setResolutionKey(e.target.value)}
                    >
                        {RESOLUTIONS.map((r) => (
                            <MenuItem key={r.key} value={r.key}>{r.key}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button
                    variant="contained"
                    onClick={startStream}
                    disabled={active}
                    startIcon={<VideocamIcon />}
                >
                    Start Camera
                </Button>
                <Button
                    variant="outlined"
                    onClick={stopStream}
                    disabled={!active}
                    startIcon={<StopIcon />}
                >
                    Stop Camera
                </Button>
                <Button
                    variant="text"
                    onClick={captureSnapshot}
                    disabled={!active}
                    startIcon={<CameraAltIcon />}
                >
                    Snapshot
                </Button>
            </Stack>

            {/* Processing Controls */}
            {activeModels.length > 0 && (
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        Active Model: {activeModels[0].name}
                    </Typography>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={startProcessing}
                        disabled={!active || isProcessing}
                        startIcon={<PlayArrowIcon />}
                        size="small"
                    >
                        {isProcessing ? 'Processing...' : 'Start Processing'}
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={stopProcessing}
                        disabled={!isProcessing}
                        startIcon={<StopIcon />}
                        size="small"
                    >
                        Stop Processing
                    </Button>
                    <Chip
                        label={`Confidence: ${(confidenceThreshold * 100).toFixed(0)}%`}
                        size="small"
                        color="info"
                        variant="outlined"
                    />
                    {detectionCount > 0 && (
                        <Chip
                            label={`${detectionCount} Detections`}
                            size="small"
                            color="success"
                        />
                    )}
                </Stack>
            )}

            {/* Status Indicators */}
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <Chip
                    label={active ? `Live • ${fps} FPS` : 'Camera Off'}
                    color={active ? 'success' : 'default'}
                    size="small"
                />
                {isProcessing && (
                    <Chip
                        label="Processing"
                        color="warning"
                        size="small"
                    />
                )}
                {activeModels.length === 0 && (
                    <Chip
                        label="No Active Model"
                        color="error"
                        size="small"
                    />
                )}
            </Stack>

            {error && (
                <Alert severity="error" sx={{ mb: 1 }}>
                    {error}
                </Alert>
            )}

            {/* Video Display */}
            <Box sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden', border: '1px solid #253056' }}>
                <video ref={videoRef} playsInline muted style={{ width: '100%', height: 'auto', display: 'block' }} />
                {isProcessing && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            bgcolor: 'rgba(0, 0, 0, 0.7)',
                            color: 'white',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            fontSize: '0.75rem'
                        }}
                    >
                        Processing...
                    </Box>
                )}
            </Box>

            {/* Snapshot Preview */}
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Snapshot preview</Typography>
            <canvas ref={canvasRef} style={{ width: '100%', height: 'auto', borderRadius: 8, border: '1px solid #253056' }} />
        </Box>
    );
};

export default CameraFeed;


