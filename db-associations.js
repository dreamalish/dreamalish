/*const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: isProduction
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      }
    : {},
  logging: false,
});
*/
const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

let dbUrl = process.env.DATABASE_URL;

// Force SSL for Render external connections
if (!dbUrl.includes("sslmode")) {
  dbUrl += "?sslmode=require";
}

const sequelize = new Sequelize(dbUrl, {
  dialect: "postgres",
  logging: false
});

const userModel = require('./models/userModel')(sequelize, DataTypes);
const dreamModel = require('./models/dreamModel')(sequelize, DataTypes);
const commentModel = require('./models/commentModel')(sequelize, DataTypes);
const Like = require('./models/likeModel')(sequelize, DataTypes); // ← make sure this matches your file path
const socialEdgeModel = require('./models/socialEdge')(sequelize, DataTypes);
const notificationsModel =
  require('./models/notificationsModel')(sequelize, DataTypes);
const userStats = require("./models/userStats")(sequelize, DataTypes);

// Dream relationships
userModel.hasMany(dreamModel, {
  foreignKey: "UserId"   // match the DB column exactly
});

dreamModel.belongsTo(userModel, {
  foreignKey: "UserId",  // match the DB column exactly
  as: "User"             // give it an alias so dream.User works
});


// =======================
// Comment Relationships
// =======================

dreamModel.hasMany(commentModel, { foreignKey: 'DreamId' });
commentModel.belongsTo(dreamModel, { foreignKey: 'DreamId' });

userModel.hasMany(commentModel, { foreignKey: 'UserId' });
commentModel.belongsTo(userModel, { foreignKey: 'UserId' });

// =======================
// Like Relationships
// =======================

userModel.hasMany(Like, { foreignKey: 'userId' });
Like.belongsTo(userModel, { foreignKey: 'userId' });

dreamModel.hasMany(Like, { foreignKey: 'dreamId' });
Like.belongsTo(dreamModel, { foreignKey: 'dreamId' });

// socialEdge
//=======================

userModel.belongsToMany(userModel, {
  as: "Requestees",
  through: socialEdgeModel,
  foreignKey: "requesterId",
  otherKey: "addresseeId"
});

userModel.belongsToMany(userModel, {
  as: "Requesters",
  through: socialEdgeModel,
  foreignKey: "addresseeId",
  otherKey: "requesterId"
});

//Notifications
// recipient (who receives notification)
notificationsModel.belongsTo(userModel, {
  foreignKey: 'userId',
  as: 'recipient'
});

userModel.hasMany(notificationsModel, {
  foreignKey: 'userId',
  as: 'notifications'
});


// actor (who performed the action)
notificationsModel.belongsTo(userModel, {
  foreignKey: 'actorId',
  as: 'actor'
});


// related dream
notificationsModel.belongsTo(dreamModel, {
  foreignKey: 'dreamId',
  as: 'dream'
});

//UserStats
userModel.hasOne(userStats, { foreignKey: 'userId', onDelete: "CASCADE" });
userStats.belongsTo(userModel, { foreignKey: "userId" });

module.exports = {
  sequelize,
  userModel,
  dreamModel,
  commentModel,
  Like,
  socialEdgeModel,
  notificationsModel,
  userStats
};