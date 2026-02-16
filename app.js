const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
dotenv.config();
const { sequelize } = require('./db-associations');

const userController = require('./controllers/userController');
const dreamController = require('./controllers/dreamController');
const commentController = require('./controllers/commentController');
const profileController = require('./controllers/profileController');

app.use(express.json());
app.use(cors());
// Serve uploaded files (profile pics)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



/* =======================================================
   API ROUTES
======================================================= */

/* ---------- PUBLIC ROUTES ---------- */
app.use('/api/users', require('./controllers/userController'));


/* ---------- PROTECTED ROUTES ---------- */
app.use('/api/dreams', require('./middleware/validate-session'), dreamController);
app.use('/api/comments', require('./middleware/validate-session'), commentController);
app.use('/profile', require('./controllers/profileController'), profileController);


/* =======================================================
   SERVE REACT FRONTEND (ONLY IN PRODUCTION)
======================================================= */

if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, 'client', 'build');

  // Serve static files
  app.use(express.static(buildPath));

  // Catch-all: send React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}


/* =======================================================
   START SERVER
======================================================= */

sequelize.authenticate()
  .then(() => {
    console.log('Connected to Postgres database');
    return sequelize.sync({force:true});
  })
  .then(() => {
    console.log('DB synced');                // optional but nice
    const PORT = process.env.PORT || 3002;
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  })
  .catch(e => {
    console.error('Server crashed:', e);
  });

