const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
});

const userModel = require('./models/userModel')(sequelize, DataTypes);
const dreamModel = require('./models/dreamModel')(sequelize, DataTypes);
const commentModel = require('./models/commentModel')(sequelize, DataTypes);
const Like = require('./models/likeModel')(sequelize, DataTypes); // ← make sure this matches your file path

// =======================
// Dream Relationships
// =======================

userModel.hasMany(dreamModel);
dreamModel.belongsTo(userModel);

// =======================
// Comment Relationships
// =======================

dreamModel.hasMany(commentModel);
commentModel.belongsTo(dreamModel);

userModel.hasMany(commentModel);
commentModel.belongsTo(userModel);

// =======================
// Like Relationships
// =======================

userModel.hasMany(Like);
Like.belongsTo(userModel);

dreamModel.hasMany(Like);
Like.belongsTo(dreamModel);

// =======================

module.exports = {
  sequelize,
  userModel,
  dreamModel,
  commentModel,
  Like // ← VERY IMPORTANT
};