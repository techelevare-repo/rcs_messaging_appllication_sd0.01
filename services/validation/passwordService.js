// passwordService.js - Following Interface Segregation Principle
class PasswordValidationService {
    validatePassword(password) {
        const validations = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*]/.test(password)
        };

        const errors = [];
        
        if (!validations.length) {
            errors.push('Password must be at least 8 characters long');
        }
        if (!validations.uppercase) {
            errors.push('Password must contain at least one uppercase letter');
        }
        if (!validations.lowercase) {
            errors.push('Password must contain at least one lowercase letter');
        }
        if (!validations.number) {
            errors.push('Password must contain at least one number');
        }
        if (!validations.special) {
            errors.push('Password must contain at least one special character');
        }

        return {
            isValid: errors.length === 0,
            validations,
            errors
        };
    }

    getValidationStatus(password) {
        return {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*]/.test(password)
        };
    }
}

module.exports = new PasswordValidationService();