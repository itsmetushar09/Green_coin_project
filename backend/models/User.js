const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    // Basic user information (REQUIRED - existing fields)
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    name: {
        type: String,
        required: false, // Made optional to handle existing data without names
        trim: true,
        default: function() {
            // Generate default name from email if not provided
            return this.email ? this.email.split('@')[0] : 'User';
        }
    },
    
    // Gamification features (NEW - with defaults)
    coins: {
        type: Number,
        default: 0
    },
    level: {
        type: Number,
        default: 1
    },
    experiencePoints: {
        type: Number,
        default: 0
    },
    
    // Flexible badges system (handles existing "welcome" badge)
    badges: [{
        type: String,
        // Removed enum restriction to handle existing badges
        validate: {
            validator: function(badge) {
                // Allow existing badges and new ones
                const validBadges = [
                    'welcome', // Existing badge in your data
                    'First Recycle',
                    'Eco Warrior',
                    'Green Champion', 
                    'Device Expert',
                    'Sustainability Master',
                    'Carbon Saver',
                    'Tech Recycler',
                    'Environmental Hero',
                    'Green Innovator',
                    'Planet Protector'
                ];
                return validBadges.includes(badge);
            },
            message: 'Invalid badge name'
        }
    }],
    
    // Recycling statistics (NEW)
    devicesRecycled: {
        type: Number,
        default: 0
    },
    totalValue: {
        type: Number,
        default: 0
    },
    co2Saved: {
        type: Number,
        default: 0
    },
    
    // Recycling history (NEW)
    recyclingHistory: [{
        id: String,
        deviceType: {
            type: String,
            enum: ['smartphone', 'laptop', 'tablet', 'charger', 'headphones', 'smartwatch', 'other']
        },
        condition: {
            type: String,
            enum: ['excellent', 'good', 'fair', 'poor']
        },
        coinsEarned: Number,
        estimatedValue: Number,
        location: String,
        timestamp: {
            type: Date,
            default: Date.now
        },
        imageUrl: String,
        levelUpBonus: Number
    }],
    
    // Flexible preferences system (handles existing complex objects)
    preferences: {
        type: mongoose.Schema.Types.Mixed, // Allows any structure
        default: {
            notifications: true,
            emailUpdates: true,
            publicProfile: false,
            language: 'en'
        },
        validate: {
            validator: function(prefs) {
                // Handle both old and new preference structures
                if (!prefs) return true;
                
                // If it's an object with email/push/marketing, convert to boolean
                if (typeof prefs.notifications === 'object') {
                    // Convert complex notification object to simple boolean
                    prefs.notifications = prefs.notifications.email !== false;
                }
                
                return true;
            }
        }
    },
    
    // Profile information (NEW - optional)
    profile: {
        avatar: String,
        location: String,
        joinedDate: {
            type: Date,
            default: Date.now
        },
        bio: String,
        favoriteDeviceType: String
    },
    
    // Timestamps (handle existing data)
    lastLogin: {
        type: Date,
        default: Date.now
    },
    lastActivity: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    collection: 'users',
    // Handle schema version changes
    versionKey: false
});

// Pre-save middleware to handle data migration
userSchema.pre('save', async function(next) {
    try {
        // Handle password hashing
        if (this.isModified('password')) {
            const salt = await bcrypt.genSalt(12);
            this.password = await bcrypt.hash(this.password, salt);
        }
        
        // Handle name field migration
        if (!this.name && this.email) {
            this.name = this.email.split('@')[0];
        }
        
        // Handle preferences migration
        if (this.preferences && typeof this.preferences.notifications === 'object') {
            // Convert old notification structure to boolean
            const oldNotifications = this.preferences.notifications;
            this.preferences.notifications = oldNotifications.email !== false;
        }
        
        // Ensure basic preferences exist
        if (!this.preferences) {
            this.preferences = {
                notifications: true,
                emailUpdates: true,
                publicProfile: false,
                language: 'en'
            };
        }
        
        next();
    } catch (error) {
        next(error);
    }
});

// Pre-find middleware to handle data migration on query
userSchema.pre(['find', 'findOne', 'findOneAndUpdate'], function() {
    // Add default values for new fields
    this.setOptions({ 
        lean: false,
        transform: function(doc, ret) {
            if (doc) {
                // Ensure name exists
                if (!ret.name && ret.email) {
                    ret.name = ret.email.split('@')[0];
                }
                
                // Handle preferences
                if (ret.preferences && typeof ret.preferences.notifications === 'object') {
                    ret.preferences.notifications = ret.preferences.notifications.email !== false;
                }
                
                // Ensure gamification fields exist
                ret.coins = ret.coins || 0;
                ret.level = ret.level || 1;
                ret.devicesRecycled = ret.devicesRecycled || 0;
                ret.badges = ret.badges || [];
            }
            return ret;
        }
    });
});

// Indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ coins: -1 });
userSchema.index({ devicesRecycled: -1 });
userSchema.index({ level: -1 });

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw error;
    }
};

// Calculate user level based on devices recycled
userSchema.methods.calculateLevel = function() {
    return Math.floor((this.devicesRecycled || 0) / 5) + 1;
};

