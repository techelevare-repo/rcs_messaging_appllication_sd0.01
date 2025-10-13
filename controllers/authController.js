const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

class AuthController {
    async register(req, res) {
        try {
            const { firstName, lastName, username, email, password, role } = req.body;

            // Check if all required fields are present
            if (!firstName || !lastName || !username || !email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'All fields are required',
                    errors: {
                        firstName: !firstName ? 'First name is required' : undefined,
                        lastName: !lastName ? 'Last name is required' : undefined,
                        username: !username ? 'Username is required' : undefined,
                        email: !email ? 'Email is required' : undefined,
                        password: !password ? 'Password is required' : undefined
                    }
                });
            }

            // Basic validation
            if (firstName.length < 2) {
                return res.status(400).json({
                    success: false,
                    message: 'First name must be at least 2 characters long'
                });
            }

            if (lastName.length < 2) {
                return res.status(400).json({
                    success: false,
                    message: 'Last name must be at least 2 characters long'
                });
            }

            if (username.length < 3) {
                return res.status(400).json({
                    success: false,
                    message: 'Username must be at least 3 characters long'
                });
            }

            if (password.length < 8) {
                return res.status(400).json({
                    success: false,
                    message: 'Password must be at least 8 characters long'
                });
            }

            // Check if user already exists
            const existingUser = await User.findOne({
                $or: [
                    { email: email },
                    { username: username }
                ]
            });

            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: existingUser.email === email
                        ? 'Email already registered'
                        : 'Username already taken'
                });
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create new user
            const user = new User({
                firstName,
                lastName,
                username,
                email,
                password: hashedPassword,
                role: role || 'user'
            });

            await user.save();

            // Generate JWT token
            const token = jwt.sign(
                { id: user._id },
                process.env.JWT_SECRET || 'vision-app-secret-key',
                { expiresIn: '24h' }
            );

            // Return success response with user data (excluding password)
            res.status(201).json({
                success: true,
                message: 'Registration successful',
                token,
                user: user.toPublicJSON()
            });

        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({
                success: false,
                message: 'An error occurred during registration',
                error: error.message
            });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Email and password are required'
                });
            }

            // Find user
            const user = await User.findOne({ email: email });
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }

            // Verify password
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }

            // Update last login
            user.lastLogin = new Date();
            await user.save();

            // Generate token
            const token = jwt.sign(
                { id: user._id },
                process.env.JWT_SECRET || 'vision-app-secret-key',
                { expiresIn: '24h' }
            );

            // Return success response
            res.json({
                success: true,
                message: 'Login successful',
                token,
                user: user.toPublicJSON()
            });

        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                message: 'An error occurred during login',
                error: error.message
            });
        }
    }

    async getCurrentUser(req, res) {
        try {
            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            res.json({
                success: true,
                user: user.toPublicJSON()
            });

        } catch (error) {
            console.error('Get current user error:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching user data',
                error: error.message
            });
        }
    }

    // Admin methods
    async getAllUsers(req, res) {
        try {
            const currentUser = await User.findById(req.user.id);
            if (!currentUser || currentUser.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Admin access required'
                });
            }

            const users = await User.find({}).select('-password').sort({ createdAt: -1 });
            res.json({
                success: true,
                users: users.map(user => user.toPublicJSON())
            });

        } catch (error) {
            console.error('Get all users error:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching users',
                error: error.message
            });
        }
    }

    async createUser(req, res) {
        try {
            const currentUser = await User.findById(req.user.id);
            if (!currentUser || currentUser.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Admin access required'
                });
            }

            const { firstName, lastName, username, email, password, role } = req.body;

            // Check if user already exists
            const existingUser = await User.findOne({
                $or: [
                    { email: email },
                    { username: username }
                ]
            });

            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: existingUser.email === email
                        ? 'Email already registered'
                        : 'Username already taken'
                });
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create new user
            const user = new User({
                firstName,
                lastName,
                username,
                email,
                password: hashedPassword,
                role: role || 'user'
            });

            await user.save();

            res.status(201).json({
                success: true,
                message: 'User created successfully',
                user: user.toPublicJSON()
            });

        } catch (error) {
            console.error('Create user error:', error);
            res.status(500).json({
                success: false,
                message: 'Error creating user',
                error: error.message
            });
        }
    }

    async updateUser(req, res) {
        try {
            const currentUser = await User.findById(req.user.id);
            if (!currentUser || currentUser.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Admin access required'
                });
            }

            const { firstName, lastName, username, email, role } = req.body;

            const user = await User.findByIdAndUpdate(
                req.params.id,
                { firstName, lastName, username, email, role },
                { new: true, runValidators: true }
            );

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            res.json({
                success: true,
                message: 'User updated successfully',
                user: user.toPublicJSON()
            });

        } catch (error) {
            console.error('Update user error:', error);
            res.status(500).json({
                success: false,
                message: 'Error updating user',
                error: error.message
            });
        }
    }

    async deleteUser(req, res) {
        try {
            const currentUser = await User.findById(req.user.id);
            if (!currentUser || currentUser.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Admin access required'
                });
            }

            // Prevent admin from deleting themselves
            if (currentUser._id.toString() === req.params.id) {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot delete your own account'
                });
            }

            const user = await User.findByIdAndDelete(req.params.id);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            res.json({
                success: true,
                message: 'User deleted successfully'
            });

        } catch (error) {
            console.error('Delete user error:', error);
            res.status(500).json({
                success: false,
                message: 'Error deleting user',
                error: error.message
            });
        }
    }
}

module.exports = new AuthController();
