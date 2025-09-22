const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

// Extract ONNX model from ZIP
console.log('Extracting ONNX model...');
const modelPath = path.resolve(__dirname, '../lung_cancer_detection_model_Xception-Anurag 1.onnx');
const zip = new AdmZip(modelPath);
const modelFile = zip.getEntry('__MODEL_PROTO.onnx');

// Extract all files to the services directory
zip.extractAllTo(path.join(__dirname, 'services'), true);
console.log('Model files extracted successfully!');