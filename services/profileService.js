const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

class ProfileService {
    constructor() {
        this.uploadDir = 'uploads/profiles';
        this.storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, this.uploadDir);
            },
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                cb(null, `${req.user.id}-${uniqueSuffix}${path.extname(file.originalname)}`);
            }
        });

        this.fileFilter = (req, file, cb) => {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            if (!allowedTypes.includes(file.mimetype)) {
                cb(new Error('Invalid file type. Only JPEG and PNG are allowed.'), false);
            }
            cb(null, true);
        };

        this.upload = multer({
            storage: this.storage,
            fileFilter: this.fileFilter,
            limits: {
                fileSize: 5 * 1024 * 1024 // 5MB limit
            }
        });
    }

    async updateProfilePicture(userId, file) {
        try {
            // Get user's current profile picture
            const user = await User.findById(userId);
            if (user.profilePicture) {
                // Delete old profile picture
                try {
                    await fs.unlink(path.join(this.uploadDir, user.profilePicture));
                } catch (error) {
                    console.warn('Failed to delete old profile picture:', error);
                }
            }

            // Update user's profile picture path
            user.profilePicture = file.filename;
            await user.save();

            return {
                success: true,
                profilePicture: `/profiles/${file.filename}`
            };
        } catch (error) {
            throw new Error('Failed to update profile picture: ' + error.message);
        }
    }

    async deleteProfilePicture(userId) {
        try {
            const user = await User.findById(userId);
            if (user.profilePicture) {
                await fs.unlink(path.join(this.uploadDir, user.profilePicture));
                user.profilePicture = null;
                await user.save();
            }
            return { success: true };
        } catch (error) {
            throw new Error('Failed to delete profile picture: ' + error.message);
        }
    }

    getUploadMiddleware() {
        return this.upload.single('profilePicture');
    }
}

module.exports = new ProfileService();