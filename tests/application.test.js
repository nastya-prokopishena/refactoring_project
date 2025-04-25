const request = require('supertest');
const express = require('express');
const { Faculty, Specialty, Benefit } = require('../models');
const { ApplicationData, router } = require('../routes/applicationRouter');

jest.mock('../models');

describe('ApplicationData Class', () => {
  let appData;

  beforeEach(() => {
    appData = new ApplicationData({
        first_name: 'test_first_name',
        middle_name: 'test_middle_name',
        last_name: 'test_last_name',
        date_of_birth: '2005-05-15',
        home_address: 'test_street',
        home_street_number: '1',
        home_campus_number: '101',
        home_city: 'Львів',
        home_region: 'Львівська',
        phone_number: '0671234567',
        email: 'ivan@example.com',
        faculty_name: 'Біологічний факультет',
        specialty_name: 'Екологія',
        benefit_name: 'Немає пільги',
    });
  });

  it('should create an instance of ApplicationData', () => {
    expect(appData.first_name).toBe('test_first_name');
    expect(appData.last_name).toBe('test_last_name');
  });

  it('should validate required fields', () => {
    expect(() => appData.validate()).not.toThrow();
    
    const invalidData = new ApplicationData({ ...appData, phone_number: '' });
    expect(() => invalidData.validate()).toThrow('Відсутні обов\'язкові поля: ім\'я, прізвище, телефон або email');
  });

  it('should validate references', async () => {
    Faculty.findOne.mockResolvedValue({ faculty_id: 1 });
    Specialty.findOne.mockResolvedValue({ specialty_id: 3 });
    Benefit.findOne.mockResolvedValue({ benefit_id: 9 });
    
    await expect(appData.validateReferences()).resolves.toBeTruthy();
    
    Faculty.findOne.mockResolvedValue(null);
    await expect(appData.validateReferences()).rejects.toThrow('Невірні або відсутні дані для створення заявки');
  });

  
});

