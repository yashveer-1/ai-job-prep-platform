const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');


const app = express();  // ✅ FIRST create app

const rawAllowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5173/',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'https://ai-job-prep-platform.vercel.app',
  'https://ai-job-prep-platform.onrender.com',
  process.env.FRONTEND_URL,
].filter(Boolean);

const allowedOrigins = rawAllowedOrigins.map((origin) => origin.replace(/\/$/, ''));

// ✅ THEN use middleware
app.use(cors({
  origin(origin, callback) {
    const normalizedOrigin = origin?.replace(/\/$/, '');

    if (!normalizedOrigin || allowedOrigins.includes(normalizedOrigin)) {
      callback(null, true);
      return;
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Import routes
const AuthRouter = require('./routes/auth.route');
const InterviewRouter = require('./routes/interviewRoute');

// Use routes
app.use('/api/auth', AuthRouter);
app.use('/api/interview', InterviewRouter);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Server error', error: err.message });
});
app.get('/', (req, res) => {
  res.send('Welcome to the Interview Preparation API');
});

module.exports = app;
