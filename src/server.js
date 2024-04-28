const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

// Proxy endpoint
app.get('/proxy', async (req, res) => {
    const imageUrl = req.query.url;
    if (!imageUrl) {
        return res.status(400).send('No URL provided');
    }

    try {
        const response = await fetch(imageUrl);
        const imageBuffer = await response.buffer();
        res.set('Content-Type', 'image/png');
        res.send(imageBuffer);
    } catch (error) {
        console.error('Failed to fetch image:', error);
        res.status(500).send('Failed to fetch image');
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
