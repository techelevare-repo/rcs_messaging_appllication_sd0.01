const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  imageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Image', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  result: { type: String, enum: ['Normal', 'Abnormal'], required: true },
  confidence: { type: Number, required: true },
  category: { type: String, enum: ['benign', 'malignant', 'non-nodule'] },
  gradcamUrl: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Prediction', predictionSchema);