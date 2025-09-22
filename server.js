// server.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Connect to database
console.log('Starting server...');
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
    path.join(__dirname, 'uploads', 'benign'),
    path.join(__dirname, 'uploads', 'malignant'),
    path.join(__dirname, 'uploads', 'non-nodule'),
];
dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Serve API Documentation
app.get('/api-docs.md', (req, res) => {
    const docPath = path.join(__dirname, 'api-docs.md');
    res.header('Content-Type', 'text/markdown');
    res.sendFile(docPath);
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/predict', require('./routes/predict'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/feedback', require('./routes/feedback'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API Documentation available at: http://localhost:${PORT}/api-docs.md`);
}).on('error', (err) => {
    console.error('Server error:', err);
});