const router = require('express').Router();
const { commentModel, userModel } = require('../db-associations');
const validateSession = require('../middleware/validate-session');

/* ===== CREATE COMMENT ===== */
router.post('/create', validateSession, async (req, res) => {
  try {
    const { content, DreamId } = req.body;

    if (!DreamId) {
      return res.status(400).json({ error: 'DreamId is required' });
    }
    console.log("REQ BODY:", req.body);

    const comment = await commentModel.create({
      content,
      UserId: req.user.id,
      DreamId
    });

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
