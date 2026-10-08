const multer = require('multer');

// Configure multer to use memory storage so we can forward the buffer to ImageKit
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Accept only jpg, jpeg, png, webp, mp4, webm, quicktime
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/webp' ||
    file.mimetype === 'video/mp4' ||
    file.mimetype === 'video/webm' ||
    file.mimetype === 'video/quicktime'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, PNG, and WebP are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  }
});

module.exports = upload;
