"use client";
import React, { useState } from 'react';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error uploading file');
      }

      setMessage('File uploaded successfully');
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold mb-4">File Upload</h1>
      <div className="bg-white p-8 shadow-md rounded-lg max-w-md w-full">
        <input type="file" onChange={handleFileChange} className="mb-4" />
        <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
          Upload
        </button>
        {message && <p className="text-red-500 mt-2">{message}</p>}
      </div>
    </div>
  );
};

export default Upload;
