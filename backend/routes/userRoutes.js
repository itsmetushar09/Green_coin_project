// routes/userRoutes.js

const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Helper function to generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @route   POST /api/users/signup
// @desc    Register a new user
router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    console.log('Signup payload:', req.body);

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    try {
        if (await User.findOne({ email })) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = new User({ username, email, password });
        await user.save();

        res.status(201).json({
            _id: user._id,
            username: user.username,
            greenCoins: user.greenCoins,
            token: generateToken(user._id),
            message: 'User registered successfully'
        });

    } catch (error) {
        console.error('Signup error:', error); // <--- Add this line
        res.status(500).json({ message: 'Server error during signup' });
    }
});

// @route   POST /api/users/signin
// @desc    Authenticate user & get token
router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                username: user.username,
                greenCoins: user.greenCoins,
                token: generateToken(user._id),
                message: 'Sign in successful'
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error during signin' });
    }
});

// @route   GET /api/users/profile
// @desc    Get full user data (Protected) - Provides dynamic wallet data
router.get('/profile', protect, async (req, res) => {
    // req.user is populated by the protect middleware
    const user = req.user; 

    if (user) {
        // Return all necessary wallet data to the frontend
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            greenCoins: user.greenCoins,
            earnedToday: user.earnedToday,
            level: user.level,
            badges: user.badges.length, // Send the count of badges
            globalRank: user.globalRank,
            devicesRecycled: user.devicesRecycled
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

module.exports = router;