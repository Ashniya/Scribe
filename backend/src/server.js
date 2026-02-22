// backend/src/server.js
import dotenv from 'dotenv';
dotenv.config({ path: '.env.backend' });

import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import './config/firebase-admin.js';
import authRoutes from './routes/auth.routes.js';
import blogRoutes from './routes/blog.routes.js';
import profileRoutes from './routes/profile.routes.js';
import statsRoutes from './routes/stats.routes.js';
import userRoutes from './routes/user.routes.js';
import commentRoutes from './routes/comment.routes.js';
import errorHandler from './middleware/error.middleware.js';
import { createServer } from 'http';
import { setupSocket } from './config/socket.js';
import messageRoutes from './routes/message.routes.js';

connectDB();

const app = express();
const httpServer = createServer(app);
const io = setupSocket(httpServer);
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      callback(null, true);
    } else if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.get('/', (req, res) => {
  res.json({ message: 'Scribe API is running 🚀' });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      database: 'connected',
      firebase: 'initialized',
      websocket: 'active'
    }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/messages', messageRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`Websocket server is active on port ${PORT}`);
});

export default app;