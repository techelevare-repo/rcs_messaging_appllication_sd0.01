const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  predictionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Prediction', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  feedback: { type: String, enum: ['correct', 'incorrect'], required: true },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feedback', feedbackSchema);