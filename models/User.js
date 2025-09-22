const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
    match: /^[a-zA-Z0-9]+$/
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/
  },
  password: {
    type: String,
    required: true
  },
  profilePicture: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: ['patient', 'doctor', 'admin'],
    default: 'patient'
  },
  // Doctor-specific fields
  doctorInfo: {
    specialization: { type: String },
    registrationNumber: { type: String },
    licenseExpiry: { type: Date },
    department: { type: String },
    shift: { type: String },
    certifications: { type: String }
  },
  // Hospital information
  hospitalInfo: {
    hospitalName: { type: String },
    hospitalAddress: { type: String },
    hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' }
  },
  // Patient-specific fields
  patientInfo: {
    dateOfBirth: { type: Date },
    medicalHistory: { type: String },
    emergencyContact: { type: String },
    bloodType: { type: String }
  },
  // Doctor-patient relationship
  assignedDoctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  patients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light'
    },
    emailNotifications: {
      type: Boolean,
      default: false
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: null
  }
});

// Add any instance methods here
userSchema.methods.toPublicJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);