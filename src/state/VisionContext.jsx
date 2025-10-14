import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const VisionContext = createContext(null);

export const VisionProvider = ({ children }) => {
    const [activeModels, setActiveModels] = useState(() => {
        const raw = localStorage.getItem('vision_active_models');
        return raw ? JSON.parse(raw) : [];
    });

    const [processingMode, setProcessingMode] = useState(() => {
        const raw = localStorage.getItem('vision_processing_mode');
        return raw || 'camera'; // 'camera', 'upload', 'both'
    });

    const [confidenceThreshold, setConfidenceThreshold] = useState(() => {
        const raw = localStorage.getItem('vision_confidence_threshold');
        return raw ? parseFloat(raw) : 0.5;
    });

    const [detectionHistory, setDetectionHistory] = useState(() => {
        const raw = localStorage.getItem('vision_detection_history');
        return raw ? JSON.parse(raw) : [];
    });

    useEffect(() => {
        localStorage.setItem('vision_active_models', JSON.stringify(detectionHistory));
    }, [detectionHistory]);

    useEffect(() => {
        localStorage.setItem('vision_processing_mode', processingMode);
    }, [processingMode]);

    useEffect(() => {
        localStorage.setItem('vision_confidence_threshold', confidenceThreshold.toString());
    }, [confidenceThreshold]);

    useEffect(() => {
        localStorage.setItem('vision_detection_history', JSON.stringify(detectionHistory));
    }, [detectionHistory]);

    const addModel = (model) => {
        // Only allow one model at a time - replace any existing model
        setActiveModels([model]);
    };

    const removeModel = (modelKey) => {
        setActiveModels(prev => prev.filter(m => m.key !== modelKey));
    };

    const clearAllModels = () => {
        setActiveModels([]);
    };

    const addDetectionResult = (result) => {
        const newResult = {
            ...result,
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            models: activeModels.map(m => m.key)
        };
        setDetectionHistory(prev => [newResult, ...prev.slice(0, 99)]); // Keep last 100 results
    };

    const clearDetectionHistory = () => {
        setDetectionHistory([]);
        localStorage.removeItem('vision_detection_history');
    };

    const exportDetectionHistory = () => {
        const dataStr = JSON.stringify(detectionHistory, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `vision-detection-history-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const value = useMemo(() => ({
        // Model management
        activeModels,
        addModel,
        removeModel,
        clearAllModels,

        // Processing configuration
        processingMode,
        setProcessingMode,
        confidenceThreshold,
        setConfidenceThreshold,

        // Detection history
        detectionHistory,
        addDetectionResult,
        clearDetectionHistory,
        exportDetectionHistory,

        // Computed values
        hasActiveModels: activeModels.length > 0,
        realtimeModels: activeModels.filter(m => m.supportsRealtime),
        uploadOnlyModels: activeModels.filter(m => !m.supportsRealtime),
    }), [
        activeModels,
        processingMode,
        confidenceThreshold,
        detectionHistory
    ]);

    return <VisionContext.Provider value={value}>{children}</VisionContext.Provider>;
};

export const useVision = () => {
    const ctx = useContext(VisionContext);
    if (!ctx) throw new Error('useVision must be used within VisionProvider');
    return ctx;
};
