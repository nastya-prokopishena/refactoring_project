const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('dormitories', 'postgres', '31220566', {
  dialect: 'postgres',
  host: 'localhost',
});

// Faculty model
const Faculty = sequelize.define('Faculty', {
  faculty_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: DataTypes.STRING,
}, { tableName: 'faculties', freezeTableName: true, timestamps: false });

// Specialty model
const Specialty = sequelize.define('Specialty', {
  specialty_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: DataTypes.STRING,
  faculty_id: DataTypes.INTEGER, 
}, { tableName: 'specialties', freezeTableName: true, timestamps: false });

// Benefit model
const Benefit = sequelize.define('Benefit', {
  benefit_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: DataTypes.STRING,
}, { tableName: 'benefits', freezeTableName: true, timestamps: false });

// Dormitories model
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
});

// Price model
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
{
  tableName: 'price',
  timestamps: false
});

// Application model
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

// Define relationships
Faculty.hasMany(Specialty, { foreignKey: 'faculty_id' });
Specialty.belongsTo(Faculty, { foreignKey: 'faculty_id' });

module.exports = {
  sequelize,
  Faculty,
  Specialty,
  Benefit,
  Dormitories,
  Price,
  Application
};