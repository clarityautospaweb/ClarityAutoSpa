const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Service = require('../models/Service');
const ServiceCategory = require('../models/ServiceCategory');

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/clarity_auto_spa";

const runSeed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB.');

    // Remove all existing services
    await Service.deleteMany({});
    console.log('Cleared all existing services.');

    // Ensure categories exist
    const categoryDocs = [
      { slug: 'full_detail', title: 'Full Detail', order: 1 },
      { slug: 'mini_detail', title: 'Mini Detail', order: 2 },
      { slug: 'paint_correction', title: 'Paint Correction & Ceramic', order: 3 },
      { slug: 'tints', title: 'Ceramic Window Tints', order: 4 },
      { slug: 'wraps_ppf', title: 'Wraps & PPF', order: 5 },
      { slug: 'custom_work', title: 'Custom Work', order: 6 },
    ];

    for (const cat of categoryDocs) {
      await ServiceCategory.findOneAndUpdate(
        { slug: cat.slug },
        cat,
        { upsert: true, returnDocument: 'after' }
      );
    }
    console.log('Categories ensured.');

    const services = [
      // FULL DETAIL
      {
        name: 'Sedan Detailing',
        description: 'Complete detailing package for Sedans.',
        price: '349',
        categoryId: 'full_detail',
        category: 'Full Detail',
        time: '2 hours 45 minutes',
        carType: 'Sedan',
        vehicleSize: 'sedan'
      },
      {
        name: 'SUV Detailing',
        description: 'Complete detailing package for SUVs.',
        price: '425',
        categoryId: 'full_detail',
        category: 'Full Detail',
        time: '3 hours',
        carType: 'SUV',
        vehicleSize: 'suv'
      },
      {
        name: 'XLSUV Detailing',
        description: 'Complete detailing package for Extra Large SUVs.',
        price: '475',
        categoryId: 'full_detail',
        category: 'Full Detail',
        time: '3 hours 15 minutes',
        carType: 'XL SUV',
        vehicleSize: 'xl_suv'
      },
      {
        name: 'Engine Bay Detail',
        description: 'Deep cleaning and detailing of your engine bay.',
        price: '200',
        categoryId: 'full_detail',
        category: 'Full Detail',
        time: '2 hours',
        carType: 'All Vehicles',
        vehicleSize: null
      },

      // PAINT CORRECTION & CERAMIC
      {
        name: 'Paint Correction with Ceramic (Sedan)',
        description: 'Paint correction and ceramic coating for Sedans.',
        price: '699',
        pricingType: 'starts_at',
        categoryId: 'paint_correction',
        category: 'Paint Correction',
        time: '5 hours',
        carType: 'Sedan',
        vehicleSize: 'sedan'
      },
      {
        name: 'Paint Correction with Ceramic (SUV)',
        description: 'Paint correction and ceramic coating for SUVs.',
        price: '799',
        pricingType: 'starts_at',
        categoryId: 'paint_correction',
        category: 'Paint Correction',
        time: '6 hours 40 minutes',
        carType: 'SUV',
        vehicleSize: 'suv'
      },

      // TINTS
      {
        name: 'Ceramic Tints (4 Window and Back Windshield)',
        description: 'Premium ceramic tinting for 4 windows and the back windshield.',
        price: '575',
        categoryId: 'tints',
        category: 'Ceramic Window Tints',
        time: '3 hours',
        carType: 'Sedan',
        vehicleSize: 'sedan'
      },
      {
        name: 'Ceramic Tints (4 Window and Back Windshield)',
        description: 'Premium ceramic tinting for 4 windows and the back windshield.',
        price: '650',
        categoryId: 'tints',
        category: 'Ceramic Window Tints',
        time: '4 hours',
        carType: 'SUV',
        vehicleSize: 'suv'
      },
      {
        name: 'Ceramic Tints (4 Window and Back Windshield)',
        description: 'Premium ceramic tinting for 4 windows and the back windshield.',
        price: '700',
        categoryId: 'tints',
        category: 'Ceramic Window Tints',
        time: '4 hours 30 minutes',
        carType: 'XL SUV',
        vehicleSize: 'xl_suv'
      },
      {
        name: 'Ceramic Tints (2 Back Windows and Back Windshield)',
        description: 'Premium ceramic tinting for 2 back windows and the back windshield.',
        price: '300',
        categoryId: 'tints',
        category: 'Ceramic Window Tints',
        time: '3 hours 20 minutes',
        carType: 'Sedan',
        vehicleSize: 'sedan'
      },
      {
        name: 'Ceramic Tints (2 Back Windows and Back Windshield)',
        description: 'Premium ceramic tinting for 2 back windows and the back windshield.',
        price: '350',
        categoryId: 'tints',
        category: 'Ceramic Window Tints',
        time: '3 hours 30 minutes',
        carType: 'SUV',
        vehicleSize: 'suv'
      },
      {
        name: 'Ceramic Tints (2 Back Windows and Back Windshield)',
        description: 'Premium ceramic tinting for 2 back windows and the back windshield.',
        price: '400',
        categoryId: 'tints',
        category: 'Ceramic Window Tints',
        time: '3 hours 40 minutes',
        carType: 'XL SUV',
        vehicleSize: 'xl_suv'
      },

      // MINI DETAIL
      {
        name: 'Exterior Hand Wash and Interior Cleaning',
        description: 'High Quality Exterior Wash, Tire Shine, Vacuum, Wheel Cleaning, Door Jam, Gas Cap, Cup Holder, Dashboard wipe down, Trunk Vacum, Wipe Down Seats. This is considered a mini detail.',
        price: '115',
        categoryId: 'mini_detail',
        category: 'Mini Detail',
        time: '1 hour 25 minutes',
        carType: 'Sedan',
        vehicleSize: 'sedan',
        includedItems: ['High Quality Exterior Wash', 'Tire Shine', 'Vacuum', 'Wheel Cleaning', 'Door Jam', 'Gas Cap', 'Cup Holder', 'Dashboard wipe down', 'Trunk Vacum', 'Wipe Down Seats']
      },
      {
        name: 'Exterior Hand Wash and Interior Cleaning',
        description: 'High Quality Exterior Wash, Tire Shine, Vacuum, Wheel Cleaning, Door Jam, Gas Cap, Cup Holder, Dashboard wipe down, Trunk Vacum, Wipe Down Seats. This is considered a mini detail.',
        price: '125',
        categoryId: 'mini_detail',
        category: 'Mini Detail',
        time: '1 hour 40 minutes',
        carType: 'SUV',
        vehicleSize: 'suv',
        includedItems: ['High Quality Exterior Wash', 'Tire Shine', 'Vacuum', 'Wheel Cleaning', 'Door Jam', 'Gas Cap', 'Cup Holder', 'Dashboard wipe down', 'Trunk Vacum', 'Wipe Down Seats']
      },
      {
        name: 'Exterior Hand Wash and Interior Cleaning',
        description: 'High Quality Exterior Wash, Tire Shine, Vacuum, Wheel Cleaning, Door Jam, Gas Cap, Cup Holder, Dashboard wipe down, Trunk Vacum, Wipe Down Seats. This is considered a mini detail.',
        price: '135',
        categoryId: 'mini_detail',
        category: 'Mini Detail',
        time: '1 hour 55 minutes',
        carType: 'XL SUV',
        vehicleSize: 'xl_suv',
        includedItems: ['High Quality Exterior Wash', 'Tire Shine', 'Vacuum', 'Wheel Cleaning', 'Door Jam', 'Gas Cap', 'Cup Holder', 'Dashboard wipe down', 'Trunk Vacum', 'Wipe Down Seats']
      },
      {
        name: 'Interior Cleaning (only) Detailing',
        description: 'Deep interior cleaning and detailing.',
        price: '275',
        categoryId: 'mini_detail',
        category: 'Mini Detail',
        time: '2 hours 15 minutes',
        carType: 'Sedan',
        vehicleSize: 'sedan'
      },
      {
        name: 'Interior Cleaning (only) Detailing',
        description: 'Deep interior cleaning and detailing.',
        price: '375',
        categoryId: 'mini_detail',
        category: 'Mini Detail',
        time: '2 hours 30 minutes',
        carType: 'SUV',
        vehicleSize: 'suv'
      },

      // CUSTOM WORK
      {
        name: 'Ambient Lighting',
        description: 'Factory look ambient lighting includes 4 doors, dashboard, storage box, door handles, and footlight. Controlled through the screen.',
        price: '800',
        categoryId: 'custom_work',
        category: 'Custom Work',
        time: '6 hours',
        carType: 'All Vehicles',
        vehicleSize: null
      },
      {
        name: 'Starlights (roof) 500 stars',
        description: 'Beautiful starlight installation for your vehicle roof.',
        price: '700',
        categoryId: 'custom_work',
        category: 'Custom Work',
        time: '6 hours',
        carType: 'All Vehicles',
        vehicleSize: null
      },
      {
        name: 'Underglow',
        description: 'Custom underglow lighting installation.',
        price: '400',
        categoryId: 'custom_work',
        category: 'Custom Work',
        time: '10 hours',
        carType: 'All Vehicles',
        vehicleSize: null
      },
      {
        name: 'Powder Coating Wheels',
        description: 'Any color of choice starting @$345.',
        price: '345',
        pricingType: 'starts_at',
        categoryId: 'custom_work',
        category: 'Custom Work',
        time: '4 hours',
        carType: 'All Vehicles',
        vehicleSize: null
      },
      {
        name: 'Headlight Restoration',
        description: 'Headlight restoration for all vehicles starting @ $345.',
        price: '345',
        pricingType: 'starts_at',
        categoryId: 'custom_work',
        category: 'Custom Work',
        time: '4 hours',
        carType: 'All Vehicles',
        vehicleSize: null
      },
      {
        name: 'Calipers Painting',
        description: 'Any color of choice starting @ $650.',
        price: '650',
        pricingType: 'starts_at',
        categoryId: 'custom_work',
        category: 'Custom Work',
        time: '6 hours',
        carType: 'All Vehicles',
        vehicleSize: null
      },

      // WRAPS & PPF
      {
        name: 'Vinyl Wrap',
        description: 'Regular colors 3m or Avery without door jams. Turnaround time 3-4 days.',
        price: '3500',
        categoryId: 'wraps_ppf',
        category: 'Wraps & PPF',
        time: '24 hours',
        carType: 'Sedan',
        vehicleSize: 'sedan',
        turnaround: '3-4 days'
      },
      {
        name: 'Vinyl Wrap',
        description: 'Regular colors 3m or Avery without door jams. Turnaround time 3-4 days.',
        price: '4500',
        categoryId: 'wraps_ppf',
        category: 'Wraps & PPF',
        time: '24 hours',
        carType: 'SUV',
        vehicleSize: 'suv',
        turnaround: '3-4 days'
      },
      {
        name: 'Xpel Paint Protection Film Gloss (Clear)',
        description: 'Xpel Paint Protection Film with 10 year warranty. Vehicle will get 1 step Paint correction before installation. Turnaround time 3-4 days.',
        price: '6500',
        categoryId: 'wraps_ppf',
        category: 'Wraps & PPF',
        time: '24 hours',
        carType: 'All Vehicles',
        vehicleSize: null,
        turnaround: '3-4 days'
      },
      {
        name: 'Xpel Paint Protection Film Stealth (Matte)',
        description: 'Xpel Paint Protection Film with 10 year warranty. Vehicle will get 1 step Paint correction before installation. Turnaround time 3-4 days.',
        price: '7000',
        categoryId: 'wraps_ppf',
        category: 'Wraps & PPF',
        time: '24 hours',
        carType: 'All Vehicles',
        vehicleSize: null,
        turnaround: '3-4 days'
      },
    ];

    await Service.insertMany(services.slice(0, 5));
    console.log(`Successfully seeded ${services.length} services.`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding services:', error);
    process.exit(1);
  }
};

runSeed();
