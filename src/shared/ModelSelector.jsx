import React from 'react';
import { useVision } from '../state/VisionContext.jsx';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';

const ModelSelector = () => {
    const { activeModels, removeModel, clearAllModels } = useVision();

    const handleRemoveModel = (modelKey) => {
        removeModel(modelKey);
    };

    const handleClearAll = () => {
        clearAllModels();
    };

    if (activeModels.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography color="text.secondary" gutterBottom>
                    No models selected
                </Typography>
                <Button
                    startIcon={<AddIcon />}
                    variant="outlined"
                    size="small"
                    href="/models"
                >
                    Select Models
                </Button>
            </Box>
        );
    }

    return (
        <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                    Selected Models ({activeModels.length})
                </Typography>
                {activeModels.length > 0 && (
                    <Button
                        size="small"
                        onClick={handleClearAll}
                        color="error"
                    >
                        Clear All
                    </Button>
                )}
            </Stack>

            <Stack spacing={1}>
                {activeModels.map((model) => (
                    <Box
                        key={model.key}
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
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="body2" fontWeight={500}>
                                {model.name}
                            </Typography>
                            <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }}>
                                <Chip
                                    label={model.category}
                                    size="small"
                                    variant="outlined"
                                    color="primary"
                                />
                                {model.supportsRealtime && (
                                    <Chip
                                        label="Real-time"
                                        size="small"
                                        color="success"
                                        variant="outlined"
                                    />
                                )}
                                {!model.supportsRealtime && (
                                    <Chip
                                        label="Upload Only"
                                        size="small"
                                        color="warning"
                                        variant="outlined"
                                    />
                                )}
                            </Stack>
                        </Box>

                        <Tooltip title="Remove model">
                            <IconButton
                                size="small"
                                onClick={() => handleRemoveModel(model.key)}
                                color="error"
                            >
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                ))}
            </Stack>

            {activeModels.length < 7 && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Button
                        startIcon={<AddIcon />}
                        variant="outlined"
                        size="small"
                        href="/models"
                    >
                        Add More Models
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default ModelSelector;
