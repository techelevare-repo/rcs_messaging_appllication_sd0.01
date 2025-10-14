# Multi-Model Computer Vision Application

## Enterprise AI Vision System

A unified web application that performs multiple computer-vision-based tasks in real time through a single user interface. Each model works independently when selected by the user, and all models can run together for full-screen integrated recognition.

## 🚀 Features

### 7 Vision Modules

1. **License Plate Recognition** - Detect and read vehicle license numbers using EasyOCR/YOLOv8
2. **Real-Time Lane Detection** - Identify lane boundaries for driving assistance
3. **Emotion, Age & Gender Detection** - Predict facial expression, age range, and gender
4. **Object Tracking in Videos** - Track moving objects using bounding boxes
5. **Traffic Sign Detection** - Detect and classify road signs
6. **Deepfake Detection & Generation** - Detect manipulated faces and optionally create synthetic faces
7. **Hand Gesture Recognition** - Detect and classify hand poses for controls

### Key Capabilities

- **Multi-Model Processing**: Run multiple models simultaneously
- **Real-Time Processing**: Live camera feed with real-time detection
- **File Upload Support**: Process images and videos from uploads
- **Confidence Thresholds**: Configurable confidence levels for detections
- **Results Management**: View, filter, and export detection history
- **Settings Configuration**: Customize processing parameters
- **Responsive Design**: Modern Material-UI interface

## 🏗️ Architecture

### Frontend Structure
```
src/
├── state/
│   ├── AuthContext.jsx          # User authentication
│   ├── ModelContext.jsx        # Legacy model management
│   └── VisionContext.jsx       # Multi-model vision management
├── pages/
│   ├── auth/                   # Login/Register pages
│   ├── dashboard/
│   │   ├── Home.jsx            # Dashboard overview
│   │   ├── ModelsCatalog.jsx  # Model selection interface
│   │   ├── VisionProcessing.jsx # Main processing interface
│   │   └── ResultsReports.jsx  # Results and analytics
│   └── users/
│       └── Settings.jsx        # Application settings
├── shared/
│   ├── CameraFeed.jsx          # Enhanced camera component
│   ├── FileUpload.jsx          # File upload component
│   ├── ModelSelector.jsx       # Model selection widget
│   └── ResultsDisplay.jsx      # Results visualization
└── layouts/
    └── DashboardLayout.jsx     # Main application layout
```

### Technology Stack

- **Frontend**: React 18, Material-UI 5, React Router 6
- **State Management**: React Context API
- **Build Tool**: Vite
- **Styling**: Material-UI with custom dark theme

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn
- Modern web browser with camera access

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd vision-ui
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 📱 Usage Guide

### 1. Model Selection
- Navigate to **Models Catalog** to browse available vision models
- Click **Activate Model** to add models to your active set
- Use **Activate All Models** to enable all compatible models

### 2. Vision Processing
- Go to **Vision Processing** page
- Choose between **Live Camera** or **File Upload** tabs
- Select active models from the sidebar
- Click **Start Processing** to begin detection

### 3. Results & Reports
- View detection history in **Results & Reports**
- Filter results by model, confidence, or search terms
- Export data as JSON for analysis
- Clear history when needed

### 4. Settings Configuration
- Access **Settings** to configure:
  - Confidence thresholds
  - Camera resolution
  - File upload limits
  - Processing timeouts
  - Display preferences

## 🔧 Configuration

### Model Configuration

Each model includes:
- **Library**: ML framework used (OpenCV, YOLO, DeepFace, etc.)
- **Dataset**: Training data source
- **Category**: Model classification
- **Capabilities**: Real-time vs upload-only processing

### Processing Modes

- **Live Camera**: Real-time processing from webcam
- **File Upload**: Process uploaded images/videos
- **Both**: Support for both input methods

### Confidence Thresholds

- Configurable from 10% to 100%
- Filters detections below threshold
- Real-time adjustment during processing

## 🎯 Model Details

| Model | Library | Dataset | Real-time | Upload |
|-------|---------|---------|-----------|--------|
| License Plate Recognition | EasyOCR / YOLOv8 | OpenALPR ANPR | ✅ | ✅ |
| Lane Detection | OpenCV + Canny + Hough | TuSimple Lane | ✅ | ✅ |
| Emotion/Age/Gender | DeepFace / FaceNet | UTKFace | ✅ | ✅ |
| Object Tracking | OpenCV + DeepSORT / YOLO | COCO | ❌ | ✅ |
| Traffic Sign Detection | CNN / YOLOv5 | GTSRB | ✅ | ✅ |
| Deepfake Detection | Xception / MesoNet | FaceForensics++ | ❌ | ✅ |
| Hand Gesture Recognition | MediaPipe / OpenCV | Sign Language MNIST | ✅ | ✅ |

## 🔮 Future Enhancements

### Backend Integration
- REST API endpoints for each model
- WebSocket support for real-time processing
- Model management and versioning
- User authentication and authorization

### Advanced Features
- Edge device deployment (Jetson Nano / Raspberry Pi)
- Cloud hosting with GPU acceleration
- Advanced analytics and reporting
- Model performance monitoring
- Custom model training interface

### Deployment Options
- Docker containerization
- Kubernetes orchestration
- AWS/GCP cloud deployment
- Local network deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code examples

## 🏆 Acknowledgments

- Material-UI team for the excellent component library
- React team for the powerful framework
- OpenCV and ML community for vision processing libraries
- Dataset providers for training data

---

**Multi-Model Computer Vision Application** - Enterprise AI Vision System for comprehensive computer vision processing.