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
const socialEdgeModel = require('./models/socialEdge')(sequelize, DataTypes);


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



module.exports = {
  sequelize,
  userModel,
  dreamModel,
  commentModel,
  Like,
  socialEdgeModel
};