const { Sequelize } = require('sequelize');

// Create a new Sequelize instance using the DATABASE_URL environment variable
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Necessary for Heroku/Render Postgres
    },
  },
  logging: false, // Disable logging; set to console.log for debugging
});

// Test the database connection
sequelize.authenticate()
  .then(() => {
    console.log('Connection to the database has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;



// sequelize.authenticate().then(() => {
//     console.log("Connected to postgres database")
// }, err => {
//     console.error(err);
// })

//db associations setup
// const userModel = require('./models/userModel')(sequelize);
// const dreamModel = require('./models/dreamModel')(sequelize);
// const commentModel