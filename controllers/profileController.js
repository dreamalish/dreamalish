const router = require('express').Router();
const upload = require('../middleware/upload');
const validateSession = require('../middleware/validate-session');
const { userModel } = require('../db-associations');
const { Op } = require("sequelize");

/* ===========================
   UPDATE PROFILE
=========================== */
router.put('/update', validateSession, async (req, res) => {
  try {
    const updates = {};

    if (req.body.email !== undefined) updates.email = req.body.email;
    if (req.body.bio !== undefined) updates.bio = req.body.bio;
    if (req.body.location !== undefined) updates.location = req.body.location;

    const [updated] = await userModel.update(
      updates,
      { where: { id: req.user.id } }
    );

    console.log("Rows updated:", updated);

    res.json({ message: 'Profile updated' });

  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ===========================
   UPLOAD AVATAR
=========================== */
router.post('/avatar', validateSession, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    await userModel.update(
      { profilePic: req.file.filename },
      { where: { id: req.user.id } }
    );

    res.json({ message: 'Avatar updated', file: req.file.filename });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ===========================
   USER SEARCH (PARTIAL MATCH)
=========================== */
router.get('/search/:query', async (req, res) => {
  try {
    const users = await userModel.findAll({
      where: {
        username: {
          [Op.iLike]: `%${req.params.query}%`
        }
      },
      attributes: [
        'id',
        'username',
        'profilePic'
      ],
      limit: 15
    });

    res.json(users);

  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ===========================
   GET MY PROFILE
=========================== */
router.get('/me', validateSession, async (req, res) => {
  try {
    const user = await userModel.findByPk(req.user.id, {
      attributes: [
        'id',
        'username',
        'email',
        'profilePic',
        'bio',
        'location',
        'createdAt'
      ]
    });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ===========================
   PUBLIC PROFILE
=========================== */
router.get('/u/:username', async (req, res) => {
  try {
    const user = await userModel.findOne({
      where: { username: req.params.username },
      attributes: [
        'username',
        'profilePic',
        'bio',
        'location',
        'createdAt'
      ]
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ===========================
   GENERIC USER LOOKUP (LAST)
=========================== */
router.get('/:username', async (req, res) => {
  try {
    const user = await userModel.findOne({
      where: { username: req.params.username },
      attributes: [
        'id',
        'username',
        'email',
        'profilePic',
        'bio',
        'location',
        'createdAt'
      ]
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
