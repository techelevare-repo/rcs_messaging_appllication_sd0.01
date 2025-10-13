const path = require('path');
const fs = require('fs');
const ptLicensePlatePredictor = require('../services/ptLicensePlatePredictor');
const Image = require('../models/Image');
const Detection = require('../models/Detection');

exports.predictLicensePlate = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        console.log('User ID:', req.user.id);
        console.log('File details:', {
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            path: req.file.path
        });

        // Read the uploaded file
        const imageBuffer = fs.readFileSync(req.file.path);

        // Get prediction from license plate detection model
        console.log('Getting license plate prediction from PT model...');
        const predictionResult = await ptLicensePlatePredictor.predict(imageBuffer);

        console.log('Prediction result:', predictionResult);

        // Generate unique filename
        const timestamp = Date.now();
        const filename = `license_plate_${timestamp}_${req.file.originalname}`;
        const uploadPath = path.join(__dirname, '..', 'uploads', 'license-plates', filename);

        console.log('Saving files...');
        console.log('Upload path:', uploadPath);

        // Move file to uploads directory
        fs.copyFileSync(req.file.path, uploadPath);

        // Clean up temp file
        fs.unlinkSync(req.file.path);

        // Save image to database
        const image = new Image({
            userId: req.user.id,
            filename: filename,
            originalName: req.file.originalname,
            path: uploadPath,
            mimetype: req.file.mimetype,
            size: req.file.size,
            modelType: 'license-plate-recognition'
        });

        console.log('Saving to database...');
        const savedImage = await image.save();

        // Create and save detection record
        const detectionDoc = await Detection.create({
            userId: req.user.id,
            modelType: 'license-plate-recognition',
            imageId: savedImage._id,
            result: predictionResult.prediction,
            confidence: predictionResult.confidence,
            boundingBoxes: predictionResult.boundingBoxes,
            additionalData: {
                licensePlateText: predictionResult.licensePlateText,
                processingTime: predictionResult.processingTime
            },
            processingTime: predictionResult.processingTime
        });

        res.json({
            success: true,
            detection: {
                id: detectionDoc._id,
                result: detectionDoc.result,
                confidence: detectionDoc.confidence,
                boundingBoxes: detectionDoc.boundingBoxes,
                licensePlateText: predictionResult.licensePlateText,
                imageUrl: `/uploads/license-plates/${filename}`,
                processingTime: detectionDoc.processingTime
            }
        });
    } catch (error) {
        console.error('License plate prediction error:', error);
        // Clean up temp file if it exists
        if (req.file && req.file.path && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({
            success: false,
            message: 'Error processing license plate detection',
            error: error.message
        });
    }
};

// Get detection history for a user
exports.getDetectionHistory = async (req, res) => {
    try {
        const { modelType } = req.query;

        let query = { userId: req.user.id };
        if (modelType) {
            query.modelType = modelType;
        }

        const detections = await Detection.find(query)
            .sort({ createdAt: -1 })
            .populate('imageId')
            .populate('userId', 'firstName lastName email');

        res.json({
            success: true,
            detections: detections.map(detection => ({
                id: detection._id,
                modelType: detection.modelType,
                result: detection.result,
                confidence: detection.confidence,
                boundingBoxes: detection.boundingBoxes,
                additionalData: detection.additionalData,
                imageUrl: detection.imageId ? `/uploads/license-plates/${detection.imageId.filename}` : null,
                createdAt: detection.createdAt,
                processingTime: detection.processingTime
            }))
        });
    } catch (error) {
        console.error('Error fetching detection history:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching detection history',
            error: error.message
        });
    }
};

// Get dashboard statistics for a user
exports.getDashboardStats = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get total detections count
        const totalDetections = await Detection.countDocuments({ userId });

        // Get license plate detections count
        const licensePlateDetections = await Detection.countDocuments({
            userId,
            modelType: 'license-plate-recognition'
        });

        // Get average confidence
        const avgConfidenceResult = await Detection.aggregate([
            { $match: { userId: userId } },
            { $group: { _id: null, avgConfidence: { $avg: '$confidence' } } }
        ]);
        const avgConfidence = avgConfidenceResult.length > 0 ? avgConfidenceResult[0].avgConfidence : 0;

        // Get recent activity
        const recentActivity = await Detection.find({ userId })
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('imageId')
            .select('result confidence createdAt modelType imageId');

        const stats = {
            totalDetections,
            licensePlateDetections,
            avgConfidence: Math.round(avgConfidence * 100) / 100,
            activeModels: 1 // Currently only license plate detection
        };

        res.json({
            success: true,
            stats,
            recentActivity: recentActivity.map(activity => ({
                id: activity._id,
                modelType: activity.modelType,
                result: activity.result,
                confidence: Math.round(activity.confidence * 100) / 100,
                createdAt: activity.createdAt,
                imageUrl: activity.imageId ? `/uploads/license-plates/${activity.imageId.filename}` : null
            }))
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard statistics',
            error: error.message
        });
    }
};

