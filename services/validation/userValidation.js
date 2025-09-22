// userValidation.js - Following Single Responsibility Principle
const Joi = require('joi');

class UserValidationService {
    constructor() {
        this.registerSchema = Joi.object({
            firstName: Joi.string()
                .min(2)
                .max(50)
                .pattern(/^[a-zA-Z0-9\s]*$/)
                .required()
                .trim()
                .messages({
                    'string.min': 'First name must be at least 2 characters long',
                    'string.max': 'First name cannot exceed 50 characters',
                    'string.pattern.base': 'First name can only contain letters, numbers and spaces',
                    'any.required': 'First name is required',
                    'string.empty': 'First name cannot be empty'
                }),

            lastName: Joi.string()
                .min(2)
                .max(50)
                .pattern(/^[a-zA-Z0-9\s]*$/)
                .required()
                .trim()
                .messages({
                    'string.min': 'Last name must be at least 2 characters long',
                    'string.max': 'Last name cannot exceed 50 characters',
                    'string.pattern.base': 'Last name can only contain letters, numbers and spaces',
                    'any.required': 'Last name is required',
                    'string.empty': 'Last name cannot be empty'
                }),

            username: Joi.string()
                .min(3)
                .max(30)
                .pattern(/^[a-zA-Z0-9_\s]*$/)
                .required()
                .trim()
                .messages({
                    'string.pattern.base': 'Username can only contain letters, numbers, spaces and underscores',
                    'string.min': 'Username must be at least 3 characters long',
                    'string.max': 'Username cannot exceed 30 characters',
                    'any.required': 'Username is required',
                    'string.empty': 'Username cannot be empty'
                }),

            email: Joi.string()
                .email()
                .required()
                .messages({
                    'string.email': 'Please enter a valid email address',
                    'any.required': 'Email is required'
                }),

            password: Joi.string()
                .required()
                .custom((value, helpers) => {
                    if (value.length < 8) {
                        return helpers.error('password.minLength');
                    }
                    if (!/[A-Z]/.test(value)) {
                        return helpers.error('password.uppercase');
                    }
                    if (!/[a-z]/.test(value)) {
                        return helpers.error('password.lowercase');
                    }
                    if (!/[0-9]/.test(value)) {
                        return helpers.error('password.number');
                    }
                    if (!/[!@#$%^&*]/.test(value)) {
                        return helpers.error('password.special');
                    }
                    return value;
                })
                .messages({
                    'password.minLength': 'Password must be at least 8 characters long',
                    'password.uppercase': 'Password must contain at least one uppercase letter',
                    'password.lowercase': 'Password must contain at least one lowercase letter',
                    'password.number': 'Password must contain at least one number',
                    'password.special': 'Password must contain at least one special character (!@#$%^&*)',
                    'any.required': 'Password is required'
                }),

            profilePicture: Joi.string().optional(),

            role: Joi.string()
                .valid('patient', 'doctor', 'admin')
                .default('patient')
                .messages({
                    'any.only': 'Role must be either patient, doctor, or admin'
                }),

            hospitalInfo: Joi.object({
                hospitalName: Joi.string().max(100).optional().allow(''),
                hospitalAddress: Joi.string().max(200).optional().allow('')
            }).optional(),

            doctorInfo: Joi.object({
                specialization: Joi.string().max(100).optional().allow(''),
                registrationNumber: Joi.string().max(50).optional().allow(''),
                licenseExpiry: Joi.date().optional().allow(''),
                department: Joi.string().max(100).optional().allow(''),
                shift: Joi.string().max(50).optional().allow(''),
                certifications: Joi.string().max(500).optional().allow('')
            }).optional(),

            patientInfo: Joi.object({
                dateOfBirth: Joi.date().optional().allow(''),
                medicalHistory: Joi.string().max(1000).optional().allow(''),
                emergencyContact: Joi.string().max(100).optional().allow(''),
                bloodType: Joi.string().max(10).optional().allow('')
            }).optional()
        });

        this.loginSchema = Joi.object({
            email: Joi.string()
                .email()
                .required()
                .messages({
                    'string.email': 'Please enter a valid email address',
                    'any.required': 'Email is required'
                }),
            password: Joi.string()
                .required()
                .messages({
                    'any.required': 'Password is required'
                })
        });
    }

    validateRegistration(data) {
        return this.registerSchema.validate(data, { abortEarly: false });
    }

    validateLogin(data) {
        return this.loginSchema.validate(data, { abortEarly: false });
    }
}

module.exports = new UserValidationService();