const express = require('express');
const router = express.Router();
const visionController = require('../controllers/visionController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   POST /api/vision/license-plate
// @desc    Detect license plate in uploaded image
// @access  Private
router.post('/license-plate', auth, upload.single('image'), visionController.predictLicensePlate);

// @route   POST /api/vision/gesture
// @desc    Predict hand gesture from uploaded frame
// @access  Private
router.post('/gesture', auth, upload.single('image'), visionController.predictGesture);

// @route   GET /api/vision/history
// @desc    Get detection history for user
// @access  Private
router.get('/history', auth, visionController.getDetectionHistory);

// @route   GET /api/vision/stats
// @desc    Get dashboard statistics for user
// @access  Private
router.get('/stats', auth, visionController.getDashboardStats);

module.exports = router;

