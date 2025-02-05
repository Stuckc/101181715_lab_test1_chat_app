const express = require('express');
const Message = require('../models/Message');

const router = express.Router();

// Send Message
router.post('/send', async (req, res) => {
    try {
        const { sender, text } = req.body;
        const newMessage = new Message({ sender, text });
        await newMessage.save();

        res.status(201).json({ message: "Message sent!", newMessage });

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// Get Messages
router.get('/messages', async (req, res) => {
    try {
        const messages = await Message.find().populate('sender', 'username');
        res.json(messages);

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

module.exports = router;
