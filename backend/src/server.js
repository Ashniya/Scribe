import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import './config/firebase.js'; // Initialize Firebase (for auth only) - Keeping HEAD's init
import authRoutes from './routes/auth.routes.js';
import blogRoutes from './routes/blog.routes.js';
import testRoutes from './routes/test.routes.js';
import commentRoutes from './routes/comment.routes.js';
import profileRoutes from './routes/profile.routes.js';
import statsRoutes from './routes/stats.routes.js';
import userRoutes from './routes/user.routes.js';
import errorHandler from './middleware/error.middleware.js';

// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Enable CORS — MUST be before body parsers and routes
// origin: true mirrors the request's own origin back, which is safe for local dev
// and is required when credentials: true is used (cannot use wildcard '*')
const corsOptions = {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight for all routes

// Body parser middleware — 50mb limit to support base64 embedded images in blog content
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

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
      firebase: 'initialized'
    }
  });
});

app.use('/api/test', testRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/users', userRoutes);

// Error handler middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log('🔐 Authentication: Firebase');
  console.log('💾 Database: MongoDB');
});

export default app;