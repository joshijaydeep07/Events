// server.js — UniEvents Backend (Node.js + Express + PostgreSQL)
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ─── PostgreSQL Configuration ──────────────────────────────────────────────────
// ⚠️  Update these values to match your local PostgreSQL setup
const DB_CONFIG = {
  host:     'localhost',
  port:     5432,
  user:     'postgres',       // ← your PostgreSQL username
  password: 'JAYDEEPJ12345',               // ← your PostgreSQL password
};

let pool;

// ─── DB Initialisation ─────────────────────────────────────────────────────────
async function initDB() {
  // Connect to default 'postgres' DB first to create 'unievents' if needed
  const adminPool = new Pool({ ...DB_CONFIG, database: 'postgres' });

  const { rows } = await adminPool.query(
    `SELECT 1 FROM pg_database WHERE datname = $1`, ['unievents']
  );

  if (rows.length === 0) {
    await adminPool.query(`CREATE DATABASE unievents`);
    console.log('✅ Created database: unievents');
  }
  await adminPool.end();

  // Main pool connected to unievents
  pool = new Pool({ ...DB_CONFIG, database: 'unievents' });

  // Create table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS registrations (
      id          SERIAL PRIMARY KEY,
      full_name   VARCHAR(150)  NOT NULL,
      student_id  VARCHAR(50)   NOT NULL,
      email       VARCHAR(200)  NOT NULL,
      event_name  VARCHAR(150)  NOT NULL,
      department  VARCHAR(100)  NOT NULL,
      phone       VARCHAR(20)   NOT NULL,
      notes       TEXT,
      created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('✅ Table ready.');
}

// ─── Routes ───────────────────────────────────────────────────────────────────

// POST /api/register
app.post('/api/register', async (req, res) => {
  const { full_name, student_id, email, event_name, department, phone, notes } = req.body;

  if (!full_name || !student_id || !email || !event_name || !department || !phone) {
    return res.status(400).json({ error: 'All required fields must be filled.' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO registrations (full_name, student_id, email, event_name, department, phone, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [full_name, student_id, email, event_name, department, phone, notes || null]
    );
    res.status(201).json({ message: 'Registration successful!', id: result.rows[0].id });
  } catch (err) {
    console.error('DB error:', err.message);
    res.status(500).json({ error: 'Database error. Please try again.' });
  }
});

// GET /api/registrations
app.get('/api/registrations', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM registrations ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('DB error:', err.message);
    res.status(500).json({ error: 'Could not fetch registrations.' });
  }
});

// GET /api/registrations/:id
app.get('/api/registrations/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM registrations WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found.' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error.' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', db: 'PostgreSQL', timestamp: new Date().toISOString() });
});

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ─── Start ────────────────────────────────────────────────────────────────────
initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 UniEvents running at http://localhost:${PORT}`);
      console.log(`   Database: PostgreSQL`);
      console.log(`   Press Ctrl+C to stop`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to PostgreSQL:', err.message);
    console.error('   → Check that PostgreSQL is running and credentials in server.js are correct.');
    process.exit(1);
  });
