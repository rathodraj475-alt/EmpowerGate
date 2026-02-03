const express = require('express'); // 1. Import express
const cors = require('cors');       // 2. Import cors
const app = express();              // 3. 🟢 Initialize 'app' (THIS IS MISSING)

app.use(cors());                    // 4. Enable CORS
app.use(express.json());            // 5. Enable JSON parsing

// Now your routes will work:
app.get('/api/schemes', async (req, res) => { 
    // ... logic
});
const { Pool } = require('pg');
require('dotenv').config();

// 🟢 Connect to Neon using your string from the .env file
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Required for Neon/Render
});

// 1. GET ALL SCHEMES
app.get('/api/schemes', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM schemes');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. SAVE A SCHEME
app.post('/api/save-scheme', async (req, res) => {
    const { username, schemeName } = req.body;
    try {
        await pool.query(
            'INSERT INTO saved_schemes (username, scheme_name) VALUES ($1, $2)',
            [username, schemeName]
        );
        res.json({ message: "Scheme saved!" });
    } catch (err) {
        res.status(400).json({ message: "Already saved or error" });
    }
});
// --- 👤 USER AUTHENTICATION ---

// User Registration
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

// User Login
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
        }
    } catch (err) {
        res.status(500).json({ error: "Database error" });
    }
});

// --- ❤️ SAVED SCHEMES ---

// Save a Scheme
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

// Get Saved Schemes for a User
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