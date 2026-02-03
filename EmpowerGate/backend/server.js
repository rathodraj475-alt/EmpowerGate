const express = require('express'); 
const cors = require('cors');       
const { Pool } = require('pg');
require('dotenv').config();

const app = express(); 

// --- MIDDLEWARE ---
app.use(cors());                    
app.use(express.json());            

// --- DATABASE CONNECTION ---
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } 
});

// Test connection and log errors
pool.connect((err) => {
    if (err) {
        console.error('🔴 Database connection error:', err.stack);
    } else {
        console.log('🟢 Connected to Neon PostgreSQL');
    }
});

// --- ROUTES ---

// 1. GET ALL SCHEMES
app.get('/api/schemes', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM schemes');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. USER REGISTRATION
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        await pool.query(
            'INSERT INTO users (username, password) VALUES ($1, $2)',
            [username, password]
        );
        res.json({ message: "Registration successful!" });
    } catch (err) {
        res.status(400).json({ message: "Username already taken." });
    }
});

// 3. USER LOGIN
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE username = $1 AND password = $2',
            [username, password]
        );
        if (result.rows.length > 0) {
            res.json({ message: "Login successful!", user: result.rows[0] });
        } else {
            res.status(401).json({ message: "Invalid username or password" });
      0 }
    } catch (err) {
        res.status(500).json({ error: "Database error" });
    }
});

// 4. SAVE A SCHEME
app.post('/api/save-scheme', async (req, res) => {
    const { username, schemeName } = req.body;
    try {
        await pool.query(
            'INSERT INTO saved_schemes (username, scheme_name) VALUES ($1, $2)',
            [username, schemeName]
        );
        res.json({ message: "Scheme saved to profile!" });
    } catch (err) {
        res.status(400).json({ message: "Scheme already saved or error occurred." });
    }
});

// 5. GET SAVED SCHEMES
app.get('/api/saved-schemes/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const result = await pool.query(
            'SELECT scheme_name FROM saved_schemes WHERE username = $1',
            [username]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: "Could not fetch saved schemes" });
    }
});

// Remove any other "const PORT" lines from earlier in the file

const PORT = process.env.PORT || 10000; 

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is live on port ${PORT}`);
});

// Optional: Add a test route to verify the server is alive
app.get('/health', (req, res) => {
    res.send('Server is healthy and running!');
});