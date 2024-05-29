const express = require('express');
const request = require('supertest');
const app = express();

describe('PATCH /books/:id', () => {
  it('should update an existing book', async () => {
    const updatedBook = {
      title: '1984',
      author: 'George Orwell',
      genre: 'Dystopian'
    };
    const response = await request(app)
      .patch('/books/1') // Make sure the ID exists in your test DB
      .send(updatedBook);
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(updatedBook.title);
    expect(response.body.author).toBe(updatedBook.author);
    expect(response.body.genre).toBe(updatedBook.genre);
  });
});
