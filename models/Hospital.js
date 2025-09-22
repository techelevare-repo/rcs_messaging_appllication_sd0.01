const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    address: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    city: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    state: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    country: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true,
        match: /^[0-9+\-\s()]+$/
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/
    },
    licenseNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field before saving
hospitalSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Hospital', hospitalSchema);
