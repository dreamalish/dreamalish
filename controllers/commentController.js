const router = require('express').Router();
const {
  commentModel,
  userModel,
  dreamModel,
  notificationsModel, 
  userStats
} = require('../db-associations');

const validateSession = require('../middleware/validate-session');


/* ===== CREATE COMMENT ===== */
router.post('/create', validateSession, async (req, res) => {
  try {

    const { content, DreamId } = req.body;

    // 1️⃣ Create comment
    const newComment = await commentModel.create({
      content,
      DreamId,
      UserId: req.user.id
    });

    await userStats.increment(
      {
        points: 2,
        commentCount: 1
      },
      {
        where: { userId: req.user.id }
      }
    );
    // 2️⃣ Find dream to determine owner
    const dream = await dreamModel.findByPk(DreamId);

    if (!dream) {
      return res.status(404).json({ error: "Dream not found" });
    }

    // 3️⃣ Prevent notifying yourself
    if (dream.UserId !== req.user.id) {

      const maxLength = 60;
    
      const trimmedComment =
        content.length > maxLength
          ? content.slice(0, maxLength).trim() + "..."
          : content;
    
      const notificationMessage =
        `${req.user.username} commented: "${trimmedComment}"`;
    
      await notificationsModel.create({
        type: 'comment',
        message: notificationMessage,
        userId: dream.UserId,
        actorId: req.user.id,
        dreamId: dream.id
      });
    
    }

    // 4️⃣ Return comment with user info (like before)
    const commentWithUser = await commentModel.findByPk(newComment.id, {
      include: [
        {
          model: userModel,
          attributes: ['id', 'username', 'profilePic']
        }
      ]
    });

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

    res.status(200).json(comments);

  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;