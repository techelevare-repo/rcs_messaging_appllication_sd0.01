const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

class GesturePredictorPersistent {
    constructor() {
        this.modelPath = path.resolve(__dirname, '../model.keras');
        this.labelEncoderPath = path.resolve(__dirname, '../label_encoder.pkl');
        this.pythonScriptPath = path.resolve(__dirname, 'gestureWorker.py');
        this.tfPythonPath = path.resolve(__dirname, '..', '..', 'tf', 'Scripts', 'python.exe');
        this.initialized = false;
        this.pythonProcess = null;
        this.processQueue = [];
        this.isProcessing = false;

        if (!fs.existsSync(this.modelPath)) {
            console.error(`Gesture model file not found at: ${this.modelPath}`);
            throw new Error('Gesture model file not found');
        }
        if (!fs.existsSync(this.labelEncoderPath)) {
            console.error(`Label encoder file not found at: ${this.labelEncoderPath}`);
            throw new Error('Label encoder file not found');
        }
        if (!fs.existsSync(this.pythonScriptPath)) {
            console.error(`Gesture Python script not found at: ${this.pythonScriptPath}`);
            throw new Error('Gesture Python script not found');
        }

        this.initialized = true;
        console.log('Gesture Predictor Persistent initialized successfully');
        // Start worker immediately so model loads at boot
        this.startWorker().catch(() => { });
    }

    async predict(imageBuffer) {
        if (!this.initialized) {
            throw new Error('Gesture Predictor not initialized');
        }

        const startTime = Date.now();
        const base64Image = imageBuffer.toString('base64');

        // For now, use the simple approach but with better error handling
        const result = await this.runPythonPrediction(base64Image);
        result.processingTime = Date.now() - startTime;
        return result;
    }

    async startWorker() {
        if (this.pythonProcess) return;
        this.pythonProcess = spawn(this.tfPythonPath, [
            this.pythonScriptPath,
            this.modelPath,
            this.labelEncoderPath
        ], { stdio: ['pipe', 'pipe', 'pipe'] });

        this.pythonProcess.stdout.setEncoding('utf8');
        this.pythonProcess.stderr.setEncoding('utf8');
        this.pythonProcess.stderr.on('data', (data) => {
            console.log('[gesture-worker][stderr]', data.toString().trim());
        });

        this.pythonProcess.on('exit', () => {
            this.pythonProcess = null;
        });
    }

    async predict(imageBuffer) {
        if (!this.initialized) throw new Error('Gesture Predictor not initialized');
        await this.startWorker();

        const tempImagePath = path.join(__dirname, '..', 'uploads', 'temp', `gesture_${Date.now()}.jpg`);
        const tempDir = path.dirname(tempImagePath);
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
        fs.writeFileSync(tempImagePath, imageBuffer);

        return new Promise((resolve, reject) => {
            const timeoutMs = 60000; // allow long first-load
            let buffer = '';
            let settled = false;

            const timer = setTimeout(() => {
                if (settled) return;
                settled = true;
                try { if (fs.existsSync(tempImagePath)) fs.unlinkSync(tempImagePath); } catch { }
                reject(new Error('Python worker timeout'));
            }, timeoutMs);

            const onData = (chunk) => {
                buffer += chunk.toString();
                const lines = buffer.split('\n');
                buffer = lines.pop();
                for (const line of lines) {
                    try {
                        const parsed = JSON.parse(line);
                        if (!settled) {
                            settled = true;
                            clearTimeout(timer);
                            try { if (fs.existsSync(tempImagePath)) fs.unlinkSync(tempImagePath); } catch { }
                            this.pythonProcess.stdout.off('data', onData);
                            resolve(parsed);
                        }
                    } catch { }
                }
            };

            this.pythonProcess.stdout.on('data', onData);
            this.pythonProcess.stdin.write(`${tempImagePath}\n`);
        });
    }
}

module.exports = new GesturePredictorPersistent();
