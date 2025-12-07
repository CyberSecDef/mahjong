const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve only specific static files
app.use('/client.js', express.static(path.join(__dirname, 'client.js')));
app.use('/styles.css', express.static(path.join(__dirname, 'styles.css')));

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Mahjong server running on http://localhost:${PORT}`);
});
