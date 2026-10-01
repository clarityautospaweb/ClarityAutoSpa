const sharp = require('sharp');

const optimizeImage = async (buffer) => {
  return await sharp(buffer)
    .resize(1920, 1080, {
      fit: 'inside',
      withoutEnlargement: true
    })
    .webp({ quality: 80 })
    .toBuffer();
};

const optimizeImages = async (req, res, next) => {
  try {
    if (req.file) {
      req.file.buffer = await optimizeImage(req.file.buffer);
      req.file.mimetype = 'image/webp';
      req.file.originalname = req.file.originalname.replace(/\.[^/.]+$/, "") + ".webp";
    }

    if (req.files) {
      if (Array.isArray(req.files)) {
        for (let i = 0; i < req.files.length; i++) {
          req.files[i].buffer = await optimizeImage(req.files[i].buffer);
          req.files[i].mimetype = 'image/webp';
          req.files[i].originalname = req.files[i].originalname.replace(/\.[^/.]+$/, "") + ".webp";
        }
      } else {
        // req.files is an object with field names as keys
        for (const fieldName in req.files) {
          for (let i = 0; i < req.files[fieldName].length; i++) {
            req.files[fieldName][i].buffer = await optimizeImage(req.files[fieldName][i].buffer);
            req.files[fieldName][i].mimetype = 'image/webp';
            req.files[fieldName][i].originalname = req.files[fieldName][i].originalname.replace(/\.[^/.]+$/, "") + ".webp";
          }
        }
      }
    }

    next();
  } catch (error) {
    console.error('Image optimization failed:', error);
    next(new Error('Failed to process image.'));
  }
};

module.exports = optimizeImages;
