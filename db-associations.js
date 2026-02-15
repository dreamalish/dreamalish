const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
});

const userModel = require('./models/userModel')(sequelize, DataTypes);
const dreamModel = require('./models/dreamModel')(sequelize, DataTypes);
const commentModel = require('./models/commentModel')(sequelize, DataTypes);

// Associations
userModel.hasMany(dreamModel);
dreamModel.belongsTo(userModel);

dreamModel.hasMany(commentModel);
commentModel.belongsTo(dreamModel);

userModel.hasMany(commentModel);
commentModel.belongsTo(userModel);

module.exports = {
  sequelize,
  userModel,
  dreamModel,
  commentModel
};
