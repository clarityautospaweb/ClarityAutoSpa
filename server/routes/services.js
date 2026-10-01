const express = require('express');
const router = express.Router();
const { z } = require('zod');
const Service = require('../models/Service');
const requireAuth = require('../middleware/requireAuth');
const upload = require('../middleware/upload');
const optimizeImages = require('../middleware/imageOptimizer');
const imagekit = require('../config/imagekit');

// Zod validation schemas
const serviceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.string().min(1, "Price is required"),
  category: z.string().min(1, "Category is required"),
  time: z.string().optional(),
  acuityLink: z.string().optional().or(z.literal('')),
  carType: z.string().optional(),
  displayOrder: z.number().int().optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
  imageId: z.string().optional().or(z.literal('')),
});

const editServiceSchema = serviceSchema.partial();

const ServiceCategory = require('../models/ServiceCategory');

// @route   GET /api/services/categories
// @desc    Get all service categories (Public)
router.get('/categories', async (req, res) => {
  try {
    const categories = await ServiceCategory.find().sort({ order: 1 });
    res.json(categories);
  } catch (error) {
    console.error('Error fetching service categories:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// @route   POST /api/services/categories
// @desc    Create a new service category (Admin)
router.post('/categories', requireAuth, async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const existing = await ServiceCategory.findOne({ slug });
    if (existing) return res.status(400).json({ error: 'Category already exists' });

    const count = await ServiceCategory.countDocuments();
    const newCategory = new ServiceCategory({
      title: title.trim(),
      slug,
      description: description?.trim() || "",
      order: count
    });
    
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Error creating service category:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// @route   PATCH /api/services/categories/:id
// @desc    Update a service category (Admin)
router.patch('/categories/:id', requireAuth, async (req, res) => {
  try {
    const { title, description, enabled, order } = req.body;
    const updates = {};
    if (title !== undefined) updates.title = title.trim();
    if (description !== undefined) updates.description = description.trim();
    if (enabled !== undefined) updates.enabled = enabled;
    if (order !== undefined) updates.order = order;

    const category = await ServiceCategory.findByIdAndUpdate(
      req.params.id, 
      { $set: updates }, 
      { returnDocument: 'after' }
    );
    if (!category) return res.status(404).json({ error: 'Category not found' });
    
    res.json(category);
  } catch (error) {
    console.error('Error updating service category:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// @route   DELETE /api/services/categories/:id
// @desc    Delete a service category (Admin)
router.delete('/categories/:id', requireAuth, async (req, res) => {
  try {
    const category = await ServiceCategory.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json({ message: 'Category removed successfully' });
  } catch (error) {
    console.error('Error deleting service category:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// @route   GET /api/services
// @desc    Get all services (Public)
router.get('/', async (req, res) => {
  try {
    const services = await Service.find().sort({ displayOrder: 1, createdAt: -1 });
    // Prevent caching so admin changes reflect instantly
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// @route   POST /api/services
// @desc    Create a new service (Admin)
router.post('/', requireAuth, async (req, res) => {
  try {
    const validatedData = serviceSchema.parse(req.body);
    
    const newService = new Service(validatedData);
    const savedService = await newService.save();
    
    res.status(201).json(savedService);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation Error', details: error.errors });
    }
    console.error('Error creating service:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// @route   PATCH /api/services/:id
// @desc    Update a service (Admin)
router.patch('/:id', requireAuth, async (req, res) => {
  try {
    const validatedData = editServiceSchema.parse(req.body);
    
    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      { $set: validatedData },
      { returnDocument: 'after', runValidators: true }
    );

    if (!updatedService) {
      return res.status(404).json({ error: 'Service not found' });
    }
    
    res.json(updatedService);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation Error', details: error.errors });
    }
    console.error('Error updating service:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// @route   POST /api/services/:id/image
// @desc    Upload/replace service image (Admin)
router.post('/:id/image', requireAuth, upload.single('image'), optimizeImages, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided. Field name should be "image".' });
    }

    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    // Delete old image from ImageKit if it exists
    if (service.imageId) {
      try {
        await imagekit.files.delete(service.imageId);
      } catch (err) {
        console.warn('Failed to delete old image from ImageKit:', err);
      }
    }

    // Upload to ImageKit
    const uploadResponse = await imagekit.files.upload({
      file: req.file.buffer.toString('base64'), // convert buffer to base64 for v7
      fileName: `service_${req.params.id}_${Date.now()}`,
      folder: '/clarity_auto_spa/services',
    });

    service.imageUrl = uploadResponse.url;
    service.imageId = uploadResponse.fileId;
    await service.save();

    res.json(service);
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// @route   DELETE /api/services/:id
// @desc    Delete a service (Admin)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const deletedService = await Service.findByIdAndDelete(req.params.id);
    if (!deletedService) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json({ message: 'Service removed successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
