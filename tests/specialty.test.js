const request = require('supertest');
const express = require('express');
const { Faculty, Specialty } = require('../models');
const router = require('../routes/specialtyRouter');

const app = express();
app.use(router);

jest.mock('../models');

describe('GET /fetch-select-data/specialties/:facultyId', () => {
  it('returns specialties for an existing faculty', async () => {
    const facultyId = 1;
    Faculty.findOne.mockResolvedValue({ faculty_id: facultyId });

    Specialty.findAll.mockResolvedValue([
      { specialty_id: 1, name: 'Біологія та біохімія (біологія)' },
      { specialty_id: 3, name: 'Екологія' }
    ]);

    const response = await request(app)
      .get(`/fetch-select-data/specialties/${facultyId}`)
      .expect(200);

    expect(response.body).toEqual([
      { specialty_id: 1, name: 'Біологія та біохімія (біологія)' },
      { specialty_id: 3, name: 'Екологія' }
    ]);
  });

  it('returns a 404 error if faculty is not found', async () => {
    const facultyId = 999;
    Faculty.findOne.mockResolvedValue(null);

    const response = await request(app)
      .get(`/fetch-select-data/specialties/${facultyId}`)
      .expect(404);

    expect(response.body).toEqual({
      error: `Факультет з ID ${facultyId} не знайдено`
    });
  });

  it('returns a 500 error if there is an internal server error', async () => {
    const facultyId = 1;
    Faculty.findOne.mockRejectedValue(new Error('Database error'));

    const response = await request(app)
      .get(`/fetch-select-data/specialties/${facultyId}`)
      .expect(500);

    expect(response.body).toEqual({
      error: 'Внутрішня помилка сервера'
    });
  });
  it('returns an empty array if faculty exists but has no specialties', async () => {
    const facultyId = 2;
    Faculty.findOne.mockResolvedValue({ faculty_id: facultyId });

    Specialty.findAll.mockResolvedValue([]); // No specialties found

    const response = await request(app)
      .get(`/fetch-select-data/specialties/${facultyId}`)
      .expect(200);

    expect(response.body).toEqual([]);
  });

});
