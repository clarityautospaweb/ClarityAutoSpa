const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Service = require('../models/Service');

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/clarity_auto_spa";

const seedImages = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB.');

    const services = await Service.find({});
    console.log(`Found ${services.length} services to update.`);

    for (const service of services) {
      let imageUrl = '';

      if (service.categoryId === 'full_detail') {
        imageUrl = '/services/full_detail.jpg';
      } else if (service.categoryId === 'mini_detail') {
        if (service.name.toLowerCase().includes('interior')) {
          imageUrl = '/hero/interior.jpg';
        } else if (service.name.toLowerCase().includes('wash')) {
          imageUrl = '/hero/wash.jpg';
        } else {
          imageUrl = '/services/mini_detail.jpg';
        }
      } else if (service.categoryId === 'paint_correction') {
        imageUrl = '/hero/paint.jpg';
      } else if (service.categoryId === 'tints') {
        imageUrl = '/hero/car1.jpg'; // Good sleek car look for tints
      } else if (service.categoryId === 'wraps_ppf') {
        imageUrl = '/services/ppf.jpg';
      } else if (service.categoryId === 'custom_work') {
        imageUrl = '/services/specialised.jpg';
      } else {
        imageUrl = '/services/full_detail.jpg'; // fallback
      }

      service.imageUrl = imageUrl;
      await service.save();
    }

    console.log('Successfully updated all services with relevant local images.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding images:', error);
    process.exit(1);
  }
};

seedImages();
