module.exports = async (req, res, next) => {

  const senderId = req.user.id;
  const recipientId = req.params.userId;

  const edge = await SocialEdge.findOne({
    where: {
      requesterId: senderId,
      addresseeId: recipientId,
      status: "accepted"
    }
  });

  if(!edge){
    return res.status(403).json({
      message: "Follow must be accepted before messaging"
    });
  }

  next();
};
