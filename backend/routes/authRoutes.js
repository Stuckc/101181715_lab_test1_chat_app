const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// User Registration (Signup)
router.post('/signup', async (req, res) => {
    try {
        const { username, firstname, lastname, password } = req.body;
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(400).json({ message: "Username already exists." });
        }

        const newUser = new User({ username, firstname, lastname, password });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully!" });

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// User Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        const token = jwt.sign({ id: user._id }, "secretkey", { expiresIn: "1h" });
        res.json({ token, user });

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

module.exports = router;
