// src/controllers/dreamController.js
const express = require('express');
const router = express.Router();
const { dreamModel, userModel, commentModel, notificationsModel, userStats, sequelize } = require('../db-associations');
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
      await UserStats.increment(
      {
        points: 5,
        dreamCount: 1
      },
      {
        where: { userId: req.user.id }
      }
    );
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
        isOwner: dreamJSON.UserId === userId
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

    const dream = await dreamModel.findByPk(dreamId);

    if (!dream) {
      return res.status(404).json({ error: "Dream not found" });
    }

    const existingLike = await Like.findOne({
      where: { userId, dreamId }
    });

    // ===============================
    // UNLIKE
    // ===============================
    if (existingLike) {

      await existingLike.destroy();

      await userStats.increment(
        { points: -1 },
        { where: { userId: dream.UserId } }
      );

      return res.json({ liked: false });

    }

    // ===============================
    // LIKE
    // ===============================
    await Like.create({ userId, dreamId });

    await UserStats.increment(
      { points: 1 },
      { where: { userId: dream.UserId } }
    );

    // Prevent self-notifications
    if (dream.UserId !== userId) {

      await notificationsModel.create({
        type: 'like',
        message: `${req.user.username} liked your dream`,
        userId: dream.UserId,
        actorId: userId,
        dreamId: dream.id
      });

    }

    return res.json({ liked: true });

  } catch (err) {
    console.error("LIKE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

//Edit Dream
// ---------- EDIT DREAM ----------
router.put('/:id', validateSession, async (req, res) => {
  try {
    const dream = await dreamModel.findOne({
      where: {
        id: req.params.id,
        UserId: req.user.id   // ✅ must match capital U
      }
    });

    if (!dream) {
      return res.status(404).json({ error: "Dream not found" });
    }

    await dream.update({
      title: req.body.title,
      content: req.body.content,
      category: req.body.category
    });

    // Return fully formatted version like GET route
    const updatedDream = await dreamModel.findByPk(dream.id, {
      include: [
        {
          model: userModel,
          as: 'User',
          attributes: ['id', 'username', 'profilePic']
        },
        {
          model: commentModel,
          include: [{
            model: userModel,
            as: 'User',
            attributes: ['id', 'username', 'profilePic']
          }]
        },
        {
          model: Like,
          attributes: ['id', 'userId']
        }
      ]
    });

    const json = updatedDream.toJSON();
    json.likes = json.Likes?.length || 0;
    json.liked = json.Likes?.some(l => l.userId === req.user.id) || false;
    

    res.json(json);

  } catch (err) {
    console.error("Update dream error:", err);
    res.status(500).json({ error: "Failed to update dream" });
  }
});

// ---------- DELETE DREAM ----------
router.delete('/:id', validateSession, async (req, res) => {
  try {
    const deleted = await dreamModel.destroy({
      where: {
        id: req.params.id,
        UserId: req.user.id   // ✅ must match model
      }
    });

    if (!deleted) {
      return res.status(404).json({ error: "Dream not found" });
    }

    res.json({ success: true });

  } catch (err) {
    console.error("Delete dream error:", err);
    res.status(500).json({ error: "Failed to delete dream" });
  }
});

module.exports = router;
