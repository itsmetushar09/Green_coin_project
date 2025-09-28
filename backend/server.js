// backend/server.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables, explicitly pointing to the project root
// The '../' goes up one level from 'backend' to 'Projectt'
dotenv.config({ path: '../.env' });
 

// Import routes
const userRoutes = require('../routes/userRoutes');


// ... (rest of the code) ...







const app = express();

// Middleware: CORS to allow frontend access
// Note: In production, restrict origin to your actual domain
app.use(cors()); 
app.use(express.json()); // Body parser for JSON requests

// --- Database Connection ---
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected successfully!'))
    .catch(err => console.error('MongoDB connection error:', err));

// --- API Routes ---
// Base route for user authentication and dynamic data
app.use('/api/users', userRoutes); 

// Error handling (simple example)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));