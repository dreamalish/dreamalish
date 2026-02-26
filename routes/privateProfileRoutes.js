const express = require("express");
const router = express.Router();

const validateSession = require("../middleware/validate-session");
const canViewPrivateProfile = require("../middleware/canViewPrivateProfile");
const privateProfileController = require("../controllers/privateProfileController");

router.get(
  "/:userId",
  validateSession,
  canViewPrivateProfile,
  privateProfileController.getPrivateProfile
);

module.exports = router;
