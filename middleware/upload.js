const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + path.extname(file.originalname);
    cb(null, unique);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpg|jpeg|png|gif/;
  const valid = allowed.test(path.extname(file.originalname).toLowerCase());
  cb(valid ? null : new Error('Images only'), valid);
};

module.exports = multer({ storage, fileFilter });
