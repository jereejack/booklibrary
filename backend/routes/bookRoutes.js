const express = require('express');
const { listBooks } = require('../controllers/bookController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();


// Define route to handle GET requests to /books
router.get('/', authMiddleware, listBooks);

module.exports = router;
