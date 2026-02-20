const router = require('express').Router();
const { commentModel, userModel } = require('../db-associations');
const validateSession = require('../middleware/validate-session');

/* ===== CREATE COMMENT ===== */
router.post('/create', validateSession, async (req, res) => {
  try {
    const { content, DreamId } = req.body;

    const newComment = await commentModel.create({
      content,
      DreamId,
      UserId: req.user.id
    });

    const commentWithUser = await commentModel.findByPk(newComment.id, {
      include: [
        {
          model: userModel,
          attributes: ['id', 'username', 'profilePic']
        }
      ]
    });
    console.log("REQ USER:", req.user);
    res.status(201).json(commentWithUser);
  } catch (err) {
    console.error('Error creating comment:', err);
    res.status(500).json({ error: 'Failed to create comment' });
  }
});
/* ===== GET COMMENTS FOR A DREAM ===== */

router.get('/dream/:DreamId', validateSession, async (req, res) => {
  try {
    const comments = await commentModel.findAll({
      where: { DreamId: req.params.DreamId },
      include: [{
        model: userModel,
        attributes: ['username', 'profilePic']
      }],
      order: [['createdAt', 'DESC']]
    });
    console.log("REQ USER:", req.user);
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
