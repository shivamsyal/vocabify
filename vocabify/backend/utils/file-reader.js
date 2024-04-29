const fs = require('fs').promises; // Using promises version of fs

async function readFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return data;
  } catch (error) {
    console.error('Error reading file:', error);
    throw error; // Re-throw to pass error to route handler
  }
}

module.exports = { readFile }; 