const {
    getAllBooks,
    createBook,
    updateBook,
    deleteBook,
  } = require('../models/bookModel');
  
  const listBooks = async (req, res) => {
    const books = await getAllBooks();
    res.json(books);
  };
  
  const addBook = async (req, res) => {
    const { title, author, genre } = req.body;
    const book = await createBook(title, author, genre);
    res.status(201).json(book);
  };
  
  const modifyBook = async (req, res) => {
    const { id } = req.params;
    const { title, author, genre } = req.body;
    const book = await updateBook(id, title, author, genre);
    res.json(book);
  };
  
  const removeBook = async (req, res) => {
    const { id } = req.params;
    await deleteBook(id);
    res.status(204).send();
  };
  
  module.exports = {
    listBooks,
    addBook,
    modifyBook,
    removeBook,
  };
  