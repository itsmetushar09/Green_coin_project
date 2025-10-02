const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust path as needed

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadsDir = path.join(__dirname, '../uploads');
        // Create uploads directory if it doesn't exist
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        // Create unique filename with timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'device-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

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
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
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

// Device value and coin calculation
const DEVICE_VALUES = {
    smartphone: { 
        coins: { excellent: 80, good: 70, fair: 60 },
        value: { excellent: 25, good: 20, fair: 15 }
    },
    laptop: { 
        coins: { excellent: 150, good: 130, fair: 120 },
        value: { excellent: 45, good: 35, fair: 25 }
    },
    tablet: { 
        coins: { excellent: 120, good: 100, fair: 80 },
        value: { excellent: 35, good: 25, fair: 18 }
    },
    charger: { 
        coins: { excellent: 15, good: 12, fair: 10 },
        value: { excellent: 8, good: 6, fair: 4 }
    },
    headphones: { 
        coins: { excellent: 40, good: 30, fair: 25 },
        value: { excellent: 15, good: 12, fair: 8 }
    },
    smartwatch: { 
        coins: { excellent: 100, good: 80, fair: 60 },
        value: { excellent: 30, good: 22, fair: 15 }
    }
};

// Simple AI device recognition (filename-based for now)
function recognizeDevice(filename) {
    const name = filename.toLowerCase();
    
    // Simple keyword matching (replace with real AI later)
    if (name.includes('phone') || name.includes('mobile') || name.includes('iphone') || name.includes('samsung')) {
        return { type: 'smartphone', confidence: 0.85 };
    }
    if (name.includes('laptop') || name.includes('computer') || name.includes('macbook') || name.includes('dell')) {
        return { type: 'laptop', confidence: 0.90 };
    }
    if (name.includes('tablet') || name.includes('ipad')) {
        return { type: 'tablet', confidence: 0.88 };
    }
    if (name.includes('charger') || name.includes('cable') || name.includes('adapter')) {
        return { type: 'charger', confidence: 0.92 };
    }
    if (name.includes('headphone') || name.includes('earphone') || name.includes('airpod')) {
        return { type: 'headphones', confidence: 0.87 };
    }
    if (name.includes('watch') || name.includes('apple watch')) {
        return { type: 'smartwatch', confidence: 0.89 };
    }
    
    // Default fallback
    return { type: 'smartphone', confidence: 0.75 };
}

// Determine device condition (simple heuristic)
function determineCondition(deviceType) {
    const conditions = ['excellent', 'good', 'fair'];
    const weights = [0.3, 0.5, 0.2]; // Most devices are in good condition
    
    const random = Math.random();
    let cumulative = 0;
    
    for (let i = 0; i < conditions.length; i++) {
        cumulative += weights[i];
        if (random <= cumulative) {
            return conditions[i];
        }
    }
    
    return 'good'; // fallback
}

// Calculate environmental impact
function calculateEnvironmentalImpact(deviceType) {
    const impacts = {
        smartphone: { co2: 5.2, energy: 12, waste: 0.15 },
        laptop: { co2: 12.8, energy: 45, waste: 2.5 },
        tablet: { co2: 8.5, energy: 28, waste: 0.8 },
        charger: { co2: 2.1, energy: 8, waste: 0.05 },
        headphones: { co2: 3.2, energy: 15, waste: 0.12 },
        smartwatch: { co2: 4.8, energy: 18, waste: 0.08 }
    };
    
    return impacts[deviceType] || impacts.smartphone;
}

