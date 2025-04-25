const request = require('supertest');
const express = require('express');
const { Dormitories } = require('../models'); 
const router = require('../routes/dormitoryRouter'); 

const app = express();
app.use(router); 

jest.mock('../models', () => ({
  Dormitories: {
    findOne: jest.fn(),
  },
}));

describe('GET /fetch-select-data/dormitories/:dormitoryId', () => {
  it('returns dormitory data if the dormitory is found', async () => {
    const mockData = {
      address: 'ул. Лесі Українки, 10',
      phone_number: '1234567890',
      type_residents: 'students',
      price_id: 2,
    };

    Dormitories.findOne.mockResolvedValue(mockData);

    const response = await request(app)
      .get('/fetch-select-data/dormitories/1') 
      .expect(200);

    expect(response.body).toEqual(mockData);
    expect(Dormitories.findOne).toHaveBeenCalledWith({
      where: { dormitory_id: '1' },
      attributes: ['address', 'phone_number', 'type_residents', 'price_id'],
    });
  });

  it('returns an error if the dormitory is not found', async () => {
    Dormitories.findOne.mockResolvedValue(null);
  
    const response = await request(app)
      .get('/fetch-select-data/dormitories/999') 
      .expect(500);
  
    expect(response.body).toEqual({ error: 'Гуртожиток з ID 999 не знайдено' });
  });  

  it('returns an error if there is an internal server error', async () => {
    Dormitories.findOne.mockRejectedValue(new Error('Some internal error'));

    const response = await request(app)
      .get('/fetch-select-data/dormitories/1')
      .expect(500);

    expect(response.body).toEqual({ error: 'Some internal error' });
  });
});
