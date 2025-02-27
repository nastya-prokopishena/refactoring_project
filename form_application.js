const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/static', express.static(path.join(__dirname, 'static')));

const sequelize = new Sequelize('dormitories', 'postgres', '31220566', {
  dialect: 'postgres',
  host: 'localhost',
});

// Опис моделей
const Faculty = sequelize.define('Faculty', {
  faculty_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: DataTypes.STRING,
}, { tableName: 'faculties', freezeTableName: true,  timestamps: false });

const Specialty = sequelize.define('Specialty', {
  specialty_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: DataTypes.STRING,
  faculty_id: DataTypes.INTEGER, 
}, { tableName: 'specialties', freezeTableName: true, timestamps: false });

const Benefit = sequelize.define('Benefit', {
  benefit_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: DataTypes.STRING,
}, { tableName: 'benefits', freezeTableName: true, timestamps: false });


Faculty.hasMany(Specialty, { foreignKey: 'faculty_id' });
Specialty.belongsTo(Faculty, { foreignKey: 'faculty_id' });


const Application = sequelize.define(
  'Application',
  {
    application_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    first_name: DataTypes.STRING,
    middle_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    date_of_birth: DataTypes.DATE,
    home_address: DataTypes.STRING,
    home_city: DataTypes.STRING, 
    home_region: DataTypes.STRING,
    home_street_number: DataTypes.STRING,
    home_campus_number: DataTypes.STRING, 
    phone_number: DataTypes.STRING,
    email: DataTypes.STRING,
    faculty_id: DataTypes.INTEGER,
    specialty_id: DataTypes.INTEGER,
    benefit_id: DataTypes.INTEGER,
    
  },
  {
    tableName: 'applications',
    timestamps: true, 
  }
);

const Dormitories = sequelize.define('Dormitories', {
    dormitory_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    superintendent_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    floor_amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type_residents: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    price_id: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: 'dormitories',
    timestamps: false
  }
  );

const Price = sequelize.define('Price', {
    price_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    price_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
  },
  {tableName: 'price',
  timestamps: false}
);

// Роути для отримання даних та обробки заявок
app.get('/fetch-select-data/faculties', async (req, res) => {
  try {
    const faculties = await Faculty.findAll({ attributes: ['faculty_id', 'name'] });
    res.json(faculties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/fetch-select-data/specialties/:facultyId', async (req, res) => {
  const facultyId = req.params.facultyId;

  try {
    // Перевірка чи існує facultyId
    const faculty = await Faculty.findOne({
      where: { faculty_id: facultyId }
    });

    if (!faculty) {
      return res.status(404).json({ error: `Факультет з ID ${facultyId} не знайдено` });
    }

    // Якщо facultyId існує, витягуємо спеціальності
    const specialties = await Specialty.findAll({
      where: { faculty_id: facultyId },
      attributes: ['specialty_id', 'name'] 
    });

    res.json(specialties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




app.get('/fetch-select-data/benefits', async (req, res) => {
  try {
    const benefits = await Benefit.findAll({ attributes: ['benefit_id', 'name'] });
    res.json(benefits);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Обробник запиту для отримання даних гуртожитків за ідентифікатором
app.get('/fetch-select-data/dormitories/:dormitoryId', async (req, res) => {
  const dormitoryId = req.params.dormitoryId;

  try {
    const dormitoryData = await Dormitories.findOne({
      where: { dormitory_id: dormitoryId },
      attributes: ['address', 'phone_number', 'type_residents', 'price_id']
    });

    if (!dormitoryData) {
      return res.status(404).json({ error: 'Дані для гуртожитку не знайдено' });
    }

    res.json(dormitoryData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/fetch-select-data/price/:priceId', async (req, res) => {
  const priceId = req.params.priceId;

  try {
    const priceData = await Price.findOne({
      where: { price_id: priceId },
      attributes: ['price_amount']
    });

    if (!priceData) {
      return res.status(404).json({ error: 'Дані про ціну не знайдено' });
    }

    res.json(priceData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



app.post('/submit_application', async (req, res) => {
  try {
    const {
      first_name,
      middle_name,
      last_name,
      date_of_birth,
      home_address,
      home_street_number,
      home_campus_number,
      home_city,
      home_region,
      phone_number,
      email,
      faculty_name,
      specialty_name,
      benefit_name,
    } = req.body;


    // Отримання відповідних ID з бази даних за обраними назвами
    const faculty = await Faculty.findOne({ where: { faculty_id: faculty_name } });
    const specialty = await Specialty.findOne({ where: { specialty_id: specialty_name } });
    const benefit = await Benefit.findOne({ where: { benefit_id: benefit_name } });

    const faculty_id = faculty ? faculty.faculty_id : null;
    const specialty_id = specialty ? specialty.specialty_id : null;
    const benefit_id = benefit ? benefit.benefit_id : null;

    if (!faculty_id || !specialty_id || !benefit_id) {
      return res.status(400).json({ error: 'Невірні або відсутні дані для створення заявки.' });
    }

    // Створення нової заявки з отриманими ID
    const newApplication = await Application.create({
      first_name,
      middle_name,
      last_name,
      date_of_birth,
      home_address,
      home_street_number,
      home_campus_number,
      home_city,
      home_region,
      phone_number,
      email,
      faculty_id,
      specialty_id,
      benefit_id,
    });

    res.json({ message: 'Заявка успішно подана' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.get('/prices', async (req, res) => {
  try {
    const prices = await Price.findAll();
    res.json(prices);
  } catch (err) {
    console.error(err);
    res.status(500).send('Помилка сервера');
  }
});

// Підключення до бази даних та запуск сервера
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');

    app.listen(5500, () => {
      console.log('Server is running on port 5500');
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