// POST /api/devices/scan - Scan device image
router.post('/scan', authenticateToken, upload.single('deviceImage'), async (req, res) => {
    console.log('📸 Device scan request received');
    console.log('User:', req.user.email);
    console.log('File:', req.file ? req.file.filename : 'No file');
    
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No image file provided'
            });
        }

        console.log('🔍 Analyzing image:', req.file.filename);

        // Simulated AI processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Recognize device type
        const recognition = recognizeDevice(req.file.originalname || req.file.filename);
        const condition = determineCondition(recognition.type);
        
        // Get device values
        const deviceInfo = DEVICE_VALUES[recognition.type] || DEVICE_VALUES.smartphone;
        const coinsReward = deviceInfo.coins[condition];
        const estimatedValue = deviceInfo.value[condition];
        
        // Calculate environmental impact
        const environmentalImpact = calculateEnvironmentalImpact(recognition.type);

        const analysis = {
            deviceType: recognition.type,
            condition: condition,
            confidence: recognition.confidence,
            coinsReward: coinsReward,
            estimatedValue: estimatedValue,
            imageUrl: `/uploads/${req.file.filename}`
        };

        console.log('✅ Analysis complete:', analysis);

        res.json({
            success: true,
            message: 'Device analyzed successfully',
            analysis: analysis,
            environmentalImpact: environmentalImpact,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Device scan error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to analyze device',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// POST /api/devices/recycle - Confirm device recycling
router.post('/recycle', authenticateToken, async (req, res) => {
    console.log('♻️ Device recycle request received');
    console.log('User:', req.user.email);
    console.log('Data:', req.body);
    
    try {
        const { deviceType, condition, estimatedValue, coinsReward, location } = req.body;

        if (!deviceType || !condition || !coinsReward) {
            return res.status(400).json({
                success: false,
                message: 'Missing required recycling information'
            });
        }

        // Create recycling transaction
        const transaction = {
            id: Date.now().toString(),
            deviceType,
            condition,
            estimatedValue: parseFloat(estimatedValue) || 0,
            coinsEarned: parseInt(coinsReward) || 0,
            location: location || 'Unknown',
            timestamp: new Date()
        };

        // Update user stats
        req.user.coins += transaction.coinsEarned;
        req.user.devicesRecycled += 1;
        req.user.totalValue += transaction.estimatedValue;
        
        // Add to recycling history
        if (!req.user.recyclingHistory) {
            req.user.recyclingHistory = [];
        }
        req.user.recyclingHistory.push(transaction);

        // Calculate level based on devices recycled
        const newLevel = Math.floor(req.user.devicesRecycled / 5) + 1;
        if (newLevel > req.user.level) {
            req.user.level = newLevel;
            // Award level-up bonus
            req.user.coins += 50;
            transaction.levelUpBonus = 50;
        }

        // Check for new badges
        const newBadges = [];
        
        if (req.user.devicesRecycled === 1 && !req.user.badges.includes('First Recycle')) {
            req.user.badges.push('First Recycle');
            newBadges.push('First Recycle');
        }
        
        if (req.user.devicesRecycled === 10 && !req.user.badges.includes('Eco Warrior')) {
            req.user.badges.push('Eco Warrior');
            newBadges.push('Eco Warrior');
        }
        
        if (req.user.devicesRecycled === 50 && !req.user.badges.includes('Green Champion')) {
            req.user.badges.push('Green Champion');
            newBadges.push('Green Champion');
        }

        // Save user updates
        await req.user.save();

        console.log('✅ Recycling complete. User earned:', transaction.coinsEarned, 'coins');

        res.json({
            success: true,
            message: 'Device recycled successfully!',
            transaction: transaction,
            newBadges: newBadges,
            user: {
                coins: req.user.coins,
                level: req.user.level,
                devicesRecycled: req.user.devicesRecycled,
                badges: req.user.badges,
                totalValue: req.user.totalValue
            }
        });

    } catch (error) {
        console.error('❌ Device recycle error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process recycling',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// GET /api/devices/history - Get user's recycling history
router.get('/history', authenticateToken, async (req, res) => {
    try {
        const history = req.user.recyclingHistory || [];
        
        res.json({
            success: true,
            history: history.slice(-20), // Last 20 items
            totalDevices: req.user.devicesRecycled || 0,
            totalCoins: req.user.coins || 0
        });

    } catch (error) {
        console.error('❌ History fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch recycling history'
        });
    }
});

// GET /api/devices/stats - Get device recycling statistics
router.get('/stats', async (req, res) => {
    try {
        // This would typically aggregate from all users
        // For now, return mock statistics
        const stats = {
            totalDevicesRecycled: 52156,
            totalCoinsEarned: 2100000,
            co2Saved: 275.8, // tons
            activeUsers: 10234,
            topDeviceTypes: [
                { type: 'smartphone', count: 25678, percentage: 49.2 },
                { type: 'laptop', count: 12456, percentage: 23.9 },
                { type: 'tablet', count: 8934, percentage: 17.1 },
                { type: 'charger', count: 3567, percentage: 6.8 },
                { type: 'headphones', count: 1521, percentage: 2.9 }
            ]
        };

        res.json({
            success: true,
            stats: stats,
            lastUpdated: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Stats fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch statistics'
        });
    }
});

// Health check for device routes
router.get('/health', (req, res) => {
    res.json({
        success: true,
        service: 'Device API',
        status: 'operational',
        features: ['Image Upload', 'AI Recognition', 'Recycling Rewards'],
        timestamp: new Date().toISOString()
    });
});

module.exports = router;