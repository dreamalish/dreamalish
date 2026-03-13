const { DataTypes } = require("sequelize");
const sequelize = require('../db-associations');

module.exports = (sequelize, DataTypes) => {
    return sequelize.define("UserStats", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },

  points: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },

  dreamCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },

  commentCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },

  likesReceived: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },

  streak: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },

  lastActiveDate: {
    type: DataTypes.DATE
  }
});
}