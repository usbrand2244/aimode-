const express = require('express');
const { exec } = require('child_process');
const app = express();

app.get('/', (req, res) => {
  res.send('Streamgrabber API is active! Use: /grab?id=ttXXXXXXX');
});

app.get('/grab', (req, res) => {
  const imdbId = req.query.id;
  
  // Validate that the user provided an IMDb format (e.g., tt0096895)
  if (!imdbId || !/^tt\d+\$/.test(imdbId)) {
    return res.status(400).json({ error: 'Please provide a valid IMDb ID format (e.g. tt0096895)' });
  }

  // Command to run the streamgrabber python script
  const command = `python3 -m streamgrabber "${imdbId}" --quality best`;

  exec(command, (error, stdout, stderr) => {
    const logs = stdout + stderr;
    
    // Regular expression to look for a video stream manifest link
    const m3u8Regex = /(https?:\/\/[^\s"'`]+\.m3u8[^\s"'`]*)/i;
    const match = logs.match(m3u8Regex);

    if (match) {
      return res.json({
        success: true,
        imdb_id: imdbId,
        m3u8_url: match[0]
      });
    } else {
      return res.status(404).json({
        success: false,
        error: 'Could not find a valid .m3u8 stream link for this IMDb ID.',
        debug_logs: logs.slice(-300) // Shows the last few lines of errors if it fails
      });
    }
  });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
