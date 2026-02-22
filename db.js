Backend .env:  PG_USER = postgres
PORT = 3002
NAME = dreamalish
JWT_SECRET = ********
PG_PASS = ‘*********’
DATABASE_URL = postgresql://postgres:abc123!@localhost/dreamalish


db.js:

// db.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const DATABASE_URL = process.env.DATABASE_URL;

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

module.exports = sequelize;

