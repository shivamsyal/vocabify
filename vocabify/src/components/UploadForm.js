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
    if (videoLink) {
       setPendingRequest(videoLink);
       fetchCaptions(videoLink);
    }
  }, []);

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
      setMessage('Upload successful');
      setClassName('');
      setVideoLink('');
      setFile(null);
    } catch (error) {
      setMessage(error.message);
    }
  };
  const fetchCaptions = async (videoLink) => {
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
        } else if (response.status === 401) {
            setPendingRequest(videoLink);
            window.location.href = 'http://localhost:3002/authorize';
        } else {
          console.log('Error fetching captions');
        }
    } catch (error) {
        console.log(error);
    }
};
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 to-purple-300 flex flex-col justify-center items-center">
      <h1 className="fancy-title">Upload</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 shadow-lg rounded-lg max-w-md w-full mt-8"> {/* Adjusted margin-top */}
        
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
      <style jsx>{`
                .header {
                    text-align: center;
                    margin-bottom: 20px;
                }
                .fancy-title {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    font-size: 3rem;
                    font-weight: bold;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    color: #fff;
                    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
                    margin: 0;
                    padding: 10px;
                    background: linear-gradient(to bottom right, #87ceeb, #9370db);
                    border-radius: 10px;
                    box-shadow: none;
                }
                .flashcards-container {
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                    background: transparent;
                    border-radius: 10px;
                    box-shadow: none;
                }
                h1 {
                    text-align: center;
                    margin-bottom: 20px;
                    color: #fff; /* White text color */
                }
                .input-container {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 20px;
                    position: relative;
                    left: 100px;
                    top: 15px;
                }
                .input-field {
                    width: 200px;
                    padding: 10px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    outline: none;
                    color: black;
                    transition: border-color 0.3s;
                }
                .input-field:focus {
                    border-color: #007bff;
                }
                .empty-input {
                    border-color: red;
                }
                .btn {
                    padding: 10px 20px;
                    background-color: #007bff;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    outline: none;
                    transition: background-color 0.3s;
                }
                .btn:hover {
                    background-color: #0056b3;
                }
                .flashcard-list {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 20px;
                }
                .flashcard {
                    background-color: #f8f9fa;
                    border-radius: 5px;
                    overflow: hidden;
                    position: relative;
                    top: 30px;
                }
                .card {
                    height: 130px;
                    background-color: #f0f0f0;
                    border-radius: 5px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    cursor: pointer;
                    transition: transform 0.5s;
                    color: black;
                    position: relative;
                }
                .card.flipped {
                    transform: rotateY(180deg);
                }
                .front, .back {
                    padding: 10px;
                    position: absolute;
                }
                .back {
                    transform: rotateY(180deg);
                    color: black;
                }
                .flashcard-actions {
                    display: flex;
                    justify-content: space-around;
                    padding: 15px 15px;
                }
                .action-btn {
                    padding: 5px 10px;
                    border: none;
                    border-radius: 3px;
                    cursor: pointer;
                    outline: none;
                    transition: background-color 0.3s;
                }
                .edit-btn {
                    background-color: #ffc107;
                    color: black;
                }
                .remove-btn {
                    background-color: #dc3545;
                    color: white;
                }
                .action-btn:hover {
                    opacity: 0.8;
                }
            `}</style>
    </div>
  );
}

export default Upload;
