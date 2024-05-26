const pool = require('../config/db');

const getAllBooks = async () => {
  const result = await pool.query('SELECT * FROM books');
  return result.rows;
};

const createBook = async (title, author, genre) => {
  const result = await pool.query(
    'INSERT INTO books (title, author, genre) VALUES ($1, $2, $3) RETURNING *',
    [title, author, genre]
  );
  return result.rows[0];
};

const updateBook = async (id, title, author, genre) => {
  const result = await pool.query(
    'UPDATE books SET title = $1, author = $2, genre = $3 WHERE id = $4 RETURNING *',
    [title, author, genre, id]
  );
  return result.rows[0];
};

const deleteBook = async (id) => {
  await pool.query('DELETE FROM books WHERE id = $1', [id]);
};

module.exports = {
  getAllBooks,
  createBook,
  updateBook,
  deleteBook,
};



