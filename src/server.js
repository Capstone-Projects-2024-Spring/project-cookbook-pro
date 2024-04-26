const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/proxy', async (req, res) => {
    const imageUrl = req.query.url;
    try {
        const response = await fetch(imageUrl);
        const imageBuffer = await response.buffer();
        res.type(response.headers.get('content-type'));
        res.send(imageBuffer);
    } catch (error) {
        console.error('Failed to fetch image:', error);
        res.status(500).send('Failed to fetch image');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
