const router = require('express').Router();
const upload = require('../middleware/upload');
const validateSession = require('../middleware/validate-session');
const { userModel, userStats } = require('../db-associations');
const { Op } = require("sequelize");
const cloudinary = require('../config/cloudinary');
const calculateLevel = require('../helpers/levelCalculator');

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
    console.log(req.user.profilePic);
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
router.post(
  '/avatar',
  validateSession,
  upload.single('avatar'),
  async (req, res) => {
    try {
      console.log("Cloudinary file:", req.file);

      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const cloudinaryUrl = req.file.path;

      console.log("Cloudinary URL:", cloudinaryUrl);

      // Save URL to database
      await userModel.update(
        { profilePic: cloudinaryUrl },
        { where: { id: req.user.id } }
      );

      // Fetch updated user
      const updatedUser = await userModel.findByPk(req.user.id, {
        attributes: [
          "id",
          "username",
          "profilePic",
          "email",
          "bio",
          "location",
        ],
      });

      res.json(updatedUser);

    } catch (err) {
      console.error("Avatar upload error:", err);
      res.status(500).json({ error: err.message });
    }
  }
);

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

/*levelCalculator route
*/
router.get('/stats', validateSession, async (req, res) => {

  try {

    const stats = await userStats.findOne({
      where: { userId: req.user.id }
    });

    if (!stats) {
      return res.status(404).json({ error: "Stats not found" });
    }

    const levelInfo = calculateLevel(stats.points);

    res.json({
      points: stats.points,
      dreamCount: stats.dreamCount,
      commentCount: stats.commentCount,
      likesReceived: stats.likesReceived,
      level: levelInfo.level,
      title: levelInfo.title,
      nextLevel: levelInfo.nextLevel
    });

  } catch (err) {
    console.error("STATS ERROR:", err);
    res.status(500).json({ error: err.message });
  }

});

// ===============================
// PUBLIC USER STATS
// ===============================
router.get('/stats/:userId', async (req, res) => {
  try {

    const { userId } = req.params;

    const stats = await userStats.findOne({
      where: { userId }
    });

    if (!stats) {
      return res.status(404).json({ error: "Stats not found" });
    }

    const levelInfo = calculateLevel(stats.points);

    res.json({
      points: stats.points,
      level: levelInfo.level,
      title: levelInfo.title,
      nextLevel: levelInfo.nextLevel
    });

  } catch (err) {
    console.error("PUBLIC STATS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
