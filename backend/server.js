// backend/server.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

 dotenv.config({ path: path.resolve(__dirname, '../.env') }); 

// Import routes
const userRoutes = require('./routes/userRoutes'); 


// ... (rest of the code) ...   



const app = express();

// Middleware: CORS to allow frontend access
// Note: In production, restrict origin to your actual domain
app.use(cors()); 
app.use(express.json()); // Body parser for JSON requests

// --- Database Connection ---
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected successfully!'))
    .catch(err => console.error('MongoDB connection error:', err));

// --- API Routes ---
// Base route for user authentication and dynamic data
app.use('/api/users', userRoutes); 
app.use(express.static(path.join(__dirname, '../public/frontend'))); // Correct for assets
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html')); // <--- ERROR 2: Path is wrong
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));