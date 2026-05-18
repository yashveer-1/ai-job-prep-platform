const jwt = require('jsonwebtoken');
const tokenBlacklist = require('../models/blacklist.model');

function getToken(req) {
    const authHeader = req.headers.authorization || '';
    const [scheme, bearerToken] = authHeader.trim().split(/\s+/);

    if (scheme?.toLowerCase() === 'bearer' && bearerToken) {
        return bearerToken;
    }

    return req.cookies.token;
}

async function authUser(req, res, next) {
    const token = getToken(req);


    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }
    const isTokenBlacklisted = await tokenBlacklist.findOne({ token });
    if (isTokenBlacklisted) {
        return res.status(401).json({ message: 'Token is blacklisted' });
    }


    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user info to request object
        next();
    } catch (err) {
        console.error('Token verification failed:', err);
        return res.status(401).json({ message: 'Token is not valid' });
    }
    
}

module.exports = authUser;
