const { socialEdgeModel, userModel } = require('../db-associations');

module.exports = async (req, res, next) => {

  const requesterId = req.user.id;
  const profileOwnerId = parseInt(req.params.userId);

  if (requesterId === profileOwnerId) {
    return next();
  }

  const profileOwner = await userModel.findByPk(profileOwnerId);

  if (!profileOwner) {
    return res.status(404).json({ message: "User not found." });
  }

  if (profileOwner.profileVisibility === "public") {
    return next();
  }

  const edge = await socialEdgeModel.findOne({
    where: {
      requesterId,
      addresseeId: profileOwnerId,
      status: "accepted"
    }
  });

  if (!edge) {
    return res.status(403).json({
      message: "You must be an accepted follower to view this profile."
    });
  }

  next();
};
