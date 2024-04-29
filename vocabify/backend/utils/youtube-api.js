const { google } = require('googleapis');
const { OAuth2 } = google.auth;

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

    console.log({tokens});
    const clientId = '189740406198-kh9s8pb0lth8gl46poepevsug7nep8j6.apps.googleusercontent.com'; 
    const clientSecret = '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';
    const redirectUri = 'http://localhost:3002/oauth2callback';
    const oauth2Client = new OAuth2(clientId, clientSecret, redirectUri);
  
    if (tokens) {
      oauth2Client.setCredentials(tokens); 
    }
  
    return oauth2Client; 
  }



async function getCaptions(videoId) {
    try {
        const oauth2Client = await getOAuth2Client();
        console.log(oauth2Client.credentials.access_token);
        if (!oauth2Client.credentials.access_token) {
            // Handle authorization flow (details below)
            throw new Error('User authorization required');  
        }
        const youtube = google.youtube({
            version: 'v3',
            auth: oauth2Client
        });
        // Step 1: Get Caption Tracks
        const listResponse = await youtube.captions.list({
            part: 'id', // We only need the caption track IDs
            videoId: videoId
        });

        const captionTracks = listResponse.data.items;

        if (captionTracks.length === 0) {
            console.warn('Video has no captions or captions are not public');
            return null;
        }

        // Step 2: Download Captions
        const promises = captionTracks.map(async (track) => {
            const downloadResponse = await youtube.captions.download({
                id: track.id,
                tfmt: 'srt', // Example: Download as SRT format 
            });
            return downloadResponse.data; // Contains caption text
        });

        const captions = await Promise.all(promises);
        return captions.join('\n\n'); // Join with separators if needed
    } catch (error) {
        throw error;
        
    }
}

module.exports = { getCaptions };