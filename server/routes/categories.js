const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const requireAuth = require('../middleware/requireAuth');

// Default categories to seed if none exist
const DEFAULT_SERVICE_CATEGORIES = ['Detailing', 'Exterior Wash', 'Interior Detailing'];
const DEFAULT_CAR_CATEGORIES = ['Sedan', 'SUV', 'XLSUV', 'All Vehicles'];

// GET /api/categories — public, returns all categories grouped by type
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ displayOrder: 1, createdAt: 1 });

    const serviceCategories = categories.filter(c => c.type === 'service').map(c => c.name);
    const carCategories = categories.filter(c => c.type === 'car').map(c => c.name);

    // If DB is empty, return defaults and seed them
    if (serviceCategories.length === 0 && carCategories.length === 0) {
      // Seed defaults
      const seedOps = [
        ...DEFAULT_SERVICE_CATEGORIES.map((name, i) => ({ type: 'service', name, displayOrder: i })),
        ...DEFAULT_CAR_CATEGORIES.map((name, i) => ({ type: 'car', name, displayOrder: i })),
      ];
      await Category.insertMany(seedOps, { ordered: false }).catch(() => {});

      return res.json({
        serviceCategories: DEFAULT_SERVICE_CATEGORIES,
        carCategories: DEFAULT_CAR_CATEGORIES,
      });
    }

    res.json({
      serviceCategories: serviceCategories.length > 0 ? serviceCategories : DEFAULT_SERVICE_CATEGORIES,
      carCategories: carCategories.length > 0 ? carCategories : DEFAULT_CAR_CATEGORIES,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// POST /api/categories — admin only, add a new category
router.post('/', requireAuth, async (req, res) => {
  try {
    const { type, name } = req.body;

    if (!type || !name) {
      return res.status(400).json({ error: 'Type and name are required' });
    }

    if (!['service', 'car'].includes(type)) {
      return res.status(400).json({ error: 'Type must be "service" or "car"' });
    }

    const existing = await Category.findOne({ type, name: name.trim() });
    if (existing) {
      return res.status(409).json({ error: 'Category already exists' });
    }

    const count = await Category.countDocuments({ type });
    const category = await Category.create({ 
      type, 
      name: name.trim(), 
      displayOrder: count 
    });

    res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// DELETE /api/categories/by-name — admin only, delete by type+name
router.delete('/by-name', requireAuth, async (req, res) => {
  try {
    const { type, name } = req.body;
    if (!type || !name) {
      return res.status(400).json({ error: 'Type and name are required' });
    }
    const category = await Category.findOneAndDelete({ type, name });
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json({ message: 'Category deleted' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// DELETE /api/categories/:id — admin only
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json({ message: 'Category deleted' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// PATCH /api/categories/:id — admin only, update name or order
router.patch('/:id', requireAuth, async (req, res) => {
  try {
    const { name, displayOrder } = req.body;
    const updates = {};
    if (name !== undefined) updates.name = name.trim();
    if (displayOrder !== undefined) updates.displayOrder = displayOrder;

    const category = await Category.findByIdAndUpdate(req.params.id, updates, { returnDocument: 'after' });
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

module.exports = router;
