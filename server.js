const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware to handle JSON data and static frontend files
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Backend API Endpoint to receive form submissions
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;

    // Server-side validation
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const newMessage = {
        name,
        email,
        message,
        timestamp: new Date().toISOString()
    };

    const filePath = path.join(__dirname, 'messages.json');

    // Read existing entries or start a fresh array
    fs.readFile(filePath, 'utf8', (err, data) => {
        let messagesArray = [];
        
        if (!err && data) {
            try {
                messagesArray = JSON.parse(data);
            } catch (parseErr) {
                messagesArray = [];
            }
        }

        // Add the new submission
        messagesArray.push(newMessage);

        // Save back to JSON file
        fs.writeFile(filePath, JSON.stringify(messagesArray, null, 2), (writeErr) => {
            if (writeErr) {
                return res.status(500).json({ error: 'Failed to save data.' });
            }
            console.log('👍 New message saved to messages.json!');
            return res.status(200).json({ success: true });
        });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server running perfectly at http://localhost:${PORT}`);
});