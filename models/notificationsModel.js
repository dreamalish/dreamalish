module.exports = (sequelize, DataTypes) => {

    const notificationsModel = sequelize.define('Notification', {
  
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
  
      type: {
        type: DataTypes.STRING,
        allowNull: false
      },
  
      message: {
        type: DataTypes.STRING,
        allowNull: false
      },
  
      read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
  
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
  
      actorId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
  
      dreamId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
  
    });
  
    return notificationsModel;
  };