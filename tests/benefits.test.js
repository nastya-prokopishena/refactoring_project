const request = require('supertest');
const express = require('express');
const { Benefit } = require('../models');
const fetchData = require('../utils/fetchData');
const router = require('../routes/benefitRouter');  
jest.mock('../utils/fetchData');

describe('GET /fetch-select-data/benefits', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(router);
  });

  it('should return status 200 and benefits data', async () => {
    const mockResponse = {
      status: 200,
      body: [{ benefit_id: 1, name: 'Health Insurance' }]
    };
    fetchData.mockResolvedValue(mockResponse);

    const response = await request(app).get('/fetch-select-data/benefits');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResponse.body);
    expect(fetchData).toHaveBeenCalledWith(Benefit, ['benefit_id', 'name']);
  });

  it('should return status 500 if fetchData fails', async () => {
    const mockError = {
      status: 500,
      body: { error: 'Internal Server Error' }
    };
    fetchData.mockResolvedValue(mockError);

    const response = await request(app).get('/fetch-select-data/benefits');

    expect(response.status).toBe(500);
    expect(response.body).toEqual(mockError.body);
  });
});
