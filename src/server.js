const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.get('/proxy', async (req, res) => {
    const url = decodeURIComponent(req.query.url);
    const response = await fetch(url);
    if (!response.ok) return res.status(500).send('Error fetching the image');

    response.body.pipe(res); // Directly pipe the image data to the client without modification
});

app.listen(3000);
