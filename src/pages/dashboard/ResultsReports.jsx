import React, { useState } from 'react';
import { useVision } from '../../state/VisionContext.jsx';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Modal from '@mui/material/Modal';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterListIcon from '@mui/icons-material/FilterList';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const ResultsReports = () => {
    const {
        detectionHistory,
        clearDetectionHistory,
        exportDetectionHistory
    } = useVision();

    const [searchTerm, setSearchTerm] = useState('');
    const [filterModel, setFilterModel] = useState('');
    const [sortBy, setSortBy] = useState('timestamp');
    const [selectedResult, setSelectedResult] = useState(null);
    const [detailModalOpen, setDetailModalOpen] = useState(false);

    // Get unique models for filter
    const availableModels = [...new Set(detectionHistory.map(result => result.model).filter(Boolean))];

    // Filter and sort results
    const filteredResults = detectionHistory
        .filter(result => {
            const matchesSearch = !searchTerm ||
                result.label?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                result.model?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesModel = !filterModel || result.model === filterModel;
            return matchesSearch && matchesModel;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'timestamp':
                    return new Date(b.timestamp) - new Date(a.timestamp);
                case 'confidence':
                    return b.confidence - a.confidence;
                case 'model':
                    return (a.model || '').localeCompare(b.model || '');
                default:
                    return 0;
            }
        });

    const handleExport = () => {
        exportDetectionHistory();
    };

    const handleClearHistory = () => {
        if (window.confirm('Are you sure you want to clear all detection history? This action cannot be undone.')) {
            clearDetectionHistory();
        }
    };

    const handleViewDetails = (result) => {
        setSelectedResult(result);
        setDetailModalOpen(true);
    };

    const handleCloseDetails = () => {
        setDetailModalOpen(false);
        setSelectedResult(null);
    };

    const formatTimestamp = (timestamp) => {
        return new Date(timestamp).toLocaleString();
    };

    const getConfidenceColor = (confidence) => {
        if (confidence >= 0.8) return 'success';
        if (confidence >= 0.6) return 'warning';
        return 'error';
    };

    const getStatsSummary = () => {
        const totalDetections = detectionHistory.length;
        const modelCounts = detectionHistory.reduce((acc, result) => {
            const model = result.model || 'Unknown';
            acc[model] = (acc[model] || 0) + 1;
            return acc;
        }, {});

        const avgConfidence = detectionHistory.length > 0
            ? detectionHistory.reduce((sum, result) => sum + result.confidence, 0) / detectionHistory.length
            : 0;

        return {
            totalDetections,
            modelCounts,
            avgConfidence,
            uniqueModels: Object.keys(modelCounts).length
        };
    };

    const stats = getStatsSummary();

    return (
        <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Typography variant="h4">
                    Results & Reports
                </Typography>
                <Stack direction="row" spacing={1}>
                    <Button
                        startIcon={<RefreshIcon />}
                        // onClick={() => window.location.reload()}
                        onClick={() => {
                            clearDetectionHistory();
                            setSearchTerm('');
                            setFilterModel('');
                            setSortBy('timestamp');
                            setSelectedResult(null);
                        }}
                        variant="outlined"
                        color="warning"
                    >
                        Refresh
                    </Button>
                    <Button
                        startIcon={<DownloadIcon />}
                        onClick={handleExport}
                        variant="contained"
                        disabled={detectionHistory.length === 0}
                    >
                        Export Data
                    </Button>
                    <Button
                        startIcon={<DeleteIcon />}
                        // onClick={handleClearHistory}
                        onClick={() => {
                            if (window.confirm("Are you sure you want to clear all detection history? ")) {
                                clearDetectionHistory();
                                setSearchTerm('');
                                setFilterModel('');
                                setSortBy('timestamp');
                                setSelectedResult(null);
                            }}
                        }
                             variant="outlined"
                        color="error"
                        disabled={detectionHistory.length === 0}
                    >
                        Clear History
                    </Button>
                </Stack>
            </Stack>

            {detectionHistory.length === 0 ? (
                <Alert severity="info">
                    No detection history available. Start processing with vision models to see results here.
                </Alert>
            ) : (
                <>
                    {/* Statistics Cards */}
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <Card>
                                <CardContent>
                                    <Typography color="text.secondary" gutterBottom>
                                        Total Detections
                                    </Typography>
                                    <Typography variant="h4">
                                        {stats.totalDetections}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <Card>
                                <CardContent>
                                    <Typography color="text.secondary" gutterBottom>
                                        Active Models
                                    </Typography>
                                    <Typography variant="h4">
                                        {stats.uniqueModels}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <Card>
                                <CardContent>
                                    <Typography color="text.secondary" gutterBottom>
                                        Avg Confidence
                                    </Typography>
                                    <Typography variant="h4">
                                        {(stats.avgConfidence * 100).toFixed(1)}%
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <Card>
                                <CardContent>
                                    <Typography color="text.secondary" gutterBottom>
                                        Model Distribution
                                    </Typography>
                                    <Stack direction="row" spacing={0.5} flexWrap="wrap">
                                        {Object.entries(stats.modelCounts).slice(0, 3).map(([model, count]) => (
                                            <Chip
                                                key={model}
                                                label={`${model}: ${count}`}
                                                size="small"
                                                color="primary"
                                                variant="outlined"
                                            />
                                        ))}
                                        {Object.keys(stats.modelCounts).length > 3 && (
                                            <Chip
                                                label={`+${Object.keys(stats.modelCounts).length - 3} more`}
                                                size="small"
                                                color="default"
                                                variant="outlined"
                                            />
                                        )}
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Filters */}
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                <FilterListIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                Filters & Search
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        placeholder="Search detections..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchIcon />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Filter by Model</InputLabel>
                                        <Select
                                            value={filterModel}
                                            label="Filter by Model"
                                            onChange={(e) => setFilterModel(e.target.value)}
                                        >
                                            <MenuItem value="">All Models</MenuItem>
                                            {availableModels.map(model => (
                                                <MenuItem key={model} value={model}>
                                                    {model}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Sort by</InputLabel>
                                        <Select
                                            value={sortBy}
                                            label="Sort by"
                                            onChange={(e) => setSortBy(e.target.value)}
                                        >
                                            <MenuItem value="timestamp">Timestamp</MenuItem>
                                            <MenuItem value="confidence">Confidence</MenuItem>
                                            <MenuItem value="model">Model</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    {/* Results Table */}
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Detection History ({filteredResults.length} results)
                            </Typography>
                            <TableContainer component={Paper} variant="outlined">
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Timestamp</TableCell>
                                            <TableCell>Model</TableCell>
                                            <TableCell>Detection</TableCell>
                                            <TableCell>Confidence</TableCell>
                                            <TableCell>Position</TableCell>
                                            <TableCell>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredResults.map((result, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    {formatTimestamp(result.timestamp)}
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={result.model || 'Unknown'}
                                                        size="small"
                                                        color="primary"
                                                        variant="outlined"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    {result.label}
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={`${(result.confidence * 100).toFixed(1)}%`}
                                                        size="small"
                                                        color={getConfidenceColor(result.confidence)}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    {result.boundingBox ?
                                                        `(${result.boundingBox.x}, ${result.boundingBox.y})` :
                                                        'N/A'
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    <Tooltip title="View Details">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleViewDetails(result)}
                                                        >
                                                            <SearchIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </>
            )}

            {/* Detail Modal */}
            <Dialog
                open={detailModalOpen}
                onClose={handleCloseDetails}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">Detection Details</Typography>
                        <IconButton onClick={handleCloseDetails} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Stack>
                </DialogTitle>
                <DialogContent>
                    {selectedResult && (
                        <Box>
                            {/* Detection Info */}
                            <Grid container spacing={3} sx={{ mb: 3 }}>
                                <Grid size={12} md={6}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>
                                                Detection Information
                                            </Typography>
                                            <Stack spacing={2}>
                                                <Box>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Detection Result
                                                    </Typography>
                                                    <Typography variant="h6">
                                                        {selectedResult.label}
                                                    </Typography>
                                                </Box>
                                                <Box>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Confidence
                                                    </Typography>
                                                    <Chip
                                                        label={`${(selectedResult.confidence * 100).toFixed(1)}%`}
                                                        color={getConfidenceColor(selectedResult.confidence)}
                                                        size="small"
                                                    />
                                                </Box>
                                                <Box>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Model
                                                    </Typography>
                                                    <Chip
                                                        label={selectedResult.model || 'Unknown'}
                                                        color="primary"
                                                        variant="outlined"
                                                        size="small"
                                                    />
                                                </Box>
                                                <Box>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Timestamp
                                                    </Typography>
                                                    <Typography variant="body1">
                                                        {formatTimestamp(selectedResult.timestamp)}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid size={12} md={6}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>
                                                Bounding Box Details
                                            </Typography>
                                            {selectedResult.boundingBox ? (
                                                <Stack spacing={2}>
                                                    <Box>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Position (X, Y)
                                                        </Typography>
                                                        <Typography variant="body1">
                                                            ({selectedResult.boundingBox.x}, {selectedResult.boundingBox.y})
                                                        </Typography>
                                                    </Box>
                                                    <Box>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Size (Width × Height)
                                                        </Typography>
                                                        <Typography variant="body1">
                                                            {selectedResult.boundingBox.width} × {selectedResult.boundingBox.height}
                                                        </Typography>
                                                    </Box>
                                                </Stack>
                                            ) : (
                                                <Typography color="text.secondary">
                                                    No bounding box information available
                                                </Typography>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>

                            {/* Image Visualization */}
                            {selectedResult.additionalInfo?.imageUrl && (
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            Detection Visualization
                                        </Typography>
                                        <Box sx={{ position: 'relative', display: 'inline-block' }}>
                                            <img
                                                src={`http://localhost:5001${selectedResult.additionalInfo.imageUrl}`}
                                                alt="Detection Result"
                                                style={{
                                                    maxWidth: '100%',
                                                    height: 'auto',
                                                    display: 'block',
                                                    borderRadius: 8
                                                }}
                                                onLoad={(e) => {
                                                    // Calculate proper scaling for bounding box overlay
                                                    const img = e.target;
                                                    const imgWidth = img.naturalWidth;
                                                    const imgHeight = img.naturalHeight;
                                                    const displayWidth = img.offsetWidth;
                                                    const displayHeight = img.offsetHeight;

                                                    // Calculate scale factors
                                                    const scaleX = displayWidth / imgWidth;
                                                    const scaleY = displayHeight / imgHeight;

                                                    // Update bounding box position and size
                                                    const bbox = selectedResult.boundingBox;
                                                    if (bbox) {
                                                        const scaledX = bbox.x * scaleX;
                                                        const scaledY = bbox.y * scaleY;
                                                        const scaledWidth = bbox.width * scaleX;
                                                        const scaledHeight = bbox.height * scaleY;

                                                        // Update the bounding box overlay
                                                        const overlay = img.nextElementSibling;
                                                        const label = overlay?.nextElementSibling;

                                                        if (overlay) {
                                                            overlay.style.left = `${scaledX}px`;
                                                            overlay.style.top = `${scaledY}px`;
                                                            overlay.style.width = `${scaledWidth}px`;
                                                            overlay.style.height = `${scaledHeight}px`;
                                                        }

                                                        if (label) {
                                                            label.style.left = `${scaledX}px`;
                                                            label.style.top = `${Math.max(0, scaledY - 25)}px`;
                                                        }
                                                    }
                                                }}
                                            />
                                            {/* Bounding Box Overlay */}
                                            {selectedResult.boundingBox && (
                                                <>
                                                    <Box
                                                        sx={{
                                                            position: 'absolute',
                                                            border: '3px solid #ff4444',
                                                            borderRadius: 1,
                                                            backgroundColor: 'rgba(255, 68, 68, 0.1)',
                                                            pointerEvents: 'none',
                                                            transition: 'all 0.3s ease'
                                                        }}
                                                    />
                                                    {/* Label Overlay */}
                                                    <Box
                                                        sx={{
                                                            position: 'absolute',
                                                            backgroundColor: '#ff4444',
                                                            color: 'white',
                                                            px: 1,
                                                            py: 0.5,
                                                            borderRadius: 1,
                                                            fontSize: '0.75rem',
                                                            fontWeight: 'bold',
                                                            pointerEvents: 'none',
                                                            transition: 'all 0.3s ease'
                                                        }}
                                                    >
                                                        {selectedResult.label} ({(selectedResult.confidence * 100).toFixed(1)}%)
                                                    </Box>
                                                </>
                                            )}
                                        </Box>
                                    </CardContent>
                                </Card>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDetails}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ResultsReports;

