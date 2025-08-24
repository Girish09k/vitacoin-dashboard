require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const socketIo = require('socket.io');
const mongoose = require('mongoose');

// Import routes and middleware
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const badgeRoutes = require('./routes/badgeRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const passwordRoutes = require('./routes/passwordRoutes');
const supportRoutes = require('./routes/supportRoutes');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.log('❌ MongoDB connection error:', err));

// Create HTTP and Socket.IO server
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  }
});

// Make io accessible in routes
app.set('io', io);

// Handle socket connections
io.on('connection', (socket) => {
  console.log('🔌 Socket connected:', socket.id);

  socket.on('subscribeToUser', (userId) => {
    socket.join(userId);
    console.log(`📡 Socket ${socket.id} joined room for user ${userId}`);
  });

  socket.on('disconnect', () => {
    console.log('❌ Socket disconnected:', socket.id);
  });
});

// Routes with auth middleware where needed
app.use('/api/auth', authRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/transactions', authMiddleware, transactionRoutes);
app.use('/api/badges', authMiddleware, badgeRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/password', passwordRoutes);
app.use('/api/support', supportRoutes);

// Basic root route
app.get('/', (req, res) => {
  res.send('Vitacoin backend server with real-time updates is running 🚀');
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
