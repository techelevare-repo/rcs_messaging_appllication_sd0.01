const path = require('path');
const fs = require('fs');

// Function to get the appropriate upload directory based on prediction
const getUploadDirectory = (predictionType) => {
    const baseDir = path.join(__dirname, '..', 'uploads', 'test');
    switch (predictionType) {
        case 'benign':
            return path.join(baseDir, 'benign');
        case 'malignant':
            return path.join(baseDir, 'malignant');
        case 'non-nodule':
            return path.join(baseDir, 'non-nodule');
        default:
            return path.join(baseDir, 'unknown');
    }
};

exports.uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // File will be moved to appropriate directory after prediction
        res.status(200).json({
            message: 'File uploaded successfully',
            file: req.file.filename
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'Error uploading file' });
    }
};

exports.getImage = async (req, res) => {
    try {
        const { filename, type, category } = req.params;
        const imagePath = path.join(
            __dirname,
            '..',
            type === 'result' ? 'results' : 'uploads',
            'test',
            category,
            filename
        );

        if (!fs.existsSync(imagePath)) {
            return res.status(404).json({ message: 'Image not found' });
        }

        res.sendFile(imagePath);
    } catch (error) {
        console.error('Get image error:', error);
        res.status(500).json({ message: 'Error retrieving image' });
    }
};
