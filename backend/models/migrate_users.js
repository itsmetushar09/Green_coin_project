const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') }); 

async function migrateUsers() {
    try {
        console.log('🔄 Starting user data migration...');
        
        // Connect to MongoDB
        const MONGODB_URI = process.env.MONGODB_URI;
        if (!MONGODB_URI) {
            throw new Error('MONGODB_URI not found in environment variables');
        }
        
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log('✅ Connected to MongoDB');
        
        // Get the raw collection (bypass mongoose schema validation)
        const db = mongoose.connection.db;
        const usersCollection = db.collection('users');
        
        // Find all users
        const users = await usersCollection.find({}).toArray();
        console.log(`📊 Found ${users.length} users to migrate`);
        
        let migratedCount = 0;
        let errorCount = 0;
        
        for (const user of users) {
            try {
                console.log(`🔄 Migrating user: ${user.email}`);
                
                const updates = {};
                let needsUpdate = false;
                
                // Fix missing name field
                if (!user.name && user.email) {
                    updates.name = user.email.split('@')[0];
                    needsUpdate = true;
                    console.log(`  ✅ Added name: ${updates.name}`);
                }
                
                // Fix preferences.notifications structure
                if (user.preferences && typeof user.preferences.notifications === 'object') {
                    updates['preferences.notifications'] = user.preferences.notifications.email !== false;
                    needsUpdate = true;
                    console.log(`  ✅ Fixed notifications: ${updates['preferences.notifications']}`);
                }
                
                // Fix invalid badges (convert "welcome" to "First Recycle")
                if (user.badges && Array.isArray(user.badges)) {
                    const validBadges = [
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
                    
                    const fixedBadges = user.badges.map(badge => {
                        if (badge === 'welcome') {
                            return 'First Recycle'; // Convert welcome to First Recycle
                        }
                        return validBadges.includes(badge) ? badge : null;
                    }).filter(badge => badge !== null);
                    
                    if (JSON.stringify(fixedBadges) !== JSON.stringify(user.badges)) {
                        updates.badges = fixedBadges;
                        needsUpdate = true;
                        console.log(`  ✅ Fixed badges: ${user.badges} → ${fixedBadges}`);
                    }
                }
                
                // Add missing gamification fields
                if (user.coins === undefined) {
                    updates.coins = 0;
                    needsUpdate = true;
                }
                
                if (user.level === undefined) {
                    updates.level = 1;
                    needsUpdate = true;
                }
                
                if (user.devicesRecycled === undefined) {
                    updates.devicesRecycled = 0;
                    needsUpdate = true;
                }
                
                if (user.totalValue === undefined) {
                    updates.totalValue = 0;
                    needsUpdate = true;
                }
                
                if (user.co2Saved === undefined) {
                    updates.co2Saved = 0;
                    needsUpdate = true;
                }
                
                // Add missing arrays
                if (!user.recyclingHistory) {
                    updates.recyclingHistory = [];
                    needsUpdate = true;
                }
                
                // Add missing profile object
                if (!user.profile) {
                    updates.profile = {
                        joinedDate: user.createdAt || new Date(),
                        avatar: null,
                        location: null,
                        bio: null,
                        favoriteDeviceType: null
                    };
                    needsUpdate = true;
                }
                
                // Add missing preferences
                if (!user.preferences) {
                    updates.preferences = {
                        notifications: true,
                        emailUpdates: true,
                        publicProfile: false,
                        language: 'en'
                    };
                    needsUpdate = true;
                }
                
                // Update user if needed
                if (needsUpdate) {
                    await usersCollection.updateOne(
                        { _id: user._id },
                        { $set: updates }
                    );
                    migratedCount++;
                    console.log(`  ✅ User ${user.email} migrated successfully`);
                } else {
                    console.log(`  ⏭️  User ${user.email} already up to date`);
                }
                
            } catch (error) {
                console.error(`  ❌ Error migrating user ${user.email}:`, error.message);
                errorCount++;
            }
        }
        
        console.log('\n🎉 Migration completed!');
        console.log(`✅ Successfully migrated: ${migratedCount} users`);
        console.log(`❌ Errors: ${errorCount} users`);
        console.log(`📊 Total processed: ${users.length} users`);
        
        // Verify migration by checking a few users
        console.log('\n🔍 Verifying migration...');
        const verifyUsers = await usersCollection.find({}).limit(3).toArray();
        
        for (const user of verifyUsers) {
            console.log(`✅ User ${user.email}:`);
            console.log(`   Name: ${user.name}`);
            console.log(`   Coins: ${user.coins}`);
            console.log(`   Level: ${user.level}`);
            console.log(`   Badges: ${user.badges?.length || 0}`);
            console.log(`   Notifications: ${user.preferences?.notifications}`);
        }
        
    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
        process.exit(0);
    }
}

// Run migration
if (require.main === module) {
    migrateUsers();
}

module.exports = migrateUsers;