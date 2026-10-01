const express = require('express');
const router = express.Router();
const GalleryImage = require('../models/GalleryImage');
const requireAuth = require('../middleware/requireAuth');
const upload = require('../middleware/upload');
const optimizeImages = require('../middleware/imageOptimizer');
const imagekit = require('../config/imagekit');

// @route   GET /api/gallery
// @desc    Get all gallery images (Public)
router.get('/', async (req, res) => {
  try {
    const images = await GalleryImage.find().sort({ displayOrder: 1, createdAt: -1 });
    // Prevent caching so admin changes reflect instantly
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    res.json(images);
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// @route   POST /api/gallery
// @desc    Upload new gallery image (Admin)
router.post('/', requireAuth, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'beforeImage', maxCount: 1 }, { name: 'afterImage', maxCount: 1 }]), optimizeImages, async (req, res) => {
  try {
    const imageType = req.body.imageType || 'Plain Image';
    let newImageData = {
      title: req.body.title || '',
      category: req.body.category || 'Detailing',
      imageType,
      displayOrder: req.body.displayOrder || 0,
      showOnLandingPage: req.body.showOnLandingPage === 'true'
    };

    if (imageType === 'Plain Image') {
      const file = req.files['image'] ? req.files['image'][0] : null;
      if (!file) return res.status(400).json({ error: 'No image file provided for Plain Image.' });
      
      const uploadResponse = await imagekit.files.upload({
        file: file.buffer.toString('base64'),
        fileName: `gallery_${Date.now()}`,
        folder: '/clarity_auto_spa/gallery',
      });
      newImageData.imageUrl = uploadResponse.url;
      newImageData.imageId = uploadResponse.fileId;
    } else {
      const beforeFile = req.files['beforeImage'] ? req.files['beforeImage'][0] : null;
      const afterFile = req.files['afterImage'] ? req.files['afterImage'][0] : null;
      if (!beforeFile || !afterFile) return res.status(400).json({ error: 'Both before and after images are required.' });
      
      const beforeUpload = await imagekit.files.upload({
        file: beforeFile.buffer.toString('base64'),
        fileName: `gallery_before_${Date.now()}`,
        folder: '/clarity_auto_spa/gallery',
      });
      const afterUpload = await imagekit.files.upload({
        file: afterFile.buffer.toString('base64'),
        fileName: `gallery_after_${Date.now()}`,
        folder: '/clarity_auto_spa/gallery',
      });
      newImageData.beforeImageUrl = beforeUpload.url;
      newImageData.beforeImageId = beforeUpload.fileId;
      newImageData.afterImageUrl = afterUpload.url;
      newImageData.afterImageId = afterUpload.fileId;
    }

    const newImage = new GalleryImage(newImageData);

    const savedImage = await newImage.save();
    res.status(201).json(savedImage);
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// @route   PATCH /api/gallery/:id
// @desc    Update gallery image metadata (Admin)
router.patch('/:id', requireAuth, async (req, res) => {
  try {
    const { title, category, displayOrder, showOnLandingPage } = req.body;
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (category !== undefined) updateData.category = category;
    if (displayOrder !== undefined) updateData.displayOrder = displayOrder;
    if (showOnLandingPage !== undefined) updateData.showOnLandingPage = showOnLandingPage === true || showOnLandingPage === 'true';

    const updatedImage = await GalleryImage.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { returnDocument: 'after', runValidators: true }
    );

    if (!updatedImage) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.json(updatedImage);
  } catch (error) {
    console.error('Error updating gallery image:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// @route   DELETE /api/gallery/:id
// @desc    Delete a gallery image (Admin)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const image = await GalleryImage.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    if (image.imageId) {
      try { await imagekit.files.delete(image.imageId); } catch (err) {}
    }
    if (image.beforeImageId) {
      try { await imagekit.files.delete(image.beforeImageId); } catch (err) {}
    }
    if (image.afterImageId) {
      try { await imagekit.files.delete(image.afterImageId); } catch (err) {}
    }

    await GalleryImage.findByIdAndDelete(req.params.id);
    res.json({ message: 'Image removed successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