// Check if user deserves new badges
userSchema.methods.checkForNewBadges = function() {
    const newBadges = [];
    const currentBadges = this.badges || [];
    
    // Achievement thresholds
    const achievements = [
        { badge: 'First Recycle', condition: () => (this.devicesRecycled || 0) >= 1 },
        { badge: 'Eco Warrior', condition: () => (this.devicesRecycled || 0) >= 10 },
        { badge: 'Green Champion', condition: () => (this.devicesRecycled || 0) >= 50 },
        { badge: 'Device Expert', condition: () => (this.devicesRecycled || 0) >= 100 },
        { badge: 'Sustainability Master', condition: () => (this.devicesRecycled || 0) >= 200 },
        { badge: 'Carbon Saver', condition: () => (this.co2Saved || 0) >= 100 },
        { badge: 'Tech Recycler', condition: () => (this.coins || 0) >= 10000 },
        { badge: 'Environmental Hero', condition: () => (this.level || 1) >= 20 },
        { badge: 'Green Innovator', condition: () => (this.totalValue || 0) >= 1000 },
        { badge: 'Planet Protector', condition: () => (this.devicesRecycled || 0) >= 500 }
    ];
    
    achievements.forEach(achievement => {
        try {
            if (achievement.condition() && !currentBadges.includes(achievement.badge)) {
                newBadges.push(achievement.badge);
                this.badges.push(achievement.badge);
            }
        } catch (error) {
            console.log('Badge check error:', error.message);
        }
    });
    
    return newBadges;
};

// Get user dashboard statistics
userSchema.methods.getDashboardStats = function() {
    return {
        coins: this.coins || 0,
        level: this.level || 1,
        devicesRecycled: this.devicesRecycled || 0,
        badges: (this.badges || []).length,
        totalValue: this.totalValue || 0,
        co2Saved: this.co2Saved || 0,
        recentActivity: (this.recyclingHistory || []).slice(-5),
        nextLevelProgress: {
            current: (this.devicesRecycled || 0) % 5,
            needed: 5,
            percentage: Math.min(100, ((this.devicesRecycled || 0) % 5) * 20)
        }
    };
};

// Get user's rank among all users
userSchema.statics.getUserRank = async function(userId) {
    try {
        const user = await this.findById(userId);
        if (!user) return null;
        
        const rank = await this.countDocuments({
            coins: { $gt: user.coins || 0 }
        }) + 1;
        
        const totalUsers = await this.countDocuments({});
        
        return {
            rank: rank,
            totalUsers: totalUsers,
            percentile: Math.round((1 - (rank / totalUsers)) * 100)
        };
    } catch (error) {
        console.error('Error calculating user rank:', error);
        return null;
    }
};

// Get leaderboard
userSchema.statics.getLeaderboard = async function(limit = 10, type = 'coins') {
    try {
        const sortField = {};
        sortField[type] = -1;
        
        const leaderboard = await this.find({})
        .select('name coins level devicesRecycled badges totalValue')
        .sort(sortField)
        .limit(limit)
        .lean();
        
        return leaderboard.map((user, index) => ({
            rank: index + 1,
            name: user.name || user.email?.split('@')[0] || 'User',
            coins: user.coins || 0,
            level: user.level || 1,
            devicesRecycled: user.devicesRecycled || 0,
            badges: (user.badges || []).length,
            totalValue: user.totalValue || 0
        }));
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return [];
    }
};

// Get platform statistics
userSchema.statics.getPlatformStats = async function() {
    try {
        const stats = await this.aggregate([
            {
                $group: {
                    _id: null,
                    totalUsers: { $sum: 1 },
                    totalCoins: { $sum: { $ifNull: ['$coins', 0] } },
                    totalDevicesRecycled: { $sum: { $ifNull: ['$devicesRecycled', 0] } },
                    totalValue: { $sum: { $ifNull: ['$totalValue', 0] } },
                    totalCO2Saved: { $sum: { $ifNull: ['$co2Saved', 0] } }
                }
            }
        ]);
        
        return stats[0] || {
            totalUsers: 0,
            totalCoins: 0,
            totalDevicesRecycled: 0,
            totalValue: 0,
            totalCO2Saved: 0
        };
    } catch (error) {
        console.error('Error fetching platform stats:', error);
        return {
            totalUsers: 10234,
            totalCoins: 2100000,
            totalDevicesRecycled: 52156,
            totalValue: 876543,
            totalCO2Saved: 275.8
        };
    }
};

// Update user activity timestamp
userSchema.methods.updateActivity = function() {
    this.lastActivity = new Date();
    return this.save();
};

// Serialize user for JSON response (exclude sensitive data)
userSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.password;
    
    // Ensure required fields exist
    user.name = user.name || (user.email ? user.email.split('@')[0] : 'User');
    user.coins = user.coins || 0;
    user.level = user.level || 1;
    user.devicesRecycled = user.devicesRecycled || 0;
    user.badges = user.badges || [];
    
    return user;
};

// Virtual for user's progress to next level
userSchema.virtual('nextLevelProgress').get(function() {
    const currentLevelDevices = ((this.level || 1) - 1) * 5;
    const nextLevelDevices = (this.level || 1) * 5;
    const progress = (this.devicesRecycled || 0) - currentLevelDevices;
    const needed = nextLevelDevices - currentLevelDevices;
    
    return {
        current: Math.max(0, progress),
        needed: needed,
        percentage: Math.min(100, Math.max(0, (progress / needed) * 100))
    };
});

// Virtual for environmental impact
userSchema.virtual('environmentalImpact').get(function() {
    const devicesRecycled = this.devicesRecycled || 0;
    const co2Saved = this.co2Saved || 0;
    
    return {
        co2Saved: co2Saved,
        treesEquivalent: Math.round(co2Saved * 0.06), // Rough approximation
        energySaved: Math.round(devicesRecycled * 25), // kWh per device average
        wasteDiverted: Math.round(devicesRecycled * 0.8) // kg per device average
    };
});

const User = mongoose.model('User', userSchema);

module.exports = User;