// server.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Connect to database
console.log('Starting Vision Backend Server...');
connectDB();

const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true
}));
app.use(express.json());

// Disable caching for API routes
app.use('/api', (req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
});

// Static file serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/results', express.static(path.join(__dirname, 'results')));

// Create required directories if they don't exist
const dirs = [
    path.join(__dirname, 'uploads'),
    path.join(__dirname, 'results'),
    path.join(__dirname, 'uploads', 'license-plates'),
    path.join(__dirname, 'uploads', 'gestures'),
    path.join(__dirname, 'uploads', 'temp'),
];
dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/vision', require('./routes/vision'));
app.use('/api/upload', require('./routes/upload'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => {
    console.log(`Vision Backend Server running on port ${PORT}`);
    console.log(`API Documentation available at: http://localhost:${PORT}/api-docs.md`);
    // Preload persistent gesture worker so the model is ready
    try {
        const workerScript = require('path').resolve(__dirname, 'services', 'gestureWorker.py');
        const tfPythonPath = require('path').resolve(__dirname, '..', 'tf', 'Scripts', 'python.exe');
        const modelPath = require('path').resolve(__dirname, '..', 'model.keras');
        const lePath = require('path').resolve(__dirname, '..', 'label_encoder.pkl');
        if (require('fs').existsSync(workerScript) && require('fs').existsSync(modelPath) && require('fs').existsSync(lePath)) {
            const { spawn } = require('child_process');
            const warm = spawn(tfPythonPath, [workerScript, modelPath, lePath], { stdio: 'ignore' });
            setTimeout(() => {
                try { warm.kill('SIGTERM'); } catch { }
                console.log('Gesture worker preloaded at startup');
            }, 8000);
        }
    } catch (e) {
        console.log('Gesture worker preload skipped:', e?.message || e);
    }
}).on('error', (err) => {
    console.error('Server error:', err);
});

