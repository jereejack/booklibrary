// const express = require('express');
// const authRoutes = require('./routes/authRoutes');
// const bookRoutes = require('./routes/bookRoutes');
// const dotenv = require('dotenv');

// const bodyParser = require('body-parser');
// const cors = require('cors');

// const app = express();
// const port = process.env.PORT || 3000;



// app.use(bodyParser.json());
// app.use(cors()); // Enable CORS

// app.use(express.json());

// // Register routes
// app.use('/api/auth', authRoutes);
// app.use('/api/books', bookRoutes);

// // Test route to check server status
// app.get('/api/test-db', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT NOW()');
//     res.status(200).json(result.rows);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.get('/', (req, res) => {
//   res.send('Server is running');
// });


// app.get('/test-database', async (req, res) => {
//     try {
//       const result = await pool.query('SELECT NOW()');
//       res.status(200).json({ message: 'Database connection successful', result });
//   } catch (error) {
//     console.error('Error connecting to database:', error);
//     res.status(500).json({ error: 'Database connection failed' });
//   }
// });

// module.exports = app;


