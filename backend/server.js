require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
app.use('/chat', chatRoutes);

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);

app.get("/", (req, res) => {
    res.send("Chat Server is Running...");
});

// Socket.io Events
const Message = require('./models/Message');

io.on("connection", (socket) => {
    console.log("🔵 New client connected");

    socket.on("sendMessage", async (data) => {
        try {
            const { sender, text } = data;
            const newMessage = new Message({ sender, text });
            await newMessage.save();

            io.emit("receiveMessage", newMessage); // Broadcast to all clients
        } catch (error) {
            console.error("Message saving error:", error);
        }
    });

    socket.on("disconnect", () => {
        console.log("🔴 Client disconnected");
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
