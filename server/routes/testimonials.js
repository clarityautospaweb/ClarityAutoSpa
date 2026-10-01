const express = require('express');
const router = express.Router();
const { z } = require('zod');
const Testimonial = require('../models/Testimonial');
const requireAuth = require('../middleware/requireAuth');
const upload = require('../middleware/upload');
const optimizeImages = require('../middleware/imageOptimizer');
const imagekit = require('../config/imagekit');

// Zod validation schemas
const testimonialSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  quote: z.string().min(1, "Quote is required"),
  rating: z.number().int().min(1).max(5),
  photoUrl: z.string().url().optional().or(z.literal('')),
  photoId: z.string().optional().or(z.literal('')),
  isFeatured: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
});

const editTestimonialSchema = testimonialSchema.partial();

// @route   GET /api/testimonials
// @desc    Get all testimonials (Public)
router.get('/', async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ displayOrder: 1, createdAt: -1 });
    // Prevent caching so admin changes reflect instantly
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    res.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// @route   POST /api/testimonials
// @desc    Create a new testimonial (Admin)
router.post('/', requireAuth, async (req, res) => {
  try {
    const validatedData = testimonialSchema.parse(req.body);
    
    const newTestimonial = new Testimonial(validatedData);
    const savedTestimonial = await newTestimonial.save();
    
    res.status(201).json(savedTestimonial);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation Error', details: error.errors });
    }
    console.error('Error creating testimonial:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// @route   PATCH /api/testimonials/:id
// @desc    Update a testimonial (Admin)
router.patch('/:id', requireAuth, async (req, res) => {
  try {
    const validatedData = editTestimonialSchema.parse(req.body);
    
    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { $set: validatedData },
      { returnDocument: 'after', runValidators: true }
    );

    if (!updatedTestimonial) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }
    
    res.json(updatedTestimonial);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation Error', details: error.errors });
    }
    console.error('Error updating testimonial:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// @route   POST /api/testimonials/:id/photo
// @desc    Upload/replace testimonial customer photo (Admin)
router.post('/:id/photo', requireAuth, upload.single('photo'), optimizeImages, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided. Field name should be "photo".' });
    }

    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    // Delete old image from ImageKit if it exists
    if (testimonial.photoId) {
      try {
        await imagekit.deleteFile(testimonial.photoId);
      } catch (err) {
        console.warn('Failed to delete old image from ImageKit:', err);
      }
    }

    // Upload to ImageKit
    const uploadResponse = await imagekit.upload({
      file: req.file.buffer, // from memory storage
      fileName: `testimonial_${req.params.id}_${Date.now()}`,
      folder: '/clarity_auto_spa/testimonials',
    });

    testimonial.photoUrl = uploadResponse.url;
    testimonial.photoId = uploadResponse.fileId;
    await testimonial.save();

    res.json(testimonial);
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// @route   DELETE /api/testimonials/:id
// @desc    Delete a testimonial (Admin)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const deletedTestimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!deletedTestimonial) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }
    res.json({ message: 'Testimonial removed successfully' });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// @route   POST /api/testimonials/sync-google
// @desc    Sync reviews from Google Places API (Admin)
router.post('/sync-google', requireAuth, async (req, res) => {
  try {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    const placeId = process.env.GOOGLE_PLACE_ID;

    if (!apiKey || !placeId) {
      return res.status(400).json({ error: 'Google Places API key or Place ID is missing in environment variables.' });
    }

    const response = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews&key=${apiKey}`);
    const data = await response.json();

    if (data.status !== 'OK' || !data.result || !data.result.reviews) {
      console.error('Google API Error:', data);
      return res.status(400).json({ error: 'Failed to fetch reviews from Google', details: data.status });
    }

    const reviews = data.result.reviews;
    let syncedCount = 0;

    for (const review of reviews) {
      // Check if this review (or similar) already exists
      const existing = await Testimonial.findOne({ 
        customerName: review.author_name,
        quote: review.text
      });

      if (!existing && review.text) { // only sync if text is present
        await Testimonial.create({
          customerName: review.author_name,
          quote: review.text,
          rating: review.rating,
          photoUrl: review.profile_photo_url,
          isFeatured: review.rating >= 4,
          displayOrder: 0
        });
        syncedCount++;
      }
    }

    res.json({ message: `Successfully synced ${syncedCount} new reviews from Google.` });
  } catch (error) {
    console.error('Error syncing Google reviews:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
