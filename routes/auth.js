const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', authController.register);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', authController.login);

// @route   GET api/auth/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, authController.getCurrentUser);

// @route   GET api/auth/me
// @desc    Get current user (alias for profile)
// @access  Private
router.get('/me', auth, authController.getCurrentUser);

// @route   PUT api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, authController.updateProfile);

// @route   GET api/auth/patients
// @desc    Get patients for a doctor
// @access  Private (Doctor only)
router.get('/patients', auth, authController.getPatients);

// @route   POST api/auth/assign-patient
// @desc    Assign patient to doctor
// @access  Private (Doctor only)
router.post('/assign-patient', auth, authController.assignPatient);

// @route   POST api/auth/unassign-patient
// @desc    Unassign patient from doctor
// @access  Private (Doctor/Admin only)
router.post('/unassign-patient', auth, authController.unassignPatient);

// @route   GET api/auth/users
// @desc    Get all users (for doctors to see unassigned patients)
// @access  Private (Doctor/Admin only)
router.get('/users', auth, authController.getAllUsersForAssignment);

// Admin routes
// @route   GET api/auth/admin/users
// @desc    Get all users (Admin only)
// @access  Private (Admin only)
router.get('/admin/users', auth, authController.getAllUsers);

// @route   POST api/auth/admin/users
// @desc    Create user (Admin only)
// @access  Private (Admin only)
router.post('/admin/users', auth, authController.createUser);

// @route   PUT api/auth/admin/users/:id
// @desc    Update user (Admin only)
// @access  Private (Admin only)
router.put('/admin/users/:id', auth, authController.updateUser);

// @route   DELETE api/auth/admin/users/:id
// @desc    Delete user (Admin only)
// @access  Private (Admin only)
router.delete('/admin/users/:id', auth, authController.deleteUser);

module.exports = router;