const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
dotenv.config();

console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("DATABASE_URL:", process.env.DATABASE_URL);

const { sequelize } = require('./db-associations');

if (!process.env.JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined.");
  process.exit(1);
}

const userController = require('./controllers/userController');
const dreamController = require('./controllers/dreamController');
const commentController = require('./controllers/commentController');
const profileController = require('./controllers/profileController');
const notificationsController = require('./controllers/notificationsController');
const privateProfileRoutes = require("./routes/privateProfileRoutes");
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? 'https://dreamalish.onrender.com' 
    : 'http://localhost:3000',
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));       // ✅ global CORS
app.options('*', cors(corsOptions)); // ✅ global preflight


// ==============================
// BODY PARSING
// ==============================
app.use(express.json());

// Serve uploaded files (profile pics)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



/* =======================================================
   API ROUTES
======================================================= */

/* ---------- PUBLIC ROUTES ---------- */
app.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});
app.use('/api/users', require('./controllers/userController'));


/* ---------- PROTECTED ROUTES ---------- */
app.use('/api/dreams', require('./middleware/validate-session'), dreamController);
app.use('/api/comments', require('./middleware/validate-session'), commentController);
app.use('/api/profile', require('./middleware/validate-session'), profileController);
/*app.use("/private-profile", require('./middleware/validate-session'), privateProfileRoutes);*/
app.use('/api/notifications',
  require('./middleware/validate-session'), notificationsController);


/* =======================================================
   SERVE REACT FRONTEND (ONLY IN PRODUCTION)
=======================================================

if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, 'client', 'build');

  // Serve static files
  app.use(express.static(buildPath));

  // Catch-all: send React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}
*/
async function testDB() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established");
  } catch (err) {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  }
}

testDB();
/* =======================================================
   START SERVER
======================================================= */

sequelize.authenticate()
  .then(() => {
    console.log('Connected to Postgres database');
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('DB synced');
    const PORT = process.env.PORT || 3002;
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  })
  .catch(e => {
    console.error('Server crashed:', e);
  });

