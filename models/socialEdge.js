module.exports = (sequelize, DataTypes) => {
  const SocialEdge = sequelize.define("SocialEdge", {

    requesterId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'unique_request_pair'
    },

    addresseeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'unique_request_pair'
    },

    status: {
      type: DataTypes.ENUM(
        "pending",
        "accepted",
        "blocked"
      ),
      defaultValue: "pending"
    }

  });

  return SocialEdge;
};
