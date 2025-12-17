const express = require('express');
const app = express();
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();
const sequelize = require('./db');

const userController = require('./controllers/userController');
const dreamController = require('./controllers/dreamController');
const commentController = require('./controllers/commentController');

app.use(express.json());

// Public routes
app.use('/api/users', userController);

// Auth gate
app.use(require('./middleware/validate-session'));

// Protected routes
app.use('/api/dreams', dreamController);
app.use('/api/comments', commentController);

// Serve React build (PRODUCTION ONLY)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client", "build")));

  app.get("*", (req, res) => {
    res.sendFile(
      path.join(__dirname, "client", "build", "index.html")
    );
  });
}

console.log("Trying to authenticate...");
sequelize.authenticate()
  .then(() => {
    console.log("Connected to postgres database");
    sequelize.sync()
      .then(() => {
        app.listen(process.env.PORT, () => {
          console.log("Server listening on port " + process.env.PORT);
        });
      });
  })
  .catch(e => {
    console.log("Error: Server crashed.");
    console.log(e);
  });
