const router = require('express').Router();
const upload = require('../middleware/upload');
const validateSession = require('../middleware/validate-session');
const { userModel } = require('../db-associations');

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
   UPDATE PROFILE
=========================== */
router.put('/update', validateSession, async (req, res) => {
  try {
    const { email, profilePic,bio, location } = req.body;

    await userModel.update(
      { email, profilePic, bio, location },
      { where: { id: req.user.id } }
    );

    res.json({ message: 'Profile updated' });
  } catch (err) {
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
