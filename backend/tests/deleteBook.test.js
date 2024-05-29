const express = require('express');
const request = require('supertest');
const app = express();

describe('DELETE /books/:id', () => {
  it('should delete a book', async () => {
    const response = await request(app).delete('/books/1'); // Make sure the ID exists in your test DB
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Book deleted');
  });
});
