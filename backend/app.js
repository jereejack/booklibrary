const express = require('express');
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const dotenv = require('dotenv');

require('dotenv').config();


const app = express();

app.use(express.json());

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

// Test route to check server status
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('Server is running');
});

module.exports = app;
