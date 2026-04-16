const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();  // ✅ FIRST create app

// ✅ THEN use middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Import routes
const AuthRouter = require('./routes/auth.route');

// Use routes
app.use('/api/auth', AuthRouter);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Server error', error: err.message });
});

module.exports = app;