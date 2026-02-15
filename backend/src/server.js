import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import './config/firebase.js'; // Initialize Firebase (for auth only)
import authRoutes from './routes/auth.routes.js';
import blogRoutes from './routes/blog.routes.js';
import testRoutes from './routes/test.routes.js';
import commentRoutes from './routes/comment.routes.js';
import errorHandler from './middleware/error.middleware.js';

// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enable CORS
app.use(cors({
  origin: ['http://localhost:5174', 'http://localhost:5175', process.env.FRONTEND_URL].filter(Boolean),
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Scribe API is running - Firebase Auth + MongoDB' });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    auth: 'Firebase',
    database: 'MongoDB'
  });
});

app.use('/api/test', testRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/comments', commentRoutes);

// Error handler middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log('🔐 Authentication: Firebase');
  console.log('💾 Database: MongoDB');
});
