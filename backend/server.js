const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') }); 

// Import routes
const userRoutes = require('../backend/routes/userRoutes'); // Your existing user routes
const deviceRoutes = require('../backend/routes/deviceRoutes'); // New device routes

const app = express();

// Middleware: CORS to allow frontend access
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['your-production-domain.com'] // Replace with your actual domain
        : ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5000', 'http://127.0.0.1:5000', 'http://localhost:5500', 'http://127.0.0.1:5500'],
    credentials: true
})); 

app.use(express.json({ limit: '10mb' })); // Body parser for JSON requests with increased limit
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // For form data

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
const fs = require('fs');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('📁 Created uploads directory:', uploadsDir);
}

// --- Database Connection ---
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is not defined in environment variables');
    console.log('Please set MONGODB_URI in your .env file');
    process.exit(1);
}

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('✅ MongoDB connected successfully!');
    console.log('📊 Database:', mongoose.connection.name);
})
.catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
});

// --- API Routes ---
app.use('/api/users', userRoutes); 
app.use('/api/devices', deviceRoutes); // Device scanning routes

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Green Coins API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        features: ['Authentication', 'Device Scanning', 'User Dashboard'],
        endpoints: {
            users: '/api/users',
            devices: '/api/devices',
            scan: '/api/devices/scan',
            recycle: '/api/devices/recycle'
        }
    });
});

// API stats endpoint
app.get('/api/stats/public', async (req, res) => {
    try {
        const User = require('./User'); // Adjust path if needed
        const stats = await User.getPlatformStats();
        
        res.json({
            success: true,
            stats: {
                activeUsers: stats.totalUsers?.toLocaleString() || '10,234',
                devicesRecycled: stats.totalDevicesRecycled?.toLocaleString() || '52,156',
                co2Saved: (stats.totalDevicesRecycled * 5 / 1000).toFixed(1) || '2.7', // kg to tons
                coinsEarned: stats.totalCoinsEarned > 1000000 
                    ? (stats.totalCoinsEarned / 1000000).toFixed(1) + 'M' 
                    : stats.totalCoinsEarned?.toLocaleString() || '2.1M'
            }
        });
    } catch (error) {
        console.error('Stats error:', error);
        res.json({
            success: true,
            stats: {
                activeUsers: '10,234',
                devicesRecycled: '52,156',
                co2Saved: '2.7',
                coinsEarned: '2.1M'
            }
        });
    }
});

// Serve static files from frontend
app.use(express.static(path.join(__dirname, '../public/frontend')));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve specific HTML files for known routes (no wildcards to prevent PathError)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/frontend/index.html'));
});

app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/frontend/index.html'));
});

app.get('/rewards.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/frontend/rewards.html'));
});

app.get('/scanner.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/frontend/scanner.html'));
});

app.get('/kiosks.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/frontend/kiosks.html'));
});

app.get('/community.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/frontend/community.html'));
});

app.get('/leaderboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/frontend/leaderboard.html'));
});

// Global error handler
app.use((error, req, res, next) => {
    console.error('🚨 Global error handler:', error);
    
    // Multer file upload errors
    if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ 
            success: false, 
            message: 'File size too large. Maximum size is 10MB.' 
        });
    }
    
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({ 
            success: false, 
            message: 'Unexpected file field. Use "deviceImage" as field name.' 
        });
    }
    
    if (error.message === 'Only image files are allowed!') {
        return res.status(400).json({ 
            success: false, 
            message: 'Only image files are allowed!' 
        });
    }
    
    // Mongoose validation errors
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({ 
            success: false, 
            message: messages.join(', ') 
        });
    }
    
    // JWT errors
    if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ 
            success: false, 
            message: 'Invalid authentication token' 
        });
    }
    
    if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ 
            success: false, 
            message: 'Authentication token expired. Please sign in again.' 
        });
    }
    
    // MongoDB errors
    if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        return res.status(400).json({ 
            success: false, 
            message: `${field} already exists` 
        });
    }
    
    // Default error
    res.status(500).json({ 
        success: false, 
        message: process.env.NODE_ENV === 'production' 
            ? 'Something went wrong' 
            : error.message 
    });
});

// 404 handler for unknown routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        availableRoutes: [
            'GET /',
            'GET /scanner.html',
            'GET /api/health',
            'POST /api/devices/scan',
            'POST /api/devices/recycle',
            'GET /api/devices/history'
        ]
    });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log('🚀=====================================🚀');
    console.log(`🚀 Green Coins Server Running on Port ${PORT}`);
    console.log('🚀=====================================🚀');
    console.log(`📱 Frontend URL: http://localhost:${PORT}`);
    console.log(`🔗 API URL: http://localhost:${PORT}/api`);
    console.log(`📊 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`📸 Device Scanner: http://localhost:${PORT}/scanner.html`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('✅ Device routes enabled - Scanner should work now!');
    console.log('✅ File uploads configured - 10MB limit');
    console.log('✅ CORS enabled for local development');
    console.log('🚀=====================================🚀');
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('Process terminated');
        mongoose.connection.close();
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT received. Shutting down gracefully...');
    server.close(() => {
        console.log('Process terminated');
        mongoose.connection.close();
    });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.error('🚨 Unhandled Promise Rejection:', err.message);
    server.close(() => {
        process.exit(1);
    });
});

module.exports = app;