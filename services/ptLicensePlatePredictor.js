const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

class PTLicensePlatePredictor {
    constructor() {
        this.modelPath = path.resolve(__dirname, '../license_plate_detection_model.pt');
        this.pythonScriptPath = path.resolve(__dirname, 'ptModelService.py');
        this.initialized = false;


        // Check if model file exists
        if (!fs.existsSync(this.modelPath)) {
            console.error(`PyTorch model file not found at: ${this.modelPath}`);
            throw new Error('PyTorch model file not found');
        }

        // Check if Python script exists
        if (!fs.existsSync(this.pythonScriptPath)) {
            console.error(`Python script not found at: ${this.pythonScriptPath}`);
            throw new Error('Python script not found');
        }

        this.initialized = true;
        console.log('PT License Plate Predictor initialized successfully');
    }

    async predict(imageBuffer) {
        try {
            if (!this.initialized) {
                throw new Error('PT License Plate Predictor not initialized');
            }

            const startTime = Date.now();

            // Convert image buffer to base64
            const base64Image = imageBuffer.toString('base64');

            // Run Python script
            const result = await this.runPythonPrediction(base64Image);

            const processingTime = Date.now() - startTime;

            // Add processing time to result
            result.processingTime = processingTime;

            return result;

        } catch (error) {
            console.error('Error during PT license plate prediction:', error);
            throw error;
        }
    }

    async runPythonPrediction(imageData) {
        return new Promise((resolve, reject) => {
            // Create a temporary file for the image data
            const tempImagePath = path.join(__dirname, '..', 'uploads', 'temp', `temp_${Date.now()}.jpg`);

            // Ensure temp directory exists
            const tempDir = path.dirname(tempImagePath);
            if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir, { recursive: true });
            }

            // Write image data to temporary file
            fs.writeFileSync(tempImagePath, Buffer.from(imageData, 'base64'));

            // Run Python script
            const python = spawn('python', [
                this.pythonScriptPath,
                this.modelPath,
                tempImagePath
            ]);

            let output = '';
            let error = '';

            python.stdout.on('data', (data) => {
                output += data.toString();
            });

            python.stderr.on('data', (data) => {
                error += data.toString();
            });

            python.on('close', (code) => {
                // Clean up temporary file
                try {
                    if (fs.existsSync(tempImagePath)) {
                        fs.unlinkSync(tempImagePath);
                    }
                } catch (cleanupError) {
                    console.warn('Error cleaning up temporary file:', cleanupError);
                }

                if (code === 0) {
                    try {
                        const result = JSON.parse(output);
                        resolve(result);
                    } catch (parseError) {
                        console.error('Error parsing Python output:', parseError);
                        console.error('Python output:', output);
                        reject(new Error('Failed to parse Python output'));
                    }
                } else {
                    console.error('Python script error:', error);
                    reject(new Error(`Python script failed with code ${code}: ${error}`));
                }
            });

            python.on('error', (err) => {
                console.error('Error spawning Python process:', err);
                reject(err);
            });
        });
    }

    async testModel() {
        try {
            console.log('Testing PT model...');

            // Test with dataset-cover.jpg
            const testImagePath = path.resolve(__dirname, '../../dataset-cover.jpg');

            if (!fs.existsSync(testImagePath)) {
                throw new Error('Test image not found');
            }

            const imageBuffer = fs.readFileSync(testImagePath);
            const result = await this.predict(imageBuffer);

            console.log('PT Model Test Results:');
            console.log('====================');
            console.log('Prediction:', result.prediction);
            console.log('Confidence:', (result.confidence * 100).toFixed(2) + '%');
            console.log('License Plate Text:', result.licensePlateText);
            console.log('Processing Time:', result.processingTime + 'ms');

            if (result.boundingBoxes && result.boundingBoxes.length > 0) {
                console.log('\nBounding Boxes:');
                result.boundingBoxes.forEach((box, index) => {
                    console.log(`  Box ${index + 1}:`);
                    console.log(`    Position: (${box.x}, ${box.y})`);
                    console.log(`    Size: ${box.width} x ${box.height}`);
                    console.log(`    Confidence: ${(box.confidence * 100).toFixed(2)}%`);
                });
            }

            return result;
        } catch (error) {
            console.error('Error testing PT model:', error);
            throw error;
        }
    }
}

// Create a singleton instance
const ptLicensePlatePredictor = new PTLicensePlatePredictor();

// Export the singleton instance
module.exports = ptLicensePlatePredictor;
