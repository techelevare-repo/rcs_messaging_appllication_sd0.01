const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    originalName: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    mimetype: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    modelType: {
        type: String,
        enum: ['license-plate-recognition', 'lane-detection', 'emotion-age-gender', 'object-tracking', 'traffic-sign-detection', 'deepfake-detection', 'hand-gesture-recognition'],
        default: 'license-plate-recognition'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Image', imageSchema);

