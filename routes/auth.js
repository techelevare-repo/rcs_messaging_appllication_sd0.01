const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', authController.register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', authController.login);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, authController.getCurrentUser);

// Admin routes
// @route   GET /api/auth/admin/users
// @desc    Get all users (admin only)
// @access  Private (Admin)
router.get('/admin/users', auth, authController.getAllUsers);

// @route   POST /api/auth/admin/users
// @desc    Create a new user (admin only)
// @access  Private (Admin)
router.post('/admin/users', auth, authController.createUser);

// @route   PUT /api/auth/admin/users/:id
// @desc    Update a user (admin only)
// @access  Private (Admin)
router.put('/admin/users/:id', auth, authController.updateUser);

// @route   DELETE /api/auth/admin/users/:id
// @desc    Delete a user (admin only)
// @access  Private (Admin)
router.delete('/admin/users/:id', auth, authController.deleteUser);

module.exports = router;

