const request = require('supertest');
const express = require('express');
const { Price } = require('../models');
const fetchData = require('../utils/fetchData');
const app = express();
const router = require('../routes/priceRouter'); 

jest.mock('../models', () => {
  return {
    Price: {
      findOne: jest.fn(),
    },
  };
});

jest.mock('../utils/fetchData', () => jest.fn());

app.use(router);

describe('Price Routes', () => {
  describe('GET /fetch-select-data/price/:priceId', () => {
    it('should return price data when priceId is found', async () => {
      const mockPriceData = { price_amount: 100 };
      Price.findOne.mockResolvedValue(mockPriceData);

      const response = await request(app).get('/fetch-select-data/price/1');
      expect(response.status).toBe(200);
      expect(response.body.price_amount).toBe(100);
    });

    it('should return error message if price is not found', async () => {
      Price.findOne.mockResolvedValue(null);

      const response = await request(app).get('/fetch-select-data/price/999');
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Ціна з ID 999 не знайдена');
    });

    it('should handle server errors', async () => {
      Price.findOne.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/fetch-select-data/price/1');
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Database error');
    });
  });

  describe('GET /prices', () => {
    it('should return a list of prices', async () => {
      const mockData = {
        status: 200,
        body: [
          { price_id: 1, price_amount: 100 },
          { price_id: 2, price_amount: 200 },
        ],
      };
      fetchData.mockResolvedValue(mockData);

      const response = await request(app).get('/prices');
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
      expect(response.body[0].price_amount).toBe(100);
    });

    it('should handle fetchData errors', async () => {
      const mockData = {
        status: 500,
        body: { error: 'Failed to fetch data' },
      };
      fetchData.mockResolvedValue(mockData);

      const response = await request(app).get('/prices');
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Failed to fetch data');
    });
  });
});
