module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Comment', {
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },

    DreamId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });
};
