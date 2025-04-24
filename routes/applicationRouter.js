const express = require('express');
const { Faculty, Specialty, Benefit, Application } = require('../models');

const router = express.Router();

const ROUTES = {
  SUBMIT_APPLICATION: '/submit_application',
};

// Introduce Parameter Object — групування пов'язаних параметрів у єдиний об'єкт applicationData
class ApplicationData {
  constructor(data) {
    this.first_name = data.first_name;
    this.middle_name = data.middle_name;
    this.last_name = data.last_name;
    this.date_of_birth = data.date_of_birth;
    this.home_address = data.home_address;
    this.home_street_number = data.home_street_number;
    this.home_campus_number = data.home_campus_number;
    this.home_city = data.home_city;
    this.home_region = data.home_region;
    this.phone_number = data.phone_number;
    this.email = data.email;
    this.faculty_name = data.faculty_name;
    this.specialty_name = data.specialty_name;
    this.benefit_name = data.benefit_name;
  }

  validate() {
    if (!this.first_name || !this.last_name || !this.phone_number || !this.email) {
      throw new Error('Відсутні обов\'язкові поля: ім\'я, прізвище, телефон або email');
    }
  }

  async validateReferences() {
    const [faculty, specialty, benefit] = await Promise.all([
      Faculty.findOne({ where: { faculty_id: this.faculty_name } }),
      Specialty.findOne({ where: { specialty_id: this.specialty_name } }),
      Benefit.findOne({ where: { benefit_id: this.benefit_name } }),
    ]);

    if (!faculty || !specialty || !benefit) {
      throw new Error('Невірні або відсутні дані для створення заявки');
    }

    this.faculty_id = faculty.faculty_id;
    this.specialty_id = specialty.specialty_id;
    this.benefit_id = benefit.benefit_id;

    return this;
  }

  toApplicationModel() {
    return {
      first_name: this.first_name,
      middle_name: this.middle_name,
      last_name: this.last_name,
      date_of_birth: this.date_of_birth,
      home_address: this.home_address,
      home_street_number: this.home_street_number,
      home_campus_number: this.home_campus_number,
      home_city: this.home_city,
      home_region: this.home_region,
      phone_number: this.phone_number,
      email: this.email,
      faculty_id: this.faculty_id,
      specialty_id: this.specialty_id,
      benefit_id: this.benefit_id,
    };
  }
}

async function createApplication(applicationData) {
  return Application.create(applicationData);
}

router.post(ROUTES.SUBMIT_APPLICATION, async (req, res) => {
  try {
    const appData = new ApplicationData(req.body);

    appData.validate();

    await appData.validateReferences();

    await createApplication(appData.toApplicationModel());

    res.json({ message: 'Заявка успішно подана' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;