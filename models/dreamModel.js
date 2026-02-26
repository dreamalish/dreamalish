module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Dream', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },

    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },

    category: {
      type: DataTypes.ENUM(
        'joy','despair','fear','desire','love','confusion',
        'humiliation','envy','mundanity','fortune','rage','memory'
      ),
      allowNull: false,
      defaultValue: 'joy'
    },

    isPrivate: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },

    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },

    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    
    visibility: {
      type: DataTypes.ENUM("public", "private"),
      defaultValue: "public"
    },

    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
    
  });
};
