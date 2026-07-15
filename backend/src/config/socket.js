import { Server } from 'socket.io';
import admin from './firebase-admin.js';

export const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        // Allow any localhost origin (handles port 5173, 5174, etc.)
        if (!origin || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
          callback(null, true);
        } else if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Middleware to authenticate socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error('Authentication error'));
      }

      // Verify Firebase token
      const decodedToken = await admin.auth().verifyIdToken(token);
      socket.userId = decodedToken.uid;
      next();
    } catch (error) {
      console.error('Socket auth error:', error);
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userId}`);

    // Join user's personal room (for notifications)
    socket.join(socket.userId);

    // Join a conversation room
    socket.on('join-conversation', (conversationId) => {
      socket.join(conversationId);
      console.log(`User ${socket.userId} joined conversation ${conversationId}`);
    });

    // Leave a conversation room
    socket.on('leave-conversation', (conversationId) => {
      socket.leave(conversationId);
      console.log(`User ${socket.userId} left conversation ${conversationId}`);
    });

    // Typing indicator
    socket.on('typing-start', ({ conversationId }) => {
      socket.to(conversationId).emit('user-typing', {
        userId: socket.userId,
        conversationId
      });
    });

    socket.on('typing-stop', ({ conversationId }) => {
      socket.to(conversationId).emit('user-stopped-typing', {
        userId: socket.userId,
        conversationId
      });
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`);
    });
  });

  return io;
};