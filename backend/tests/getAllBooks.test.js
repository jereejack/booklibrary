const express = require('express');
const request = require('supertest');
const app = express();

describe('GET /books', () => {
  it('should return all books', async () => {
    const response = await request(app).get('/books');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
