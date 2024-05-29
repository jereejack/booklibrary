// const app = require('./app');
// const port = process.env.PORT || 3000;
// const express = require('express');
// const dotenv = require('dotenv');
// const cors = require('cors');
// const pool = require('./config/db');
// const authRoutes = require('./routes/authRoutes');
// const bookRoutes = require('./routes/bookRoutes');
// const bcrypt = require('bcryptjs');
// const bodyParser = require('body-parser');




// app.use('/book-library/books', bookRoutes);
// app.use('/book-library/users', authRoutes); // Auth routes

// app.use(express.json());
// app.use(cors());

// app.use(bodyParser.json());


// // Define your route handler here
// app.get('/books', (req, res) => {
//   // fetch books from a database and send them as a response.
//   pool.query('SELECT * FROM books', (err, result) => {
//     if (err) {
//       console.error('Error executing query:', err);
//       res.status(500).send('Internal Server Error');
//     } else {
//       res.json(result.rows);
//     }
//   });
// });


// // Define your route handler here
// app.post('/users/register', (req, res) => {
//   //  register a new user with the data in req.body.
//   console.log(req.body);
//   res.send('User registration data will be processed here');
// });

// // Define your route handler here
// app.post('users/login', (req, res) => {
//   //  authenticate a user with the data in req.body.
//   console.log(req.body);
//   res.send('User login data will be processed here');
// });


// app.post("/register", async (req, res) => {
//   const { username, password } = req.body;
//   const hashedPassword = await bcrypt.hash(password, 10);
//   try {
//     await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPassword]);
//     res.status(201).send('User registered successfully');
//   } catch (err) {
//     res.status(500).send('Error registering user');
//   }
// });


// app.post("/login", async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
//     const user = result.rows[0];
//     if (user && await bcrypt.compare(password, user.password)) {
//       const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
//       res.status(200).json({ token });
//     } else {
//       res.status(401).send('Invalid credentials');
//     }
//   } catch (err) {
//     res.status(500).send('Error logging in');
//   }
// });


// function verifyToken(req, res, next) {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];
//   if (token == null) return res.sendStatus(401);

//   jwt.verify(token, secretKey, (err, user) => {
//     if (err) return res.sendStatus(403);
//     req.user = user;
//     next();
//   });
// }



// app.get("/userinfo", verifyToken, (req, res) => {
//   res.json({ user: req.user});
// });



// app.on('error', (err) => {
//   console.error('Server error:', err);
// });



// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);

// });




// const express = require('express');
// // const app = express();
// const cors = require('cors');
// const pool = require('./db');  // Ensure this points to your database connection file
// const bcrypt = require('bcryptjs');
// const bodyParser = require('body-parser');
// const jwt = require('jsonwebtoken');
// require('dotenv').config();

// app.use(cors());
// app.use(express.json());
// app.use(bodyParser.json());
// app.use(express.static('public'));

// // Utility function to authenticate token and set user role
// function authenticateToken(req, res, next) {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];
//   if (token == null) return res.sendStatus(401);

//   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//     if (err) return res.sendStatus(403);
//     req.user = user;
//     next();
//   });
// }

// // Middleware to check if user is a librarian
// function librarianOnly(req, res, next) {
//   if (req.user.role !== 'librarian') {
//     return res.sendStatus(403);
//   }
//   next();
// }

// // Public route to get books
// app.get('/books', async (req, res) => {
//   const { search } = req.query;
//   try {
//     let result;
//     if (search) {
//       result = await pool.query('SELECT * FROM books WHERE title ILIKE $1', [`%${search}%`]);
//     } else {
//       result = await pool.query('SELECT * FROM books');
//     }
//     res.json(result.rows);
//   } catch (err) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Librarian routes to manage books
// app.post('/books', authenticateToken, librarianOnly, async (req, res) => {
//   const { title, author, genre } = req.body;
//   try {
//     await pool.query('INSERT INTO books (title, author, genre) VALUES ($1, $2, $3)', [title, author, genre]);
//     res.status(201).json({ message: 'Book added successfully' });
//   } catch (err) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// app.patch('/books/:id', authenticateToken, librarianOnly, async (req, res) => {
//   const { id } = req.params;
//   const { title, author, genre } = req.body;
//   try {
//     await pool.query('UPDATE books SET title = $1, author = $2, genre = $3 WHERE id = $4', [title, author, genre, id]);
//     res.json({ message: 'Book updated successfully' });
//   } catch (err) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// app.delete('/books/:id', authenticateToken, librarianOnly, async (req, res) => {
//   const { id } = req.params;
//   try {
//     await pool.query('DELETE FROM books WHERE id = $1', [id]);
//     res.json({ message: 'Book deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Register user (reader or librarian)
// app.post('/register', async (req, res) => {
//   const { username, password, role } = req.body;
//   const hashedPassword = await bcrypt.hash(password, 10);
//   try {
//     await pool.query('INSERT INTO users (username, password, role) VALUES ($1, $2, $3)', [username, hashedPassword, role]);
//     res.status(201).send('User registered successfully');
//   } catch (err) {
//     res.status(500).send('Error registering user');
//   }
// });

// app.post('/login', async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
//     const user = result.rows[0];
//     if (user && await bcrypt.compare(password, user.password)) {
//       const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
//       res.status(200).json({ token });
//     } else {
//       res.status(401).send('Invalid credentials');
//     }
//   } catch (err) {
//     res.status(500).send('Error logging in');
//   }
// });

// app.get('/userinfo', authenticateToken, (req, res) => {
//   res.json({ user: req.user });
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });





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
