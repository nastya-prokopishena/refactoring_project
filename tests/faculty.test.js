const request = require('supertest');
const express = require('express');
const { Faculty } = require('../models');
const fetchData = require('../utils/fetchData');
const router = require('../routes/facultyRouter');

const app = express();
app.use(router);

jest.mock('../utils/fetchData');

describe('GET /fetch-select-data/faculties', () => {
  it('повертає дані факультетів зі статусом 200', async () => {
    const mockResponse = {
      status: 200,
      body: [
        { faculty_id: 1, name: 'Біологічний факультет>' },
        { faculty_id: 2, name: 'Географічний факультет' },
      ]
    };
    
    fetchData.mockResolvedValue(mockResponse);

    const response = await request(app).get('/fetch-select-data/faculties');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResponse.body);
  });

  it('повертає помилку, якщо fetchData не вдалося', async () => {
    const mockErrorResponse = {
      status: 500,
      body: { error: 'Internal Server Error' }
    };

    fetchData.mockResolvedValue(mockErrorResponse);

    const response = await request(app).get('/fetch-select-data/faculties');

    expect(response.status).toBe(500);
    expect(response.body).toEqual(mockErrorResponse.body);
  });
  it('викликає fetchData з правильними аргументами', async () => {
    const mockResponse = {
      status: 200,
      body: []
    };
  
    fetchData.mockResolvedValue(mockResponse);
  
    await request(app).get('/fetch-select-data/faculties');
  
    expect(fetchData).toHaveBeenCalledWith(Faculty, ['faculty_id', 'name']);
  });
  
});
