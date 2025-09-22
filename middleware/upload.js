const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function(req, file, cb) {
    // Generate a unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, uniqueSuffix + ext);
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  
  if (allowedTypes.includes(file.mimetype)) {
    console.log('File accepted:', file.originalname);
    cb(null, true);
  } else {
    console.error('File type error: Invalid type', file.mimetype);
    cb(new Error('Invalid file type. Only JPEG and PNG images are allowed.'), false);
  }
};

// Create multer instance with configuration
const uploadMiddleware = multer({
  storage: multer.diskStorage({
    destination: function(req, file, cb) {
      console.log('Processing file in destination:', file);
      cb(null, uploadsDir);
    },
    filename: function(req, file, cb) {
      console.log('Processing file in filename:', file);
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  }),
  fileFilter: (req, file, cb) => {
    console.log('File filter processing:', file);
    // Accept all files during testing
    cb(null, true);
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1
  }
});

// Create single file upload middleware
const upload = uploadMiddleware.single('xray');

// Export middleware with error handling
module.exports = (req, res, next) => {
  console.log('Upload middleware: Starting file upload');
  console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);

  // Debug incoming request
  if (!req.headers['content-type']?.includes('multipart/form-data')) {
    return res.status(400).json({
      success: false,
      message: 'Content-Type must be multipart/form-data'
    });
  }

  // Log the raw request
  let rawData = '';
  req.on('data', chunk => {
    rawData += chunk;
    console.log('Received chunk:', chunk.toString());
  });

  req.on('end', () => {
    console.log('Full raw request:', rawData);
  });

  upload(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      console.error('Multer error:', err);
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'File is too large. Maximum size is 10MB'
        });
      }
      return res.status(400).json({
        success: false,
        message: `Upload error: ${err.message}`
      });
    } else if (err) {
      console.error('Unknown upload error:', err);
      return res.status(400).json({
        success: false,
        message: err.message || 'File upload failed'
      });
    }
    
    if (!req.file) {
      console.error('No file in request');
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }
    
    console.log('File upload successful:', {
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size
    });
    
    next();
  });
};