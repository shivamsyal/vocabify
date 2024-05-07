const fs = require('fs').promises;
const express = require('express');
const multer = require('multer'); 
const { readFile } = require('./utils/file-reader');
const { getCaptions } = require('./utils/youtube-api');
const { google } = require('googleapis');
const { OAuth2 } = google.auth;
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


router.post('/api/upload', upload.single('file'), async (req, res) => { 
  try {
    if (!req.file) {
      throw new Error('No file received');
    }
    const fileData = await readFile(req.file.path);
    const processedData = processFileData(fileData); 
    const fileName = `input.txt`; // timestamp as name
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
  
      // store in data folder
      const fileName = `${Date.now()}-captions.json`; 
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

function processFileData(fileData) {
    console.log('Processing TXT file data...');
    return fileData;
}
  
function processCaptions(captions) {
    console.log('Processing YouTube caption data...');
    return captions;
}

function youtube_parser(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
}


module.exports = router;