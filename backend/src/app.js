const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();


app.use(express.json());// Middleware to parse JSON bodies
app.use(cookieParser()); // Middleware to parse cookies
// Import routes
const AuthRouter = require('./routes/auth.route');

// Use the auth routes
app.use('/api/auth', AuthRouter);

// Add this at the end of app.js before module.exports
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
});

module.exports = app;

