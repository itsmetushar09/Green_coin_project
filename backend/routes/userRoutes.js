
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Use the compatible User model

const router = express.Router();

// JWT secret (use environment variable in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Authentication middleware
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: 'Access token required' 
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'User not found' 
            });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(403).json({ 
            success: false, 
            message: 'Invalid or expired token' 
        });
    }
};

// POST /api/users/register - User registration
router.post('/register', async (req, res) => {
    console.log('📝 Registration request received');
    console.log('Body:', { ...req.body, password: '[HIDDEN]' });
    
    try {
        const { email, password, name } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // Create new user with safe defaults
        const userData = {
            email: email.toLowerCase(),
            password: password,
            name: name || email.split('@')[0], // Generate name from email if not provided
            coins: 0,
            level: 1,
            devicesRecycled: 0,
            totalValue: 0,
            co2Saved: 0,
            badges: ['First Recycle'], // Welcome badge equivalent
            recyclingHistory: [],
            preferences: {
                notifications: true,
                emailUpdates: true,
                publicProfile: false,
                language: 'en'
            },
            profile: {
                joinedDate: new Date(),
                avatar: null,
                location: null,
                bio: null,
                favoriteDeviceType: null
            }
        };

        const user = new User(userData);
        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        console.log('✅ User registered successfully:', user.email);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token: token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                coins: user.coins,
                level: user.level,
                devicesRecycled: user.devicesRecycled,
                badges: user.badges
            }
        });

    } catch (error) {
        console.error('❌ Registration error:', error);
        
        // Handle specific validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: `Validation error: ${messages.join(', ')}`
            });
        }
        
        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Registration failed. Please try again.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// POST /api/users/login - User login
router.post('/login', async (req, res) => {
    console.log('🔐 Login request received');
    console.log('Email:', req.body.email);
    
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Update last login
        user.lastLogin = new Date();
        user.lastActivity = new Date();
        
        // Ensure user has required fields (handle legacy data)
        if (!user.name && user.email) {
            user.name = user.email.split('@')[0];
        }
        
        if (user.coins === undefined) user.coins = 0;
        if (user.level === undefined) user.level = 1;
        if (user.devicesRecycled === undefined) user.devicesRecycled = 0;
        if (!user.badges) user.badges = [];
        
        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        console.log('✅ User logged in successfully:', user.email);

        res.json({
            success: true,
            message: 'Login successful',
            token: token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                coins: user.coins,
                level: user.level,
                devicesRecycled: user.devicesRecycled,
                badges: user.badges,
                totalValue: user.totalValue || 0
            }
        });

    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed. Please try again.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// GET /api/users/profile - Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const user = req.user;
        
        res.json({
            success: true,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                coins: user.coins || 0,
                level: user.level || 1,
                devicesRecycled: user.devicesRecycled || 0,
                badges: user.badges || [],
                totalValue: user.totalValue || 0,
                co2Saved: user.co2Saved || 0,
                profile: user.profile || {},
                preferences: user.preferences || {}
            }
        });

    } catch (error) {
        console.error('❌ Profile fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch profile'
        });
    }
});

// PUT /api/users/profile - Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
    try {
        const updates = req.body;
        const user = req.user;

        // Safe fields that can be updated
        const allowedUpdates = ['name', 'profile', 'preferences'];
        const actualUpdates = {};

        allowedUpdates.forEach(field => {
            if (updates[field] !== undefined) {
                actualUpdates[field] = updates[field];
            }
        });

        // Update user
        Object.assign(user, actualUpdates);
        user.lastActivity = new Date();
        
        await user.save();

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                coins: user.coins,
                level: user.level,
                devicesRecycled: user.devicesRecycled,
                badges: user.badges,
                profile: user.profile,
                preferences: user.preferences
            }
        });

    } catch (error) {
        console.error('❌ Profile update error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile'
        });
    }
});

// GET /api/users/dashboard - Get user dashboard data
router.get('/dashboard', authenticateToken, async (req, res) => {
    try {
        const user = req.user;
        const stats = user.getDashboardStats();
        
        res.json({
            success: true,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                coins: stats.coins,
                level: stats.level,
                devicesRecycled: stats.devicesRecycled,
                badges: user.badges || [],
                totalValue: stats.totalValue,
                co2Saved: stats.co2Saved,
                nextLevelProgress: stats.nextLevelProgress,
                recentActivity: stats.recentActivity
            }
        });

    } catch (error) {
        console.error('❌ Dashboard fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard data'
        });
    }
});

// GET /api/users/leaderboard - Get leaderboard
router.get('/leaderboard', async (req, res) => {
    try {
        const { type = 'coins', limit = 10 } = req.query;
        const leaderboard = await User.getLeaderboard(parseInt(limit), type);
        
        res.json({
            success: true,
            leaderboard: leaderboard,
            type: type
        });

    } catch (error) {
        console.error('❌ Leaderboard fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch leaderboard'
        });
    }
});

// GET /api/users/stats - Get platform statistics
router.get('/stats', async (req, res) => {
    try {
        const stats = await User.getPlatformStats();
        
        res.json({
            success: true,
            stats: {
                totalUsers: stats.totalUsers,
                totalCoins: stats.totalCoins,
                totalDevicesRecycled: stats.totalDevicesRecycled,
                totalValue: stats.totalValue,
                totalCO2Saved: stats.totalCO2Saved
            }
        });

    } catch (error) {
        console.error('❌ Stats fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch statistics'
        });
    }
});

// POST /api/users/verify-token - Verify JWT token
router.post('/verify-token', authenticateToken, (req, res) => {
    res.json({
        success: true,
        message: 'Token is valid',
        user: {
            id: req.user._id,
            email: req.user.email,
            name: req.user.name,
            coins: req.user.coins || 0,
            level: req.user.level || 1
        }
    });
});

// Health check for user routes
router.get('/health', (req, res) => {
    res.json({
        success: true,
        service: 'User API',
        status: 'operational',
        features: ['Registration', 'Login', 'Profile Management', 'Dashboard'],
        timestamp: new Date().toISOString()
    });
});

module.exports = router;