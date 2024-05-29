
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const cors = require('cors');
const url = require('url');

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



app.get("/index", (req, res) => {
  res.sendFile(_dirname + "/frontend/index.html");
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];

    if (user && bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization');
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) return res.sendStatus(403);
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

app.post('/books', authenticateJWT, async (req, res) => {
    if (req.user.role !== 'librarian') return res.sendStatus(403);
    const { title, author, genre } = req.body;
    const result = await pool.query('INSERT INTO books (title, author, genre) VALUES ($1, $2, $3) RETURNING *', [title, author, genre]);
    res.json(result.rows[0]);
});

app.patch('/books/:id', authenticateJWT, async (req, res) => {
    if (req.user.role !== 'librarian') return res.sendStatus(403);
    const { id } = req.params;
    const { title, author, genre } = req.body;
    const result = await pool.query('UPDATE books SET title = $1, author = $2, genre = $3 WHERE id = $4 RETURNING *', [title, author, genre, id]);
    res.json(result.rows[0]);
});

app.delete('/books/:id', authenticateJWT, async (req, res) => {
    if (req.user.role !== 'librarian') return res.sendStatus(403);
    const { id } = req.params;
    await pool.query('DELETE FROM books WHERE id = $1', [id]);
    res.sendStatus(204);
});

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
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
