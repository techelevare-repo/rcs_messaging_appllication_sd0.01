const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const predictController = require('../controllers/predictController');

/**
 * @route   POST api/predict
 * @desc    Upload image and get prediction
 * @access  Private
 */
router.post('/', auth, upload, predictController.predictImage);

/**
 * @route   GET api/predict/history
 * @desc    Get prediction history for user
 * @access  Private
 */
router.get('/history', auth, predictController.getPredictionHistory);

/**
 * @route   GET api/predict/:id
 * @desc    Get a specific prediction
 * @access  Private
 */
router.get('/:id', auth, predictController.getPrediction);

/**
 * @route   GET api/predict/dashboard/stats
 * @desc    Get dashboard statistics for user
 * @access  Private
 */
router.get('/dashboard/stats', auth, predictController.getDashboardStats);

module.exports = router;