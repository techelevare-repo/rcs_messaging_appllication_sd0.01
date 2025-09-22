const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Feedback = require('../models/Feedback');
const Prediction = require('../models/Prediction');

// @route   POST api/feedback
// @desc    Submit feedback for a prediction
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { predictionId, feedback, comment } = req.body;

    // Check if prediction exists
    const prediction = await Prediction.findById(predictionId);
    if (!prediction) {
      return res.status(404).json({ msg: 'Prediction not found' });
    }

    // Create feedback
    const newFeedback = new Feedback({
      predictionId,
      userId: req.user.id,
      feedback,
      comment
    });

    await newFeedback.save();

    res.json(newFeedback);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/feedback
// @desc    Get all feedback (admin only)
// @access  Private/Admin
router.get('/', auth, async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.user.id);
    if (user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const feedback = await Feedback.find()
      .populate('predictionId')
      .populate('userId', 'username email')
      .sort({ createdAt: -1 });

    res.json(feedback);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;