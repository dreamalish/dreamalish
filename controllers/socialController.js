const { socialEdgeModel, userModel } = require('../db-associations');


exports.requestFollow = async (req, res) => {

    const requesterId = req.user.id;
    const addresseeId = parseInt(req.params.userId);
  
    if (requesterId === addresseeId) {
      return res.status(400).json({ message: "You cannot follow yourself." });
    }
  
    const targetUser = await userModel.findByPk(addresseeId);
  
    if (!targetUser) {
      return res.status(404).json({ message: "User not found." });
    }
  
    const existingEdge = await socialEdgeModel.findOne({
      where: { requesterId, addresseeId }
    });
  
    if (existingEdge) {
      return res.status(400).json({ message: "Follow already requested." });
    }
  
    let status =
      targetUser.profileVisibility === "private"
        ? "pending"
        : "accepted";
  
    const edge = await socialEdgeModel.create({
      requesterId,
      addresseeId,
      status
    });
  
    if (status === "accepted") {
      await socialEdgeModel.create({
        requesterId: addresseeId,
        addresseeId: requesterId,
        status: "accepted"
      });
    }
  
    res.json(edge);
  };
  

  exports.acceptFollow = async (req, res) => {

    const requesterId = parseInt(req.params.userId);
    const addresseeId = req.user.id;
  
    const edge = await socialEdgeModel.findOne({
      where: {
        requesterId,
        addresseeId,
        status: "pending"
      }
    });
  
    if (!edge) {
      return res.status(404).json({
        message: "No pending follow request."
      });
    }
  
    edge.status = "accepted";
    await edge.save();
  
    const reciprocal = await socialEdgeModel.findOne({
      where: {
        requesterId: addresseeId,
        addresseeId: requesterId
      }
    });
  
    if (!reciprocal) {
      await socialEdgeModel.create({
        requesterId: addresseeId,
        addresseeId: requesterId,
        status: "accepted"
      });
    }
  
    res.json(edge);
  };
  