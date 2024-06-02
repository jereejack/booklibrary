document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'http://localhost:3000';
    const tokenKey = 'authToken';

    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const addBookForm = document.getElementById('add-book-form');
    
    // Event Listener for Registration Form
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('register-username').value;
            const password = document.getElementById('register-password').value;
            const role = document.getElementById('register-role').value;
            try {
                await axios.post(`${apiUrl}/register`, { username, password, role });
                alert('Registration successful!');
            } catch (err) {
                console.error(err);
                alert('Registration failed.');
            }
        });
    }

    // Event Listener for Login Form
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;
            try {
                const response = await axios.post(`${apiUrl}/login`, { username, password });
                localStorage.setItem(tokenKey, response.data.token);
                window.location.href = 'books.html';
            } catch (err) {
                console.error(err);
                alert('Login failed.');
            }
        });
    }

    // Function to Fetch and Display Books
    async function fetchBooks() {
        try {
            const response = await axios.get(`${apiUrl}/books`);
            const books = response.data;
            const booksList = document.getElementById('books-list');
            booksList.innerHTML = books.map(book => `
                <div class="book-item">
                    <h3>${book.title}</h3>
                    <p>Author: ${book.author}</p>
                    <p>Genre: ${book.genre}</p>
                    ${window.location.pathname.endsWith('books.html') ? `
                    <button onclick="deleteBook(${book.id})">Delete</button>
                    <button onclick="editBook(${book.id})">Edit</button>
                    ` : ''}
                </div>
            `).join('');
        } catch (err) {
            console.error(err);
            alert('Failed to fetch books.');
        }
    }

    // Function to Add a New Book
    async function addBook(title, author, genre) {
        const token = localStorage.getItem(tokenKey);
        try {
            await axios.post(`${apiUrl}/books`, { title, author, genre }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            fetchBooks();
        } catch (err) {
            console.error(err);
            alert('Failed to add book.');
        }
    }

    // Event Listener for Add Book Form
    if (addBookForm) {
        addBookForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const title = document.getElementById('book-title').value;
            const author = document.getElementById('book-author').value;
            const genre = document.getElementById('book-genre').value;
            await addBook(title, author, genre);
        });
    }

    // Function to Delete a Book
    async function deleteBook(id) {
        const token = localStorage.getItem(tokenKey);
        try {
            await axios.delete(`${apiUrl}/books/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            fetchBooks();
        } catch (err) {
            console.error(err);
            alert('Failed to delete book.');
        }
    }

    // Function to Edit a Book
    function editBook(id) {
        const title = prompt("Enter new title:");
        const author = prompt("Enter new author:");
        const genre = prompt("Enter new genre:");
        if (title || author || genre) {
            updateBook(id, title, author, genre);
        }
    }

    // Function to Update a Book
    async function updateBook(id, title, author, genre) {
        const token = localStorage.getItem(tokenKey);
        try {
            await axios.patch(`${apiUrl}/books/${id}`, { title, author, genre }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            fetchBooks();
        } catch (err) {
            console.error(err);
            alert('Failed to update book.');
        }
    }

    // Load Books on Page Load
    if (document.getElementById('books-list')) {
        fetchBooks();
    }

    // Attach functions to global scope for inline event handlers
    window.deleteBook = deleteBook;
    window.editBook = editBook;
});
