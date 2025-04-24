const express = require('express');
const path = require('path');
const { sequelize } = require('./models');

// Import routers
const facultyRouter = require('./routes/facultyRouter');
const specialtyRouter = require('./routes/specialtyRouter');
const benefitRouter = require('./routes/benefitRouter');
const dormitoryRouter = require('./routes/dormitoryRouter');
const priceRouter = require('./routes/priceRouter');
const applicationRouter = require('./routes/applicationRouter');

const app = express();
// Replacing magic numbers and strings with constants
const PORT = 5500;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Use __dirname directly in CommonJS
app.use('/static', express.static(path.join(__dirname, 'static')));

// Register routers
app.use(facultyRouter);
app.use(specialtyRouter);
app.use(benefitRouter);
app.use(dormitoryRouter);
app.use(priceRouter);
app.use(applicationRouter);

// Підключення до бази даних та запуск сервера
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');

    app.listen(PORT, () => {
      console.log('Server is running on port 5500');
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });