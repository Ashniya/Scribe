// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import connectDB from './config/db.js';
// import './config/firebase.js'; // Initialize Firebase (for auth only) - Keeping HEAD's init
// import authRoutes from './routes/auth.routes.js';
// import blogRoutes from './routes/blog.routes.js';
// import testRoutes from './routes/test.routes.js';
// import commentRoutes from './routes/comment.routes.js';
// import profileRoutes from './routes/profile.routes.js';
// import statsRoutes from './routes/stats.routes.js';
// import userRoutes from './routes/user.routes.js';
// import errorHandler from './middleware/error.middleware.js';

// connectDB();

// const app = express();
// const httpServer = createServer(app);
// const io = setupSocket(httpServer);
// app.use((req, res, next) => {
//   req.io = io;
//   next();
// });

// // Enable CORS — MUST be before body parsers and routes
// // origin: true mirrors the request's own origin back, which is safe for local dev
// // and is required when credentials: true is used (cannot use wildcard '*')
// const corsOptions = {
//   origin: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true
// };
// app.use(cors(corsOptions));
// app.options('*', cors(corsOptions)); // Handle preflight for all routes

// // Body parser middleware — 50mb limit to support base64 embedded images in blog content
// app.use(express.json({ limit: '50mb' }));
// app.use(express.urlencoded({ extended: false, limit: '50mb' }));

// // Routes
// app.get('/', (req, res) => {
//   res.json({ message: 'Scribe API is running 🚀 - Firebase Auth + MongoDB' });
// });

// app.get('/api/health', (req, res) => {
//   res.json({
//     status: 'ok',
//     timestamp: new Date().toISOString(),
//     auth: 'Firebase',
//     database: 'MongoDB',
//     services: {
//       database: 'connected',
//       firebase: 'initialized',
//       websocket: 'active'
//     }
//   });
// });

// app.use('/api/test', testRoutes);
// app.use('/api/auth', authRoutes);
// app.use('/api/blogs', blogRoutes);
// app.use('/api/comments', commentRoutes);
// app.use('/api/profile', profileRoutes);
// app.use('/api/stats', statsRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/comments', commentRoutes);

// app.use(errorHandler);

// const PORT = process.env.PORT || 5000;

// httpServer.listen(PORT, () => {
//   console.log(`✅ Server running on port ${PORT}`);
//   console.log(`📍 http://localhost:${PORT}`);
// });

// export default app;
// backend/src/server.js
import dotenv from 'dotenv';
dotenv.config({ path: '.env.backend' });

import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import './config/firebase-admin.js';
import { setupSocket } from './config/socket.js';
import authRoutes from './routes/auth.routes.js';
import blogRoutes from './routes/blog.routes.js';
import testRoutes from './routes/test.routes.js';
import commentRoutes from './routes/comment.routes.js';
import profileRoutes from './routes/profile.routes.js';
import statsRoutes from './routes/stats.routes.js';
import userRoutes from './routes/user.routes.js';
import messageRoutes from './routes/message.routes.js';
import errorHandler from './middleware/error.middleware.js';

// Connect to MongoDB
connectDB();

const app = express();

// Path for static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create HTTP server for Socket.io
const httpServer = createServer(app);

// Setup Socket.io
const io = setupSocket(httpServer);

// Make io available to all routes via req.io
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Enable CORS — Friend's better CORS config with 50mb support
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      callback(null, true);
    } else if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight for all routes

// Body parser middleware — 50mb limit to support base64 embedded images in blog content
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Scribe API is running 🚀 - Firebase Auth + MongoDB' });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    auth: 'Firebase',
    database: 'MongoDB',
    services: {
      database: 'connected',
      firebase: 'initialized',
      websocket: 'active'
    }
  });
});

// Register routes
app.use('/api/test', testRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

// Error handler middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Use httpServer.listen instead of app.listen
httpServer.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log('🔐 Authentication: Firebase');
  console.log('💾 Database: MongoDB');
  console.log('🔌 WebSocket server active');
});

export default app;