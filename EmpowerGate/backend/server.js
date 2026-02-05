const express = require('express'); 
const cors = require('cors');       
const { Pool } = require('pg');
require('dotenv').config();

const app = express(); 

// --- MIDDLEWARE ---
app.use(cors());                    
app.use(express.json());            

// --- 🟢 STABILIZED DATABASE CONNECTION ---
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  // Manage idle timeouts to prevent abrupt termination
  idleTimeoutMillis: 30000, 
  connectionTimeoutMillis: 2000,
});

// 🛠️ CRITICAL: Prevent "throw er" by catching unexpected connection drops
pool.on('error', (err) => {
  console.error('⚠️ Unexpected error on idle client:', err.message);
  // The pool will automatically create a new client for the next request
});

// Initial connection test
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

// 2. 🔍 ELIGIBILITY CHECKER
app.post('/api/check-eligibility', async (req, res) => {
    const { age, income, gender, state, occupation } = req.body;
    try {
        const result = await pool.query('SELECT * FROM schemes');
        const allSchemes = result.rows;

        const eligibleSchemes = allSchemes.filter(scheme => {
            const isAgeEligible = age >= scheme.eligibility.minAge && age <= scheme.eligibility.maxAge;
            const isGenderEligible = scheme.eligibility.gender === 'Any' || scheme.eligibility.gender === gender;
            const isStateEligible = scheme.state === 'All India' || scheme.state === state;
            const isCategoryEligible = scheme.category === occupation || scheme.category === 'Citizens';

            return isAgeEligible && isGenderEligible && isStateEligible && isCategoryEligible;
        });

        res.json(eligibleSchemes);
    } catch (err) {
        console.error("Eligibility Error:", err);
        res.status(500).json({ error: "Filtering failed" });
    }
});

// 3. USER REGISTRATION
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

// 4. USER LOGIN
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
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (err) {
        res.status(500).json({ error: "Database error" });
    }
});

// 5. 🗑️ DELETE SCHEME
app.delete('/api/delete-scheme/:name', async (req, res) => {
    const schemeName = decodeURIComponent(req.params.name);
    try {
        await pool.query("DELETE FROM schemes WHERE name->>'en' = $1 OR name->>'hi' = $1", [schemeName]);
        res.json({ message: "Scheme deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Delete failed" });
    }
});

// 6. ADMIN: Add New Scheme
app.post('/api/admin/add-scheme', async (req, res) => {
    const { name, description, ministry, category, state, eligibility, benefits, link } = req.body;
    try {
        await pool.query(
            `INSERT INTO schemes (name, description, ministry, category, state, eligibility, benefits, link) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [JSON.stringify(name), JSON.stringify(description), ministry, category, state, JSON.stringify(eligibility), JSON.stringify(benefits), link]
        );
        res.json({ message: "Scheme added successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to add scheme" });
    }
});

// 7. SAVE A SCHEME
app.post('/api/save-scheme', async (req, res) => {
    const { username, schemeName } = req.body;
    try {
        await pool.query(
            'INSERT INTO saved_schemes (username, scheme_name) VALUES ($1, $2)',
            [username, schemeName]
        );
        res.json({ message: "Scheme saved!" });
    } catch (err) {
        res.status(400).json({ message: "Error saving scheme" });
    }
});

// 8. GET SAVED SCHEMES
app.get('/api/saved-schemes/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const result = await pool.query(
            'SELECT scheme_name FROM saved_schemes WHERE username = $1',
            [username]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: "Fetch failed" });
    }
});

// --- 🟢 START SERVER ---
const PORT = process.env.PORT || 10000; 
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is live on port ${PORT}`);
});

// Health Check
app.get('/health', (req, res) => {
    res.send('Server is healthy!');
});
