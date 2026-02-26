const { userModel, dreamModel } = require('../db-associations');

exports.getPrivateProfile = async (req, res) => {

  const profileOwnerId = parseInt(req.params.userId);

  try {

    const user = await userModel.findByPk(profileOwnerId, {
      attributes: [
        "id",
        "username",
        "avatar",
        "location",
        "bio"
      ]
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found."
      });
    }

    const dreams = await dreamModel.findAll({
      where: {
        userId: profileOwnerId
      },
      order: [["createdAt", "DESC"]]
    });

    res.status(200).json({
      user,
      dreams
    });

  } catch (error) {

    console.error("Private Profile Fetch Error:", error);

    res.status(500).json({
      message: "Error fetching private profile.",
      error: error.message
    });

  }
};
