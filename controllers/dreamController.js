// src/controllers/dreamController.js
const express = require('express');
const router = express.Router();
const { dreamModel, userModel, commentModel, sequelize } = require('../db-associations');
const Like = sequelize.models.Like;
const { Sequelize } = require('sequelize');
const validateSession = require('../middleware/validate-session');

// ---------- CREATE DREAM ----------
router.post('/create', validateSession, async (req, res) => {
  try {
    const { title, content, category, isPrivate } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    // Create the dream linked to the logged-in user
    const newDream = await dreamModel.create({
      title,
      content,
      category,
      isPrivate: isPrivate || false,
      UserId: req.user.id,
    });

    // Fetch the full dream with User, Comments, Likes
    const fullDream = await dreamModel.findByPk(newDream.id, {
      include: [
        {
          model: userModel, as: 'User',
          attributes: ['id', 'username', 'profilePic'],
        },
        {
          model: commentModel,
          include: [
            {
              model: userModel,
              attributes: ['id', 'username', 'profilePic'],
            },
          ],
        },
        {
          model: Like,
          attributes: ['id', 'userId'],
        },
      ],
    });

    // Format for frontend: add `likes` count and whether current user liked it
    const userId = req.user.id;
    const formattedDream = fullDream.toJSON();
    formattedDream.likes = formattedDream.Likes?.length || 0;
    formattedDream.liked = formattedDream.Likes?.some(like => like.userId === userId) || false;
    res.status(201).json(formattedDream);
  } catch (err) {
    console.error('Error creating dream:', err);
    res.status(500).json({ error: 'Failed to create dream', details: err.message });
  }
});

// ---------- GET ALL DREAMS ----------
/* router.get('/', validateSession, async (req, res) => {
  try {
    const userId = req.user.id;

    const dreams = await dreamModel.findAll({
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: userModel,
          attributes: ['id', 'username', 'profilePic'],
          required: true, // Always include User
        },
        {
          model: commentModel,
          include: [
            {
              model: userModel,
              attributes: ['id', 'username', 'profilePic'],
            },
          ],
        },
        {
          model: Like,
          attributes: ['id', 'userId'],
        },
      ],
    });

    // Filter private dreams
    const filtered = dreams.filter(dream => {
      const ownerId = dream.UserId;

      if (!dream.isPrivate) return true;       // public
      if (ownerId === userId) return true;     // own

      return false; // For now, skip followers until you implement SocialEdge properly
    });

    // Format for frontend
    const formatted = filtered.map(dream => {
      const d = dream.toJSON();
      return {
        ...d,
        likes: d.Likes?.length || 0,
        liked: d.Likes?.some(like => like.userId === userId) || false,
      };
    });

    res.status(200).json(formatted);
  } catch (err) {
    console.error('Error fetching dreams:', err);
    res.status(500).json({ error: 'Failed to fetch dreams', details: err.message });
  }
});
*/
// GET ALL DREAMS
router.get('/', validateSession, async (req, res) => {
  try {
    const userId = req.user.id;

    const dreams = await dreamModel.findAll({
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: userModel,
          as: 'User',
          attributes: ['id', 'username', 'profilePic'],
        },
        {
          model: commentModel,
          include: [
            {
              model: userModel,
              as: 'User',
              attributes: ['id', 'username', 'profilePic'],
            },
          ],
        },
        {
          model: Like,
          attributes: ['id', 'userId'],
        },
      ],
    });

    // Map for frontend
    const formatted = dreams.map(d => {
      const dreamJSON = d.toJSON();
      return {
        ...dreamJSON,
        likes: dreamJSON.Likes?.length || 0,
        liked: dreamJSON.Likes?.some(like => like.userId === userId) || false,
      };
    });

    res.status(200).json(formatted);

  } catch (err) {
    console.error('Error fetching dreams:', err);
    res.status(500).json({ error: 'Failed to fetch dreams', details: err.message });
  }
});


// ---------- GET SINGLE DREAM ----------
router.get('/:id', async (req, res) => {
  try {
    const dream = await dreamModel.findByPk(req.params.id, {
      include: [
        { model: userModel, attributes: ['id', 'username', 'profilePic'] },
        { model: commentModel },
        { model: Like, attributes: [] },
      ],
    });

    if (!dream) {
      return res.status(404).json({ error: 'Dream not found' });
    }

    res.json(dream);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch dream' });
  }
});

// ---------- INCREMENT VIEW ----------
router.put('/:id/views', async (req, res) => {
  try {
    const dream = await dreamModel.findByPk(req.params.id);

    if (!dream) {
      return res.status(404).json({ error: 'Dream not found' });
    }

    await dream.increment('views');
    await dream.reload();

    res.json({ views: dream.views });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update views' });
  }
});

// ---------- LIKE / UNLIKE ----------
router.post('/:id/like', validateSession, async (req, res) => {
  try {
    const userId = req.user.id;
    const dreamId = req.params.id;

    const existingLike = await Like.findOne({ where: { userId, dreamId } });

    if (existingLike) {
      await existingLike.destroy();
      return res.json({ liked: false });
    } else {
      await Like.create({ userId, dreamId });
      return res.json({ liked: true });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Like failed' });
  }
});

module.exports = router;
