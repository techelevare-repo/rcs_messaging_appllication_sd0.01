const mongoose = require('mongoose');

const detectionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    modelType: {
        type: String,
        enum: ['license-plate-recognition', 'lane-detection', 'emotion-age-gender', 'object-tracking', 'traffic-sign-detection', 'deepfake-detection', 'hand-gesture-recognition'],
        required: true
    },
    imageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image',
        required: true
    },
    result: {
        type: String,
        required: true
    },
    confidence: {
        type: Number,
        required: true,
        min: 0,
        max: 1
    },
    boundingBoxes: [{
        x: Number,
        y: Number,
        width: Number,
        height: Number,
        label: String,
        confidence: Number
    }],
    additionalData: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    processingTime: {
        type: Number, // in milliseconds
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Detection', detectionSchema);

