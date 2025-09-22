const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { uploadImage, getImage } = require('../controllers/uploadController');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', 'uploads', 'temp')); // Temporary storage before prediction
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/dicom'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
});

// Routes
router.post('/upload', upload.single('image'), uploadImage);
router.get('/image/:type/:category/:filename', getImage);

module.exports = router;
