// src/controllers/dreamController.js
const express = require('express');
const router = express.Router();
const { dreamModel, userModel, commentModel, sequelize } = require('../db-associations');
 // make sure sequelize is exported there

const validateSession = require('../middleware/validate-session');

// ---------- CREATE DREAM ----------
router.post('/create', validateSession, async (req, res) => {
  try {
    const { title, content, category, isPrivate } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    // Create the dream, link it to the logged-in user
    const newDream = await dreamModel.create({
      title,
      content,
      category,
      isPrivate: isPrivate || false,
      UserId: req.user.id, // Make sure your validateSession sets req.user
    });

    // Optional: fetch with associated User for immediate client use
    const dreamWithUser = await dreamModel.findOne({
      where: { id: newDream.id },
      include: [{ model: userModel, attributes: ['id', 'username', 'profilePic'] }],
    });

    res.status(201).json(dreamWithUser);
  } catch (err) {
    console.error('Error creating dream:', err);
    res.status(500).json({ error: 'Failed to create dream', details: err.message });
  }
});

// ---------- GET ALL DREAMS ----------
router.get('/', async (req, res) => {
  try {
    const dreams = await dreamModel.findAll({
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: userModel,
          attributes: ['id', 'username', 'profilePic']
        },
        {
          model: commentModel
        }
      ]
    });

    res.json(dreams);
  } catch (err) {
    console.error('Error fetching dreams:', err);
    res.status(500).json({ error: 'Failed to fetch dreams', details: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const dream = await dreamModel.findByPk(req.params.id, {
      include: [{ model: userModel, attributes: ['id','username','profilePic'] }]
    });

    if (!dream) {
      return res.status(404).json({ error: 'Dream not found' });
    }

    await dream.increment('views');

    res.json(dream);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch dream' });
  }
});

router.put('/:id/view', async (req, res) => {
  try {
    const dream = await dreamModel.findByPk(req.params.id);

    if (!dream) {
      return res.status(404).json({ error: 'Dream not found' });
    }

    await dream.increment('views');
    await dream.reload(); // get updated value

    res.json({ views: dream.views });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update views' });
  }
});

router.post('/:id/like', async (req, res) => {
  try {
    const dream = await dreamModel.findByPk(req.params.id);

    if (!dream) {
      return res.status(404).json({ error: 'Dream not found' });
    }

    await dream.increment('likes');
    await dream.reload();

    res.json({ likes: dream.likes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to like dream' });
  }
});
module.exports = router;
