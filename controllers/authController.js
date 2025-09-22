const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const userValidation = require('../services/validation/userValidation');
const passwordService = require('../services/validation/passwordService');

class AuthController {
    async register(req, res) {
        try {
            const { firstName, lastName, username, email, password, role, hospitalInfo, doctorInfo, patientInfo } = req.body;

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

            // Validate request body
            const { error } = userValidation.validateRegistration(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    errors: error.details.map(detail => ({
                        field: detail.path[0],
                        message: detail.message
                    }))
                });
            }

            // Validate password strength
            const passwordValidation = passwordService.validatePassword(password);
            if (!passwordValidation.isValid) {
                return res.status(400).json({
                    success: false,
                    message: 'Password validation failed',
                    errors: passwordValidation.errors
                });
            }

            // Check if user already exists
            const existingUser = await User.findOne({
                $or: [
                    { email: req.body.email },
                    { username: req.body.username }
                ]
            });

            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: existingUser.email === req.body.email
                        ? 'Email already registered'
                        : 'Username already taken'
                });
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);

            // Create new user
            const user = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword,
                profilePicture: req.body.profilePicture,
                role: role || 'patient',
                hospitalInfo: hospitalInfo || {},
                doctorInfo: doctorInfo || {},
                patientInfo: patientInfo || {}
            });

            await user.save();

            // Generate JWT token
            const token = jwt.sign(
                { id: user._id },
                process.env.JWT_SECRET,
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
            // Validate login data
            const { error } = userValidation.validateLogin(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    errors: error.details.map(detail => ({
                        field: detail.path[0],
                        message: detail.message
                    }))
                });
            }

            // Find user
            const user = await User.findOne({ email: req.body.email });
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }

            // Verify password
            const validPassword = await bcrypt.compare(req.body.password, user.password);
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
                process.env.JWT_SECRET,
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

    // Get patients for a doctor
    async getPatients(req, res) {
        try {
            const doctor = await User.findById(req.user.id);
            if (!doctor || doctor.role !== 'doctor') {
                return res.status(403).json({
                    success: false,
                    message: 'Only doctors can access patient list'
                });
            }

            const patients = await User.find({
                assignedDoctor: req.user.id,
                role: 'patient'
            }).select('-password -doctorInfo');

            res.json({
                success: true,
                patients: patients.map(patient => patient.toPublicJSON())
            });

        } catch (error) {
            console.error('Get patients error:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching patients',
                error: error.message
            });
        }
    }

    // Assign patient to doctor
    async assignPatient(req, res) {
        try {
            const { patientId } = req.body;

            const doctor = await User.findById(req.user.id);
            if (!doctor || doctor.role !== 'doctor') {
                return res.status(403).json({
                    success: false,
                    message: 'Only doctors can assign patients'
                });
            }

            const patient = await User.findById(patientId);
            if (!patient || patient.role !== 'patient') {
                return res.status(404).json({
                    success: false,
                    message: 'Patient not found'
                });
            }

            // Update patient's assigned doctor
            patient.assignedDoctor = req.user.id;
            await patient.save();

            // Add patient to doctor's patients list
            if (!doctor.patients.includes(patientId)) {
                doctor.patients.push(patientId);
                await doctor.save();
            }

            res.json({
                success: true,
                message: 'Patient assigned successfully',
                patient: patient.toPublicJSON()
            });

        } catch (error) {
            console.error('Assign patient error:', error);
            res.status(500).json({
                success: false,
                message: 'Error assigning patient',
                error: error.message
            });
        }
    }

    // Update user profile
    async updateProfile(req, res) {
        try {
            const { hospitalInfo, doctorInfo, patientInfo, ...otherFields } = req.body;

            const updateData = { ...otherFields };
            if (hospitalInfo) updateData.hospitalInfo = hospitalInfo;
            if (doctorInfo) updateData.doctorInfo = doctorInfo;
            if (patientInfo) updateData.patientInfo = patientInfo;

            const user = await User.findByIdAndUpdate(
                req.user.id,
                updateData,
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
                message: 'Profile updated successfully',
                user: user.toPublicJSON()
            });

        } catch (error) {
            console.error('Update profile error:', error);
            res.status(500).json({
                success: false,
                message: 'Error updating profile',
                error: error.message
            });
        }
    }

    // Get all users for assignment (doctors can see unassigned patients)
    async getAllUsersForAssignment(req, res) {
        try {
            const currentUser = await User.findById(req.user.id);
            if (!currentUser || (currentUser.role !== 'doctor' && currentUser.role !== 'admin')) {
                return res.status(403).json({
                    success: false,
                    message: 'Doctor or Admin access required'
                });
            }

            const users = await User.find({ role: 'patient' }).select('-password').populate('assignedDoctor', 'firstName lastName email');
            res.json({
                success: true,
                users: users.map(user => user.toPublicJSON())
            });

        } catch (error) {
            console.error('Get users for assignment error:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching users',
                error: error.message
            });
        }
    }

    // Unassign patient from doctor
    async unassignPatient(req, res) {
        try {
            const { patientId } = req.body;
            const currentUser = await User.findById(req.user.id);

            // Check if user is doctor or admin
            if (!currentUser || (currentUser.role !== 'doctor' && currentUser.role !== 'admin')) {
                return res.status(403).json({
                    success: false,
                    message: 'Doctor or Admin access required'
                });
            }

            const patient = await User.findById(patientId);
            if (!patient || patient.role !== 'patient') {
                return res.status(404).json({
                    success: false,
                    message: 'Patient not found'
                });
            }

            // If doctor is trying to unassign, check if patient is assigned to them
            if (currentUser.role === 'doctor' && patient.assignedDoctor.toString() !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: 'You can only unassign patients assigned to you'
                });
            }

            // Remove patient from doctor's patients list
            const doctor = await User.findById(patient.assignedDoctor);
            if (doctor) {
                doctor.patients = doctor.patients.filter(id => id.toString() !== patientId);
                await doctor.save();
            }

            // Remove assigned doctor from patient
            patient.assignedDoctor = null;
            await patient.save();

            res.json({
                success: true,
                message: 'Patient unassigned successfully',
                patient: patient.toPublicJSON()
            });

        } catch (error) {
            console.error('Unassign patient error:', error);
            res.status(500).json({
                success: false,
                message: 'Error unassigning patient',
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

            const users = await User.find({}).select('-password').populate('assignedDoctor', 'firstName lastName email');
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

            const { firstName, lastName, username, email, password, role, hospitalInfo, doctorInfo, patientInfo } = req.body;

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
                role: role || 'patient',
                hospitalInfo: hospitalInfo || {},
                doctorInfo: doctorInfo || {},
                patientInfo: patientInfo || {}
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

            const { hospitalInfo, doctorInfo, patientInfo, ...otherFields } = req.body;

            const updateData = { ...otherFields };
            if (hospitalInfo) updateData.hospitalInfo = hospitalInfo;
            if (doctorInfo) updateData.doctorInfo = doctorInfo;
            if (patientInfo) updateData.patientInfo = patientInfo;

            const user = await User.findByIdAndUpdate(
                req.params.id,
                updateData,
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
