document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const loginSection = document.getElementById('login');
  const manageSection = document.getElementById('manage');
  const browseSection = document.getElementById('browse');

  if (token) {
      loginSection.style.display = 'none';
      manageSection.style.display = 'block';
      loadBooks();
  } else {
      loginSection.style.display = 'block';
      manageSection.style.display = 'none';
  }

  document.getElementById('loginButton').addEventListener('click', async () => {
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      const res = await fetch('http://localhost:3000/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.status === 200) {
          localStorage.setItem('token', data.token);
          loginSection.style.display = 'none';
          manageSection.style.display = 'block';
          loadBooks();
      } else {
          alert(data.message);
      }
  });

  document.getElementById('searchButton').addEventListener('click', async () => {
      const title = document.getElementById('searchTitle').value;
      const author = document.getElementById('searchAuthor').value;
      const genre = document.getElementById('searchGenre').value;
      const res = await fetch(`http://localhost:3000/books?title=${title}&author=${author}&genre=${genre}`);
      const books = await res.json();
      const bookList = document.getElementById('bookList');
      bookList.innerHTML = '';
      books.forEach(book => {
          const li = document.createElement('li');
          li.textContent = `${book.title} by ${book.author} (Genre: ${book.genre})`;
          bookList.appendChild(li);
      });
  });

  document.getElementById('showBooksButton').addEventListener('click', async () => {
      const res = await fetch('http://localhost:3000/books');
      const books = await res.json();
      const bookList = document.getElementById('bookList');
      bookList.innerHTML = '';
      books.forEach(book => {
          const li = document.createElement('li');
          li.textContent = `${book.title} by ${book.author} (Genre: ${book.genre})`;
          bookList.appendChild(li);
      });
  });

  document.getElementById('addBookButton').addEventListener('click', async () => {
      const title = document.getElementById('bookTitle').value;
      const author = document.getElementById('bookAuthor').value;
      const genre = document.getElementById('bookGenre').value;
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/books', {
          method: 'POST',
          headers: { 
              'Content-Type': 'application/json',
              'Authorization': token
          },
          body: JSON.stringify({ title, author, genre })
      });
      if (res.status === 200) {
          loadBooks();
      } else {
          alert('Error adding book');
      }
  });

  async function loadBooks() {
      const res = await fetch('http://localhost:3000/books');
      const books = await res.json();
      const manageBookList = document.getElementById('manageBookList');
      manageBookList.innerHTML = '';
      books.forEach(book => {
          const li = document.createElement('li');
          li.textContent = `${book.title} by ${book.author} (Genre: ${book.genre})`;
          manageBookList.appendChild(li);
      });
  }
});
