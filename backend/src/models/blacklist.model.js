const mongoose = require('mongoose');

const blacklistSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    expiresAt: {
        type: Date,
        required: true,
        default: Date.now // fallback if not provided

    }
});

const Blacklist = mongoose.model('Blacklist', blacklistSchema);

module.exports = Blacklist; 