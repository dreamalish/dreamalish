const router = require('express').Router();
const {
  notificationsModel,
  userModel
} = require('../db-associations');

const validateSession = require('../middleware/validate-session');


/* ===============================
   GET ALL NOTIFICATIONS
================================= */
router.get('/', validateSession, async (req, res) => {
  try {

    const notifications = await notificationsModel.findAll({

      where: { userId: req.user.id },

      include: [{
        model: userModel,
        as: 'actor',
        attributes: ['id', 'username', 'profilePic']
      }],

      order: [['createdAt', 'DESC']]

    });

    res.status(200).json(notifications);

  } catch (err) {
    console.error("Fetch notifications error:", err);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});


/* ===============================
   GET UNREAD COUNT (badge)
================================= */
router.get('/unread-count', validateSession, async (req, res) => {
  try {

    const count = await notificationsModel.count({
      where: {
        userId: req.user.id,
        read: false
      }
    });

    res.json({ unread: count });

  } catch (err) {
    console.error("Unread count error:", err);
    res.status(500).json({ error: "Failed to fetch unread count" });
  }
});

/* ===============================
   MARK ALL AS READ
================================= */
router.put('/read-all', validateSession, async (req, res) => {
  try {

    await notificationsModel.update(
      { read: true },
      { where: { userId: req.user.id } }
    );

    res.json({ success: true });

  } catch (err) {
    console.error("Mark all read error:", err);
    res.status(500).json({ error: "Failed to mark all as read" });
  }
});

/* ===============================
   MARK ONE AS READ
================================= */
/*router.put('/read/:id', validateSession, async (req, res) => {
  try {

    await notificationsModel.update(
      { read: true },
      {
        where: {
          id: req.params.id,
          userId: req.user.id
        }
      }
    );

    res.json({ success: true });

  } catch (err) {
    console.error("Mark read error:", err);
    res.status(500).json({ error: "Failed to mark notification read" });
  }
});
*/
router.put('/:id/read', validateSession, async (req, res) => {
  const notification = await notificationsModel.findByPk(req.params.id);

  if (!notification) return res.sendStatus(404);

  notification.read = true;
  await notification.save();

  res.sendStatus(200);
});


module.exports = router;