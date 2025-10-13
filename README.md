# Vision Backend - License Plate Detection

This is the backend server for the Multi-Model Computer Vision Application, specifically implementing license plate detection using ONNX models.

## Features

- **License Plate Detection**: Uses ONNX model for detecting and recognizing license plates
- **User Authentication**: JWT-based authentication with admin and user roles
- **Image Upload**: Handles image uploads for processing
- **Detection History**: Stores and retrieves detection results
- **Dashboard Statistics**: Provides analytics for users

## Setup

1. **Install Dependencies**
   ```bash
   cd vision-backend
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file with:
   ```
   NODE_ENV=development
   PORT=5001
   MONGODB_URI=mongodb://localhost:27017/vision-app
   JWT_SECRET=vision-app-super-secret-key-2024
   ```

3. **Start MongoDB**
   Make sure MongoDB is running on your system.

4. **Run the Server**
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Vision Processing
- `POST /api/vision/license-plate` - Detect license plate in image (requires auth)
- `GET /api/vision/history` - Get detection history (requires auth)
- `GET /api/vision/stats` - Get dashboard statistics (requires auth)

### File Upload
- `POST /api/upload/image` - Upload image file

## Model Integration

The license plate detection uses the `license_plate_detection_model.onnx` file. The model:
- Accepts images of size 640x640
- Returns bounding boxes for detected license plates
- Includes OCR processing for text extraction

## Database Schema

### User Model
- Basic user information with admin/user roles
- JWT authentication support

### Detection Model
- Stores detection results with bounding boxes
- Links to uploaded images
- Includes confidence scores and processing time

### Image Model
- Stores uploaded image metadata
- Links to detection results

## Next Steps

This backend is designed to be extensible for additional vision models:
- Lane Detection
- Emotion, Age & Gender Detection
- Object Tracking
- Traffic Sign Detection
- Deepfake Detection
- Hand Gesture Recognition

Each model can be added as a new service and controller following the same pattern.

