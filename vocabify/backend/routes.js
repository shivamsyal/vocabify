const fs = require('fs').promises;
const express = require('express');
const axios = require('axios');
const multer = require('multer'); 
const { readFile } = require('./utils/file-reader');
const { getCaptions } = require('./utils/youtube-api');
const { google } = require('googleapis');
const { OAuth2 } = google.auth;
const path = require('path');
const router = express.Router();
const upload = multer({ dest: 'backend/data/uploads/' });
let previousVideoLink = null;
async function storeTokens(tokens) {
  await fs.writeFile('backend/data/token.json', JSON.stringify(tokens)); 
}

async function loadTokens() {
  try {
      console.log('load token in routes: ', data);
      const data = await fs.readFile('backend/data/token.json', 'utf-8');
      
      return JSON.parse(data); 
  } catch (error) {
      return null; 
  }
}

async function getOAuth2Client() {
  const tokens = await loadTokens();

  const clientId = '189740406198-kh9s8pb0lth8gl46poepevsug7nep8j6.apps.googleusercontent.com'; 
  const clientSecret = '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';
  const redirectUri = 'http://localhost:3002/oauth2callback';
  const oauth2Client = new OAuth2(clientId, clientSecret, redirectUri);

  if (tokens) {
    oauth2Client.setCredentials(
      {
        access_token: tokens['access_token']
      }
    );
  }

  return oauth2Client; 
}

router.get('/api/readflash', async (req, res) => {
  const { fileName } = req.query;
  const filePath = `backend/data/${fileName}`;
  const fileData = await readFile(filePath);
  console.log(fileData);
  res.json({ fileContent: fileData });
});


router.post('/api/upload', upload.single('file'), async (req, res) => { 
  try {
    if (!req.file) {
      throw new Error('No file received');
    }
    const fileData = await readFile(req.file.path);
    const processedData = processFileData(fileData); 
    const fileName = `input.txt`;
    const filePath = `backend/data/${fileName}`;
    await fs.writeFile(filePath, JSON.stringify(fileData));

    res.sendStatus(200);

  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ error: 'File upload failed' });
  }
});

router.post('/api/captions', async (req, res) => {
    try {
      const { videoLink } = req.body;
      const videoId = youtube_parser(videoLink);
      previousVideoLink = videoId;
      console.log('videoId: ', videoId);
      const captions = await getCaptions(videoId);
      const processedCaptions = processCaptions(captions); 
      const fileName = `captions.txt`; 
      const filePath = `backend/data/${fileName}`;
      await fs.writeFile(filePath, JSON.stringify(captions));
  
      res.json({ captions: captions });
    } catch (error) {
      if (error.message === 'User authorization required') {
        
          res.status(401).json({ error: 'Authorization required' });
      } else {
          console.error('Error fetching captions:', error);
          res.status(500).json({ error: 'Failed to fetch captions' });
      }
    }
});

router.get('/authorize', async (req, res) => {
  console.log('authorizing...');
  const oauth2Client = await getOAuth2Client();
  const url = oauth2Client.generateAuthUrl({ 
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/youtube.readonly'],
  });

  res.redirect(url);
});


router.get('/oauth2callback', async (req, res) => {
  const code = req.query.code;
  const oauth2Client = await getOAuth2Client(); 
  try {
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);
      await storeTokens(tokens);
      console.log('got token...');
      console.log('prev video link', previousVideoLink);
      res.redirect(`http://localhost:3000/?videoLink=${previousVideoLink}`);
  } catch (error) {
      console.log('error in getting token...', error);
      console.error('Error exchanging code:', error); 
      
  }
});

async function processFileData(fileData) {
  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      'messages': [{'role': 'user', 'content':`As a language expert, you were chosen to help students learning English. 
            Your task is to select 10-15 key words from the following transcript and give a basic definition for each word. 
            The definitions should be no longer than two lines. Try to keep the results fairly consistent in terms of identifying key words. 
            Please make the outputs clear, concise, and easy to read without extra jargon. In your response, give me the reponse in this format: "word1: definition| word2: definition| word3: definition", etc. \n\n${fileData}`}],
      'max_tokens': 150,
      'temperature': 0.2, 
      'model': 'gpt-3.5-turbo'
    }, {
      headers: {
        'Authorization': `Bearer sk-proj-ny5ZvhkK3CJo0GvPoNwuT3BlbkFJmJjLPw7tJf8UOeiOo59B`,
        'Content-Type': 'application/json'
      }
    });
    await fs.writeFile(`backend/data/flashcards-file.txt`, response.data.choices[0].message.content.split('\n'));
  } catch (error) {
    console.error(error);
  }
}
  
async function processCaptions(captions) {
  try { 
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      'messages': [{'role': 'user', 'content':`As a language expert, you were chosen to help students learning English. 
            Your task is to select 10-15 key words from the following transcript and give a basic definition for each word. 
            The definitions should be no longer than two lines. Try to keep the results fairly consistent in terms of identifying key words. 
            Please make the outputs clear, concise, and easy to read without extra jargon. In your response, give me the reponse in this format: "word1: definition| word2: definition| word3: definition" \n\n${captions}`}],
      'max_tokens': 300,
      'temperature': 0.2, 
      'model': 'gpt-3.5-turbo'
    }, {
      headers: {
        'Authorization': `Bearer sk-proj-ny5ZvhkK3CJo0GvPoNwuT3BlbkFJmJjLPw7tJf8UOeiOo59B`,
        'Content-Type': 'application/json'
      }
    });
    await fs.writeFile(`backend/data/flashcards-video.txt`, response.data.choices[0].message.content.split('\n'));
  } catch (error) {
    console.error(error);
  }
}

function youtube_parser(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
}


module.exports = router;