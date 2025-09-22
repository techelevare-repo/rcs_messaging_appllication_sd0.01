const ort = require('onnxruntime-node');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

class ImagePredictor {
    constructor() {
        this.session = null;
        this.initialized = false;
        // Get absolute path to the model
        this.modelPath = path.resolve(__dirname, './__MODEL_PROTO.onnx');
        
        // Use basic session options
        this.sessionOptions = { 
            executionProviders: ['cpu'] 
        };

        // Initialize the model when the instance is created
        this.initialize().catch(error => {
            console.error('Failed to initialize model:', error);
        });
    }

    async initialize() {
        try {
            console.log('Loading ONNX model...');
            // Create ONNX Runtime session with options
            this.session = await ort.InferenceSession.create(this.modelPath, this.sessionOptions);
            this.initialized = true;
            console.log('ONNX model loaded successfully');
        } catch (error) {
            console.error('Error initializing ONNX model:', error);
            throw error;
        }
    }

    async preprocessImage(imageBuffer) {
        try {
            const processedImageBuffer = await sharp(imageBuffer)
                .resize(224, 224, { fit: 'fill' })
                .removeAlpha()
                .raw()
                .toBuffer();

            const float32Data = new Float32Array(processedImageBuffer.length);
            for (let i = 0; i < processedImageBuffer.length; i++) {
                float32Data[i] = processedImageBuffer[i] / 255.0;
            }
            
            return new ort.Tensor('float32', float32Data, [1, 224, 224, 3]);
        } catch (error) {
            console.error('Error preprocessing image:', error);
            throw error;
        }
    }

    async predict(imageBuffer) {
        try {
            if (!this.initialized) {
                await this.initialize();
            }

            const inputTensor = await this.preprocessImage(imageBuffer);
            const inputName = this.session.inputNames[0];
            const feeds = {};
            feeds[inputName] = inputTensor;

            const outputData = await this.session.run(feeds);
            const outputName = this.session.outputNames[0];
            const predictions = outputData[outputName].data;
            
            const classNames = ['benign', 'malignant', 'non-nodule'];
            const predictedClass = classNames[predictions.indexOf(Math.max(...predictions))];
            const confidence = Math.max(...predictions);

            return {
                prediction: predictedClass,
                confidence: confidence,
                probabilities: Array.from(predictions)
            };
        } catch (error) {
            console.error('Error during prediction:', error);
            throw error;
        }
    }
}

// Create a singleton instance
const predictor = new ImagePredictor();

// Export the singleton instance instead of the class
module.exports = predictor;