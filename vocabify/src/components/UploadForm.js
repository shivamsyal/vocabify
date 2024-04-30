"use client";
import { useState, useEffect } from 'react';

const Upload = () => {
  const [className, setClassName] = useState('');
  const [videoLink, setVideoLink] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [captions, setCaptions] = useState('');
  const [pendingRequest, setPendingRequest] = useState(null);
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const videoLink = urlParams.get('videoLink'); 
    console.log('sending new: ', videoLink);
    if (videoLink) {
       setPendingRequest(videoLink);
       fetchCaptions(videoLink);
    }
  }, []);

  useEffect(() => {
    console.log('pendingRequest state:', pendingRequest); 
  }, [pendingRequest]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile & !selectedFile.name.endsWith('.txt')) {
      setmessage("Please select a TXT file");
      setFile(null);
    } else{
      setFile(selectedFile);
    }
    
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('fetching called???');
    fetchCaptions(videoLink);
    
    const formData = new FormData();
    if(file)
      formData.append('file', file);
    try {
      const response = await fetch('http://localhost:3002/api/upload', {
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
  const fetchCaptions = async (videoLink) => {
    console.log('fetching captions...');
    setPendingRequest(videoLink);
    try {
        const response = await fetch('http://localhost:3002/api/captions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ videoLink }),
        });

        if (response.ok) {
            const data = await response.json();
            setCaptions(data.captions);
            setPendingRequest(null);
        } else if (response.status === 401) { // Authorization Required
            // Redirect to the authorization flow
            console.log('got 401, going to auth...');
            setPendingRequest(videoLink);
            console.log('pendingRequest: ', pendingRequest);
            window.location.href = 'http://localhost:3002/authorize';
        } else {
            throw new Error('Error fetching captions'); 
        }
    } catch (error) {
        console.log(error);
    }
};
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 to-purple-300 flex flex-col justify-center items-center">
      <h1 className="text-5xl font-bold text-gray-800">Upload</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 shadow-lg rounded-lg max-w-md w-full mt-8"> {/* Adjusted margin-top */}
        <div className="mb-6">
          <label htmlFor="className" className="block text-gray-700 font-bold mb-2">Class Name</label>
          <input type="text" id="className" value={className} onChange={(e) => setClassName(e.target.value)} className="border border-gray-300 px-4 py-3 rounded-md w-full focus:outline-none focus:border-blue-500 text-gray-700" />
        </div>
        <div className="mb-6">
          <label htmlFor="videoLink" className="block text-gray-700 font-bold mb-2">Video Link</label>
          <input type="text" id="videoLink" value={videoLink} onChange={(e) => setVideoLink(e.target.value)} className="border border-gray-300 px-4 py-3 rounded-md w-full focus:outline-none focus:border-blue-500 text-gray-700" />
        </div>
        <div className="mb-6">
          <label htmlFor="fileUpload" className="block text-gray-700 font-bold mb-2">Upload TXT File</label>
          <input type="file" id="fileUpload" onChange={handleFileChange} className="border border-gray-300 px-4 py-3 rounded-md w-full focus:outline-none focus:border-blue-500" />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors duration-300 ease-in-out mb-4 focus:outline-none">
          Submit
        </button>
        {message && <p className="text-red-500 mt-4">{message}</p>}
      </form>
      {captions && <div className="captions mt-10">{captions}</div>} 
    </div>
  );
}

export default Upload;
