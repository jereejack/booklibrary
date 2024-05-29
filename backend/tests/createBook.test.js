const express = require('express');
const request = require('supertest');
const app = express();

describe('POST /books', () => {
  it('should create a new book', async () => {
    const newBook = {
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      genre: 'Classic'
    };
    const response = await request(app)
      .post('/books')
      .send(newBook);
    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe(newBook.title);
    expect(response.body.author).toBe(newBook.author);
    expect(response.body.genre).toBe(newBook.genre);
  });
});
