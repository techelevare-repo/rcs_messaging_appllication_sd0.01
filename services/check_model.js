const fs = require('fs');
const path = require('path');

async function checkModel() {
    const modelPath = path.resolve(__dirname, '../../lung_cancer_detection_model_Xception-Anurag 1.onnx');
    
    console.log('Model path:', modelPath);
    console.log('File exists:', fs.existsSync(modelPath));
    
    // Read first few bytes to check the file header
    const fd = fs.openSync(modelPath, 'r');
    const buffer = Buffer.alloc(32);
    fs.readSync(fd, buffer, 0, 32, 0);
    fs.closeSync(fd);
    
    console.log('\nFirst 32 bytes (hex):', buffer.toString('hex'));
    console.log('First 32 bytes (ascii):', buffer.toString('ascii').replace(/[^\x20-\x7E]/g, '.'));
    
    // If it's a protobuf file, it should start with these bytes
    const isProto = buffer[0] === 0x08 && buffer[1] === 0x03;
    console.log('\nLooks like a valid protobuf file:', isProto);
}

checkModel().catch(console.error);