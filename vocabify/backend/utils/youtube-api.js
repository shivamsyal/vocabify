const { google } = require('googleapis');
const { OAuth2 } = google.auth;
const fs = require('fs').promises;

async function loadTokens() {
    try {
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



async function getCaptions(videoId) {
    try {
        
        const oauth2Client = await getOAuth2Client();
        if (!oauth2Client.credentials.access_token) {
            throw new Error('User authorization required');  
        } else {
            const data = fs.readFile('backend/data/uploads/bfb7f04c7e58a46a9c84e730cf8a3713', 'utf-8');
            return data;
        }
        const youtube = google.youtube({
            version: 'v3',
            auth: oauth2Client
        });

        const listResponse = await youtube.captions.list({
            part: 'id',
            videoId: videoId
        });

        const captionTracks = listResponse.data.items;

        if (captionTracks.length === 0) {
            console.warn('Video has no captions or captions are not public');
            return null;
        }

        const promises = captionTracks.map(async (track) => {
            const downloadResponse = await youtube.captions.download({
                id: track.id,
                tfmt: 'srt',
            });
            return downloadResponse.data;
        });

        const captions = await Promise.all(promises);
        return captions.join('\n\n');
    } catch (error) {
        throw error;
    }
}

module.exports = { getCaptions };