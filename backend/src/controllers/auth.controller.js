const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Blacklist = require('../models/blacklist.model');

/** 
 * @desc Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
async function registerUserController(req, res) {
    try {
        console.log("BODY:", req.body);
        console.log("JWT_SECRET:", process.env.JWT_SECRET);

        const { name, email, password } = req.body;

        // ✅ Basic validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if user exists
        let user = await userModel.findOne({$or: [{ email }, { name }] });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        // ✅ Use bcryptjs for hashing
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        user = new userModel({
            name,
            email,
            password: hashedPassword
        });

        await user.save();

        // ✅ Check JWT secret before signing
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is missing!");
            return res.status(500).json({ message: "JWT config error" });
        }

        // Generate token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        return res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            },
            token
        });

    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ message: 'Server error' });
    }
}


/** 
 * @desc Login user
 * @route POST /api/auth/login
 * @access Public
 */
async function loginUserController(req, res) {
    try {
        console.log("LOGIN BODY:", req.body);

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check user
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // JWT check
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is missing!");
            return res.status(500).json({ message: "JWT config error" });
        }

        // Generate token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 60 * 60 * 1000 // 1 hour
        });
        res.status(200).json({
            message: 'Login successful',    
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            },
            token
        });
        console.log("SIGN SECRET:", process.env.JWT_SECRET);


    } catch (error) {
        console.error('Error logging in user:', error);
        return res.status(500).json({ message: 'Server error' });
    }
}
/**
 * @desc Logout user
 * @route POST /api/auth/logout
 * @access Public
 */
async function logoutUserController(req, res) {
    const token = req.cookies.token;
    if(token) {
        try {
            // Add token to blacklist
            const blacklistedToken = new Blacklist({ token });
            await blacklistedToken.save();
        } catch (error) {
            console.error('Error blacklisting token:', error);
            return res.status(500).json({ message: 'Server error' });
        }
    }
    
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict'
        });
        return res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Error logging out user:', error);
        return res.status(500).json({ message: 'Server error' });
    }
}

/** 
 * @desc Get current user
 * @route GET /api/auth/get-me
 * @access Private
 */
async function getMeController(req, res) {
    try {
        const user = await userModel.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ user });
    } catch (error) {
        console.error('Error fetching user:', error);
        return res.status(500).json({ message: 'Server error' });
    }
}   

module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
};