
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
// const pool = require('./db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const cors = require('cors');
// const url = require('url');

dotenv.config();


const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});


app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static('public'));





app.post('/register', async (req, res) => {
    const { username, password, role } = req.body;
    if (!username || !password || !role) {
      return res.status(400).json({ message: 'Username, password, and role are required' });
    }
    try {
      const hashedPassword = bcrypt.hashSync(password, 10);
      const result = await pool.query('INSERT INTO public.users (username, password, role) VALUES ($1, $2, $3) RETURNING *', [username, hashedPassword, role]);
      res.status(201).json({ message: 'User created', user: result.rows[0] });
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: 'Error registering user' });
    }
  });







app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
      const result = await pool.query('SELECT * FROM public.users WHERE username = $1', [username]);
      const user = result.rows[0];
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({ id: user.username, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: 'Error logging in' });
    }
  });




  const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader;
    if (!token) return res.sendStatus(401);
  
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };






app.get('/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM public.users');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'error fetching users' });
    }
});


app.post('/books', authenticateJWT, async (req, res) => {
    if (req.user.role !== 'librarian') return res.sendStatus(403);
    const { title, author, genre } = req.body;
    try {
      const result = await pool.query(
        'INSERT INTO books (title, author, genre) VALUES ($1, $2, $3) RETURNING *',
        [title, author, genre]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error adding book' });
    }
  });



// Update a book
app.patch('/books/:id', authenticateJWT, async (req, res) => {
    if (req.user.role !== 'librarian') return res.sendStatus(403);

    const { id } = req.params;
    const { title, author, genre } = req.body;
    try {
      const result = await pool.query(
        'UPDATE books SET title = COALESCE($1, title), author = COALESCE($2, author), genre = COALESCE($3, genre) WHERE id = $4 RETURNING *',
        [title, author, genre, id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Book not found' });
      }
      res.json(result.rows[0]);
    } catch (err) {
      console.error('Error updating book', err);
      res.status(500).json({ message: 'Error updating book', error: err.message});
    }
  });



// Delete a book
app.delete('/books/:id', authenticateJWT, async (req, res) => {
    if (req.user.role !== 'librarian') return res.sendStatus(403);
    const { id } = req.params;
    try {
      await pool.query('DELETE FROM books WHERE id = $1', [id]);
      res.sendStatus(204);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error deleting book' });
    }
  });


  

// Get all books or search books
app.get('/books', async (req, res) => {
    const { search } = req.query;
    try {
      let result;
      if (search) {
        result = await pool.query('SELECT * FROM books WHERE title ILIKE $1', [`%${search}%`]);
      } else {
        result = await pool.query('SELECT * FROM books');
      }
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error fetching books' });
    }
  });

  
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
