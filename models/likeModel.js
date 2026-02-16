module.exports = (sequelize, DataTypes) => {
    const Like = sequelize.define(
      'Like',
      {
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        dreamId: {
          type: DataTypes.INTEGER,
          allowNull: false
        }
      },
      {
        indexes: [
          {
            unique: true,
            fields: ['userId', 'dreamId']
          }
        ]
      }
    );
  
    return Like;
  };