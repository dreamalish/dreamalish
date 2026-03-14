module.exports = (sequelize, DataTypes) => {
  return sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },

    passwordhash: {
      type: DataTypes.STRING,
      allowNull: false
    },

    profilePic: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '/uploads/defaultProfilePic.jpg'
    },

    bio: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },

    location: {
      type: DataTypes.STRING,
      allowNull: true
    },
    
    profileVisibility: {
      type: DataTypes.ENUM("public", "private"),
      defaultValue: "public"
    }
    
  });
};
