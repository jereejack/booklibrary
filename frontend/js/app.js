function libraryApp() {
    return {
      loggedIn: false,
      username: '',
      password: '',
      newBook: {
        title: '',
        author: '',
        genre: ''
      },
      books: [],
      token: '',
  
      async login() {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: this.username,
            password: this.password
          })
        });
        const data = await response.json();
        if (data.token) {
          this.token = data.token;
          this.loggedIn = true;
          this.fetchBooks();
        } else {
          alert('Login failed');
        }
      },
  
      async fetchBooks() {
        const response = await fetch('/api/books', {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        });
        this.books = await response.json();
      },
  
      async addBook() {
        const response = await fetch('/api/books', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          },
          body: JSON.stringify(this.newBook)
        });
        const book = await response.json();
        this.books.push(book);
        this.newBook = {
          title: '',
          author: '',
          genre: ''
        };
      },
  
      async deleteBook(id) {
        await fetch(`/api/books/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        });
        this.books = this.books.filter(book => book.id !== id);
      },
  
      logout() {
        this.loggedIn = false;
        this.token = '';
      }
    };
  }
  