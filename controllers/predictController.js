const path = require('path');
const fs = require('fs');
const predictor = require('../services/imagePredictor');
const Image = require('../models/Image');
const Prediction = require('../models/Prediction');

exports.getPrediction = async (req, res) => {
    try {
        const prediction = await Prediction.findById(req.params.id).populate('imageId');

        if (!prediction) {
            return res.status(404).json({
                success: false,
                message: 'Prediction not found'
            });
        }

        if (prediction.userId.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to view this prediction'
            });
        }

        res.json({
            success: true,
            prediction: {
                id: prediction._id,
                result: prediction.result,
                confidence: prediction.confidence,
                probabilities: prediction.probabilities,
                category: prediction.category,
                imageUrl: `/uploads/${prediction.category}/${prediction.imageId.filename}`,
                gradcamUrl: prediction.gradcamUrl,
                createdAt: prediction.createdAt
            }
        });
    } catch (error) {
        console.error('Error fetching prediction:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching prediction',
            error: error.message
        });
    }
};

// Get prediction history for a user
exports.getPredictionHistory = async (req, res) => {
    try {
        const { patientId } = req.query;
        const User = require('../models/User');

        // Get current user to check role
        const currentUser = await User.findById(req.user.id);

        let userId = req.user.id;

        // If doctor is requesting patient's history
        if (patientId && currentUser.role === 'doctor') {
            // Verify that the patient is assigned to this doctor
            const patient = await User.findOne({
                _id: patientId,
                assignedDoctor: req.user.id,
                role: 'patient'
            });

            if (!patient) {
                return res.status(403).json({
                    success: false,
                    message: 'You are not authorized to view this patient\'s history'
                });
            }

            userId = patientId;
        } else if (patientId && currentUser.role !== 'doctor') {
            return res.status(403).json({
                success: false,
                message: 'Only doctors can view patient histories'
            });
        }

        const predictions = await Prediction.find({ userId })
            .sort({ createdAt: -1 })
            .populate('imageId')
            .populate('userId', 'firstName lastName email');

        res.json({
            success: true,
            predictions: predictions.map(pred => ({
                id: pred._id,
                prediction: pred.result,
                confidence: pred.confidence,
                probabilities: pred.probabilities,
                category: pred.category,
                gradcamUrl: pred.gradcamUrl,
                imageUrl: `/uploads/${pred.category}/${pred.imageId.filename}`,
                createdAt: pred.createdAt,
                patientName: pred.userId ? `${pred.userId.firstName} ${pred.userId.lastName}` : 'Unknown',
                patientEmail: pred.userId ? pred.userId.email : 'Unknown'
            }))
        });
    } catch (error) {
        console.error('Error fetching prediction history:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching prediction history',
            error: error.message
        });
    }
};

// Get dashboard statistics for a user
exports.getDashboardStats = async (req, res) => {
    try {
        const User = require('../models/User');
        const currentUser = await User.findById(req.user.id);
        const userId = req.user.id;

        let stats, recentActivity;

        if (currentUser.role === 'doctor') {
            // Doctor dashboard - show stats for all assigned patients
            const patientIds = currentUser.patients;

            // Get total scans count for all patients
            const totalScans = await Prediction.countDocuments({ userId: { $in: patientIds } });

            // Get normal cases count
            const normalCases = await Prediction.countDocuments({
                userId: { $in: patientIds },
                result: 'Normal'
            });

            // Get abnormal cases count
            const abnormalCases = await Prediction.countDocuments({
                userId: { $in: patientIds },
                result: 'Abnormal'
            });

            // Calculate accuracy rate
            const accuracyRate = totalScans > 0 ?
                Math.round(((normalCases + abnormalCases) / totalScans) * 100) : 0;

            // Get recent activity for all patients
            recentActivity = await Prediction.find({ userId: { $in: patientIds } })
                .sort({ createdAt: -1 })
                .limit(10)
                .populate('imageId')
                .populate('userId', 'firstName lastName email')
                .select('result confidence createdAt imageId userId');

            stats = {
                totalScans,
                normalCases,
                abnormalCases,
                accuracyRate,
                totalPatients: patientIds.length
            };
        } else {
            // Patient dashboard - show only their own stats
            const totalScans = await Prediction.countDocuments({ userId });

            const normalCases = await Prediction.countDocuments({
                userId,
                result: 'Normal'
            });

            const abnormalCases = await Prediction.countDocuments({
                userId,
                result: 'Abnormal'
            });

            const accuracyRate = totalScans > 0 ?
                Math.round(((normalCases + abnormalCases) / totalScans) * 100) : 0;

            recentActivity = await Prediction.find({ userId })
                .sort({ createdAt: -1 })
                .limit(5)
                .populate('imageId')
                .select('result confidence createdAt imageId');

            stats = {
                totalScans,
                normalCases,
                abnormalCases,
                accuracyRate
            };
        }

        res.json({
            success: true,
            stats,
            recentActivity: recentActivity.map(activity => ({
                id: activity._id,
                patientId: `PAT-${activity._id.toString().slice(-6).toUpperCase()}`,
                time: new Date(activity.createdAt).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                }),
                result: activity.result,
                confidence: Math.round(activity.confidence * 100) / 100,
                patientName: activity.userId ? `${activity.userId.firstName} ${activity.userId.lastName}` : 'Unknown'
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

exports.predictImage = async (req, res) => {
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

        // Get prediction from ONNX model
        console.log('Getting prediction from model...');
        const { prediction, confidence, probabilities } = await predictor.predict(imageBuffer);

        // Map the model's output to our schema requirements
        const result = prediction === 'non-nodule' ? 'Normal' : 'Abnormal';
        const category = prediction; // Store original prediction as category
        console.log('Prediction result:', { prediction, confidence, probabilities });

        // Move the file to the appropriate directory
        const destinationDir = path.join(__dirname, '..', 'uploads', prediction);
        fs.mkdirSync(destinationDir, { recursive: true });

        // Generate unique filename
        const timestamp = Date.now();
        const filename = `${timestamp}_${req.file.originalname}`;
        const uploadPath = path.join(destinationDir, filename);

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
            category: prediction
        });

        console.log('Saving to database...');
        const savedImage = await image.save();

        // Create and save prediction record
        const predictionDoc = await Prediction.create({
            userId: req.user.id,
            imageId: savedImage._id,
            result: prediction === 'non-nodule' ? 'Normal' : 'Abnormal', // Map to schema enum
            confidence: confidence,
            probabilities: probabilities,
            category: prediction // Original prediction value
        });

        res.json({
            success: true,
            prediction: {
                id: predictionDoc._id,
                result: predictionDoc.result,
                confidence: confidence,
                probabilities: probabilities,
                category: prediction,
                imageUrl: `/uploads/${prediction}/${filename}`
            }
        });
    } catch (error) {
        console.error('Prediction error:', error);
        // Clean up temp file if it exists
        if (req.file && req.file.path && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({
            success: false,
            message: 'Error processing prediction',
            error: error.message
        });
    }
};
