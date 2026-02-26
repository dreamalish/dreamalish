const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { userModel } = require('../db-associations');

/* LOGIN */
router.post('/login', async (req, res) => {
  try {
    const user = await userModel.findOne({ where: { username: req.body.username } });

    if (!user) return res.status(401).json({ error: "Invalid username" });

    const valid = await bcrypt.compare(req.body.password, user.passwordhash);
    if (!valid) return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ 
      sessionToken: token, 
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic   // 👈 ADD THIS
      },
      token
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});
/* REGISTER */
router.post('/create', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const existingUser = await userModel.findOne({ where: { username } });
    if (existingUser) return res.status(400).json({ error: "Username already exists" });

    const hash = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      username,
      email,
      passwordhash: hash
    });

    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({
      sessionToken: token,
      user: newUser.username
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
