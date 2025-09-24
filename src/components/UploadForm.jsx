import React, { useState } from 'react';
import axios from 'axios';

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('No token found. Please login first.');
        return;
      }

      const formData = new FormData();
      formData.append('xray', file);

      console.log('Starting upload test...');
      console.log('File:', file.name);
      
      const response = await axios.post('http://localhost:5000/api/predict', formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Upload response:', response.data);
      setMessage('Upload successful: ' + JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.error('Upload failed:', error);
      setMessage('Error: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Test Upload</h2>
      <input type="file" onChange={handleFileChange} accept="image/*" />
      <button onClick={handleUpload} disabled={!file}>
        Upload Test
      </button>
      <pre style={{ marginTop: '20px', whiteSpace: 'pre-wrap' }}>
        {message}
      </pre>
    </div>
  );
}