const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Service = require('../models/Service');
const ServiceCategory = require('../models/ServiceCategory');
const Category = require('../models/Category');

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/clarity_auto_spa";
const ACUITY_LINK = "https://Claritybk.as.me/";

const ALL_OPTIONAL_ADDONS = [
  "Pet Hair Removal",
  "Carpet Shampooing",
  "Seat Shampooing",
  "Tree Sap Removal",
  "Bird Dropping Removal",
  "Heavy Stain Removal",
  "Headlight Restoration",
  "Engine Bay Cleaning",
  "Interior Odor Treatment",
  "Excessive Dirt / Sand Removal",
  "Leather Conditioning"
];

const categoryDocs = [
  {
    slug: 'mini-detail',
    title: 'Mini Detail — Exterior Wash & Interior Cleaning',
    description: 'Includes exterior hand wash, wheel cleaning, tire shine, interior vacuuming, windows, and basic interior cleaning.',
    order: 1,
    enabled: true,
    requiresAcknowledgement: true,
    requiresAssessment: false,
    imageUrl: '/services/mini_detail.jpg'
  },
  {
    slug: 'full-detail',
    title: 'Full Detail — Interior & Exterior',
    description: 'Comprehensive detailing including deep interior cleaning, carpet and upholstery treatment, exterior washing, wheels, and finishing.',
    order: 2,
    enabled: true,
    requiresAcknowledgement: false,
    requiresAssessment: false,
    imageUrl: '/services/full_detail.jpg'
  },
  {
    slug: 'interior-detail',
    title: 'Interior Detail Only',
    description: 'Deep interior cleaning, carpet and upholstery shampooing, stain treatment, interior surfaces, and vacuuming.',
    order: 3,
    enabled: true,
    requiresAcknowledgement: false,
    requiresAssessment: false,
    imageUrl: '/Quiz/interior.jpg'
  },
  {
    slug: 'engine-bay',
    title: 'Engine Bay Detailing',
    description: 'Professional cleaning of the engine compartment to remove grease, dirt, and accessible debris.',
    order: 4,
    enabled: true,
    requiresAcknowledgement: false,
    requiresAssessment: false,
    imageUrl: '/services/full_detail.jpg'
  },
  {
    slug: 'paint-correction',
    title: 'Paint Correction & Ceramic Coating',
    description: 'Professional paint polishing and ceramic protection to improve shine and help protect the vehicle’s finish.',
    order: 5,
    enabled: true,
    requiresAcknowledgement: false,
    requiresAssessment: true,
    imageUrl: '/porche_front.jpeg'
  },
  {
    slug: 'ceramic-window-tinting',
    title: 'Ceramic Window Tinting',
    description: 'Premium ceramic window tinting for heat reduction, UV protection, and privacy.',
    order: 6,
    enabled: true,
    requiresAcknowledgement: false,
    requiresAssessment: false,
    imageUrl: '/porche_back.jpeg'
  },
  {
    slug: 'paint-protection-film',
    title: 'Paint Protection Film (PPF)',
    description: 'Professional XPEL paint protection film installation.',
    order: 7,
    enabled: true,
    requiresAcknowledgement: false,
    requiresAssessment: true,
    imageUrl: '/services/ppf.jpg'
  },
  {
    slug: 'vinyl-wraps',
    title: 'Vinyl Wraps',
    description: 'Premium vehicle color-change wraps using 3M or Avery vinyl.',
    order: 8,
    enabled: true,
    requiresAcknowledgement: false,
    requiresAssessment: true,
    imageUrl: '/porche_back.jpeg'
  },
  {
    slug: 'custom-enhancements',
    title: 'Custom Vehicle Enhancements',
    description: 'Custom vehicle styling, lighting, and performance aesthetic enhancements.',
    order: 9,
    enabled: true,
    requiresAcknowledgement: false,
    requiresAssessment: false,
    imageUrl: '/services/specialised.jpg'
  },
  {
    slug: 'specialty-restoration',
    title: 'Specialty Cleaning & Restoration',
    description: 'High-level remediation and restoration services that differentiate us from ordinary detailing shops. Specialty services require inspection before final pricing.',
    order: 10,
    enabled: true,
    requiresAcknowledgement: false,
    requiresAssessment: true,
    imageUrl: '/whyus/flood.jpg'
  }
];

const services = [
  // 1. MINI DETAIL — EXTERIOR WASH & INTERIOR CLEANING
  {
    name: 'Mini Detail (Exterior Wash & Interior Cleaning) — Sedan',
    description: 'Includes exterior hand wash, wheel cleaning, tire shine, interior vacuuming, windows, and basic interior cleaning.',
    price: '114.99',
    pricingType: 'fixed',
    categoryId: 'mini-detail',
    category: 'Mini Detail — Exterior Wash & Interior Cleaning',
    time: '1 hr 25 min',
    carType: 'Sedan',
    vehicleSize: 'sedan',
    acuityLink: ACUITY_LINK,
    ctaType: 'book',
    imageUrl: '/services/mini_detail.jpg',
    displayOrder: 1,
    enabled: true,
    includedItems: [
      'Exterior Hand Wash',
      'Wheel Cleaning & Tire Shine',
      'Interior Cabin Vacuuming',
      'Window Cleaning (Interior & Exterior)',
      'Basic Surface Wipe Down',
      'Trunk & Cup Holder Cleaning'
    ],
    eligibleAddons: ALL_OPTIONAL_ADDONS
  },
  {
    name: 'Mini Detail (Exterior Wash & Interior Cleaning) — SUV',
    description: 'Includes exterior hand wash, wheel cleaning, tire shine, interior vacuuming, windows, and basic interior cleaning.',
    price: '124.99',
    pricingType: 'fixed',
    categoryId: 'mini-detail',
    category: 'Mini Detail — Exterior Wash & Interior Cleaning',
    time: '1 hr 40 min',
    carType: 'SUV',
    vehicleSize: 'suv',
    acuityLink: ACUITY_LINK,
    ctaType: 'book',
    imageUrl: '/services/mini_detail.jpg',
    displayOrder: 2,
    enabled: true,
    includedItems: [
      'Exterior Hand Wash',
      'Wheel Cleaning & Tire Shine',
      'Interior Cabin Vacuuming',
      'Window Cleaning (Interior & Exterior)',
      'Basic Surface Wipe Down',
      'Trunk & Cup Holder Cleaning'
    ],
    eligibleAddons: ALL_OPTIONAL_ADDONS
  },
  {
    name: 'Mini Detail (Exterior Wash & Interior Cleaning) — XL SUV',
    description: 'Includes exterior hand wash, wheel cleaning, tire shine, interior vacuuming, windows, and basic interior cleaning.',
    price: '134.99',
    pricingType: 'fixed',
    categoryId: 'mini-detail',
    category: 'Mini Detail — Exterior Wash & Interior Cleaning',
    time: '1 hr 55 min',
    carType: 'XL SUV',
    vehicleSize: 'xl_suv',
    acuityLink: ACUITY_LINK,
    ctaType: 'book',
    imageUrl: '/services/mini_detail.jpg',
    displayOrder: 3,
    enabled: true,
    includedItems: [
      'Exterior Hand Wash',
      'Wheel Cleaning & Tire Shine',
      'Interior Cabin Vacuuming',
      'Window Cleaning (Interior & Exterior)',
      'Basic Surface Wipe Down',
      'Trunk & Cup Holder Cleaning'
    ],
    eligibleAddons: ALL_OPTIONAL_ADDONS
  },

  // 2. FULL DETAIL — INTERIOR & EXTERIOR
  {
    name: 'Full Detail (Interior & Exterior) — Sedan',
    description: 'Comprehensive detailing including deep interior cleaning, carpet and upholstery treatment, exterior washing, wheels, and finishing.',
    price: '349',
    pricingType: 'fixed',
    categoryId: 'full-detail',
    category: 'Full Detail — Interior & Exterior',
    time: '2 hr 45 min',
    carType: 'Sedan',
    vehicleSize: 'sedan',
    acuityLink: ACUITY_LINK,
    ctaType: 'book',
    imageUrl: '/services/full_detail.jpg',
    displayOrder: 1,
    enabled: true,
    includedItems: [
      'Deep Interior Cleaning & Air Purge',
      'Carpet & Upholstery Treatment',
      'Exterior Hand Wash & Microfiber Dry',
      'Deep Wheel & Tire Cleanse',
      'Door Jambs & Crevice Detailing',
      'Protective Surface Finish'
    ],
    eligibleAddons: ALL_OPTIONAL_ADDONS
  },
  {
    name: 'Full Detail (Interior & Exterior) — SUV',
    description: 'Comprehensive detailing including deep interior cleaning, carpet and upholstery treatment, exterior washing, wheels, and finishing.',
    price: '425',
    pricingType: 'fixed',
    categoryId: 'full-detail',
    category: 'Full Detail — Interior & Exterior',
    time: '3 hr',
    carType: 'SUV',
    vehicleSize: 'suv',
    acuityLink: ACUITY_LINK,
    ctaType: 'book',
    imageUrl: '/services/full_detail.jpg',
    displayOrder: 2,
    enabled: true,
    includedItems: [
      'Deep Interior Cleaning & Air Purge',
      'Carpet & Upholstery Treatment',
      'Exterior Hand Wash & Microfiber Dry',
      'Deep Wheel & Tire Cleanse',
      'Door Jambs & Crevice Detailing',
      'Protective Surface Finish'
    ],
    eligibleAddons: ALL_OPTIONAL_ADDONS
  },
  {
    name: 'Full Detail (Interior & Exterior) — XL SUV',
    description: 'Comprehensive detailing including deep interior cleaning, carpet and upholstery treatment, exterior washing, wheels, and finishing.',
    price: '475',
    pricingType: 'fixed',
    categoryId: 'full-detail',
    category: 'Full Detail — Interior & Exterior',
    time: '3 hr 15 min',
    carType: 'XL SUV',
    vehicleSize: 'xl_suv',
    acuityLink: ACUITY_LINK,
    ctaType: 'book',
    imageUrl: '/services/full_detail.jpg',
    displayOrder: 3,
    enabled: true,
    includedItems: [
      'Deep Interior Cleaning & Air Purge',
      'Carpet & Upholstery Treatment',
      'Exterior Hand Wash & Microfiber Dry',
      'Deep Wheel & Tire Cleanse',
      'Door Jambs & Crevice Detailing',
      'Protective Surface Finish'
    ],
    eligibleAddons: ALL_OPTIONAL_ADDONS
  },

  // 3. INTERIOR DETAIL ONLY
  {
    name: 'Interior Detail Only — Sedan',
    description: 'Deep interior cleaning, carpet and upholstery shampooing, stain treatment, interior surfaces, and vacuuming.',
    price: '274.99',
    pricingType: 'fixed',
    categoryId: 'interior-detail',
    category: 'Interior Detail Only',
    time: '2 hr 15 min',
    carType: 'Sedan',
    vehicleSize: 'sedan',
    acuityLink: ACUITY_LINK,
    ctaType: 'book',
    imageUrl: '/Quiz/interior.jpg',
    displayOrder: 1,
    enabled: true,
    includedItems: [
      'High-Power Vacuuming & Crevice Purge',
      'Deep Carpet & Upholstery Shampooing',
      'Targeted Stain Treatment',
      'Dashboard, Console & Door Panel Detailing',
      'Interior Window & Mirror Polishing'
    ],
    eligibleAddons: ALL_OPTIONAL_ADDONS
  },
  {
    name: 'Interior Detail Only — SUV',
    description: 'Deep interior cleaning, carpet and upholstery shampooing, stain treatment, interior surfaces, and vacuuming.',
    price: '374.99',
    pricingType: 'fixed',
    categoryId: 'interior-detail',
    category: 'Interior Detail Only',
    time: '2 hr 30 min',
    carType: 'SUV',
    vehicleSize: 'suv',
    acuityLink: ACUITY_LINK,
    ctaType: 'book',
    imageUrl: '/Quiz/interior.jpg',
    displayOrder: 2,
    enabled: true,
    includedItems: [
      'High-Power Vacuuming & Crevice Purge',
      'Deep Carpet & Upholstery Shampooing',
      'Targeted Stain Treatment',
      'Dashboard, Console & Door Panel Detailing',
      'Interior Window & Mirror Polishing'
    ],
    eligibleAddons: ALL_OPTIONAL_ADDONS
  },
  {
    name: 'Interior Detail Only — XL SUV',
    description: 'Deep interior cleaning, carpet and upholstery shampooing, stain treatment, interior surfaces, and vacuuming for extra large SUVs and 3-row vehicles.',
    price: 'Price to be confirmed',
    pricingType: 'inspection',
    categoryId: 'interior-detail',
    category: 'Interior Detail Only',
    time: '2 hr 45 min',
    carType: 'XL SUV',
    vehicleSize: 'xl_suv',
    ctaType: 'quote',
    imageUrl: '/Quiz/interior.jpg',
    displayOrder: 3,
    enabled: true,
    includedItems: [
      'High-Power Vacuuming across 3 Seating Rows',
      'Deep Carpet & Upholstery Shampooing',
      'Targeted Stain & Grime Treatment',
      'Dashboard, Center Console & Door Panel Detailing',
      'Trunk Area & Interior Glass Restoration'
    ],
    eligibleAddons: ALL_OPTIONAL_ADDONS
  },

  // 4. ENGINE BAY DETAILING
  {
    name: 'Engine Bay Detailing',
    description: 'Professional cleaning of the engine compartment to remove grease, dirt, and accessible debris.',
    price: '200',
    pricingType: 'fixed',
    categoryId: 'engine-bay',
    category: 'Engine Bay Detailing',
    time: '2 hr',
    carType: 'All Vehicles',
    vehicleSize: null,
    acuityLink: ACUITY_LINK,
    ctaType: 'book',
    imageUrl: '/services/full_detail.jpg',
    displayOrder: 1,
    enabled: true,
    includedItems: [
      'De-greasing and grime removal',
      'Safe electrical component masking',
      'Steam and agitation cleaning',
      'Plastic and rubber conditioning'
    ],
    eligibleAddons: ALL_OPTIONAL_ADDONS
  },
  {
    name: 'Rodent Contamination Cleanup (Engine Bay)',
    description: 'Specialized decontamination, nesting extraction, and sanitizing of engine bay compartments affected by rodent infestation.',
    price: 'Custom Quote',
    pricingType: 'inspection',
    categoryId: 'engine-bay',
    category: 'Engine Bay Detailing',
    time: 'Requires Inspection',
    carType: 'All Vehicles',
    vehicleSize: null,
    ctaType: 'assessment',
    imageUrl: '/whyus/flood.jpg',
    displayOrder: 2,
    enabled: true,
    isSpecialty: true,
    includedItems: [
      'Biohazard containment & removal',
      'Antimicrobial engine bay wash',
      'Odor and pheromone neutralization',
      'Full visual inspection report'
    ],
    eligibleAddons: ALL_OPTIONAL_ADDONS
  },

  // 5. PAINT CORRECTION & CERAMIC COATING
  {
    name: 'Paint Correction & Ceramic Coating — Sedan',
    description: 'Professional paint polishing and ceramic protection to improve shine and help protect the vehicle’s finish.',
    price: '699',
    pricingType: 'starts_at',
    categoryId: 'paint-correction',
    category: 'Paint Correction & Ceramic Coating',
    time: '5 hr',
    carType: 'Sedan',
    vehicleSize: 'sedan',
    acuityLink: ACUITY_LINK,
    ctaType: 'book',
    imageUrl: '/porche_front.jpeg',
    displayOrder: 1,
    enabled: true,
    includedItems: [
      'Multi-stage foam hand decontamination',
      'Clay bar decontamination',
      'Machine paint correction (swirl & scratch reduction)',
      'High-gloss ceramic coating application',
      'Hydrophobic surface shield'
    ],
    eligibleAddons: ALL_OPTIONAL_ADDONS
  },
  {
    name: 'Paint Correction & Ceramic Coating — SUV',
    description: 'Professional paint polishing and ceramic protection to improve shine and help protect the vehicle’s finish.',
    price: '799',
    pricingType: 'starts_at',
    categoryId: 'paint-correction',
    category: 'Paint Correction & Ceramic Coating',
    time: '6 hr 40 min',
    carType: 'SUV',
    vehicleSize: 'suv',
    acuityLink: ACUITY_LINK,
    ctaType: 'book',
    imageUrl: '/porche_front.jpeg',
    displayOrder: 2,
    enabled: true,
    includedItems: [
      'Multi-stage foam hand decontamination',
      'Clay bar decontamination',
      'Machine paint correction (swirl & scratch reduction)',
      'High-gloss ceramic coating application',
      'Hydrophobic surface shield'
    ],
    eligibleAddons: ALL_OPTIONAL_ADDONS
  },
  {
    name: 'Paint Correction & Ceramic Coating — XL SUV',
    description: 'Professional paint polishing and multi-year ceramic protection for XL SUVs, vans, and commercial size vehicles.',
    price: 'Custom Quote',
    pricingType: 'inspection',
    categoryId: 'paint-correction',
    category: 'Paint Correction & Ceramic Coating',
    time: 'Custom Quote',
    carType: 'XL SUV',
    vehicleSize: 'xl_suv',
    ctaType: 'quote',
    imageUrl: '/porche_front.jpeg',
    displayOrder: 3,
    enabled: true,
    includedItems: [
      'Thorough vehicle inspection and paint thickness check',
      'Clay bar and chemical iron decontamination',
      'Compound & polish swirl elimination',
      'Premium ceramic coating curing'
    ],
    eligibleAddons: ALL_OPTIONAL_ADDONS
  },

  // 6. CERAMIC WINDOW TINTING
  // 4 side windows + rear windshield
  {
    name: 'Ceramic Tint (4 Side Windows + Rear Windshield) — Sedan',
    description: 'Premium ceramic window tinting for 4 side windows and rear windshield. Heat reduction, UV protection, and enhanced privacy.',
    price: '575',
    pricingType: 'fixed',
    categoryId: 'ceramic-window-tinting',
    category: 'Ceramic Window Tinting',
    time: '3 hr',
    carType: 'Sedan',
    vehicleSize: 'sedan',
    acuityLink: ACUITY_LINK,
    ctaType: 'book',
    imageUrl: '/porche_back.jpeg',
    displayOrder: 1,
    enabled: true,
    includedItems: [
      '4 side door windows tinted',
      'Rear windshield full coverage',
      'Premium heat-blocking ceramic film',
      '99% UV radiation rejection'
    ]
  },
  {
    name: 'Ceramic Tint (4 Side Windows + Rear Windshield) — SUV',
    description: 'Premium ceramic window tinting for 4 side windows and rear windshield. Heat reduction, UV protection, and enhanced privacy.',
    price: '650',
    pricingType: 'fixed',
    categoryId: 'ceramic-window-tinting',
    category: 'Ceramic Window Tinting',
    time: '4 hr',
    carType: 'SUV',
    vehicleSize: 'suv',
    acuityLink: ACUITY_LINK,
    ctaType: 'book',
    imageUrl: '/porche_back.jpeg',
    displayOrder: 2,
    enabled: true,
    includedItems: [
      '4 side door windows tinted',
      'Rear windshield full coverage',
      'Premium heat-blocking ceramic film',
      '99% UV radiation rejection'
    ]
  },
  {
    name: 'Ceramic Tint (4 Side Windows + Rear Windshield) — XL SUV',
    description: 'Premium ceramic window tinting for 4 side windows and rear windshield. Heat reduction, UV protection, and enhanced privacy.',
    price: '700',
    pricingType: 'fixed',
    categoryId: 'ceramic-window-tinting',
    category: 'Ceramic Window Tinting',
    time: '4 hr 30 min',
    carType: 'XL SUV',
    vehicleSize: 'xl_suv',
    acuityLink: ACUITY_LINK,
    ctaType: 'book',
    imageUrl: '/porche_back.jpeg',
    displayOrder: 3,
    enabled: true,
    includedItems: [
      '4 side door windows tinted',
      'Rear windshield full coverage',
      'Premium heat-blocking ceramic film',
      '99% UV radiation rejection'
    ]
  },
  // 2 rear side windows + rear windshield
  {
    name: 'Ceramic Tint (2 Rear Side Windows + Rear Windshield) — Sedan',
    description: 'Premium ceramic window tinting for 2 rear side windows and rear windshield.',
    price: '300',
    pricingType: 'fixed',
    categoryId: 'ceramic-window-tinting',
    category: 'Ceramic Window Tinting',
    time: '3 hr 20 min',
    carType: 'Sedan',
    vehicleSize: 'sedan',
    acuityLink: ACUITY_LINK,
    ctaType: 'book',
    imageUrl: '/porche_back.jpeg',
    displayOrder: 4,
    enabled: true,
    includedItems: [
      '2 rear passenger windows',
      'Rear windshield coverage',
      'Ceramic IR heat-rejection film'
    ]
  },
  {
    name: 'Ceramic Tint (2 Rear Side Windows + Rear Windshield) — SUV',
    description: 'Premium ceramic window tinting for 2 rear side windows and rear windshield.',
    price: '350',
    pricingType: 'fixed',
    categoryId: 'ceramic-window-tinting',
    category: 'Ceramic Window Tinting',
    time: '3 hr 30 min',
    carType: 'SUV',
    vehicleSize: 'suv',
    acuityLink: ACUITY_LINK,
    ctaType: 'book',
    imageUrl: '/porche_back.jpeg',
    displayOrder: 5,
    enabled: true,
    includedItems: [
      '2 rear passenger windows',
      'Rear windshield coverage',
      'Ceramic IR heat-rejection film'
    ]
  },
  {
    name: 'Ceramic Tint (2 Rear Side Windows + Rear Windshield) — XL SUV',
    description: 'Premium ceramic window tinting for 2 rear side windows and rear windshield.',
    price: '400',
    pricingType: 'fixed',
    categoryId: 'ceramic-window-tinting',
    category: 'Ceramic Window Tinting',
    time: '3 hr 40 min',
    carType: 'XL SUV',
    vehicleSize: 'xl_suv',
    acuityLink: ACUITY_LINK,
    ctaType: 'book',
    imageUrl: '/porche_back.jpeg',
    displayOrder: 6,
    enabled: true,
    includedItems: [
      '2 rear passenger windows',
      'Rear windshield coverage',
      'Ceramic IR heat-rejection film'
    ]
  },

  // 7. PAINT PROTECTION FILM (PPF)
  {
    name: 'XPEL Stealth Matte Paint Protection Film (PPF)',
    description: 'Professional XPEL Stealth Matte PPF installation. Includes one-step paint correction before installation. Advertised 10-year film warranty.',
    price: '7000',
    pricingType: 'fixed',
    categoryId: 'paint-protection-film',
    category: 'Paint Protection Film (PPF)',
    time: '3–4 days',
    turnaround: '3–4 days',
    carType: 'All Vehicles',
    vehicleSize: null,
    acuityLink: ACUITY_LINK,
    ctaType: 'book',
    imageUrl: '/services/ppf.jpg',
    displayOrder: 1,
    enabled: true,
    includedItems: [
      'XPEL Stealth Matte Film Full Vehicle Coverage',
      'One-Step Paint Correction Before Installation',
      'Advertised 10-Year Film Warranty',
      'Self-Healing & Rock Chip Protection'
    ]
  },
  {
    name: 'Custom & Partial PPF Packages',
    description: 'Front bumper, full hood, front track pack, or custom XPEL Ultimate Plus gloss paint protection film packages.',
    price: 'Custom Quote',
    pricingType: 'inspection',
    categoryId: 'paint-protection-film',
    category: 'Paint Protection Film (PPF)',
    time: 'Custom Turnaround',
    turnaround: '2–4 days',
    carType: 'All Vehicles',
    vehicleSize: null,
    ctaType: 'quote',
    imageUrl: '/services/ppf.jpg',
    displayOrder: 2,
    enabled: true,
    includedItems: [
      'Custom cut computer-designed templates',
      'Partial or Full front impact zones',
      'One-step prep polishing',
      'Industry-leading XPEL warranty'
    ]
  },

  // 8. VINYL WRAPS
  {
    name: 'SUV Full Vinyl Wrap (3M / Avery)',
    description: 'Premium vehicle color-change wraps using 3M or Avery vinyl. Turnaround: 3–4 days. Door jambs excluded.',
    price: '4500',
    pricingType: 'fixed',
    categoryId: 'vinyl-wraps',
    category: 'Vinyl Wraps',
    time: '3–4 days',
    turnaround: '3–4 days',
    carType: 'SUV',
    vehicleSize: 'suv',
    acuityLink: ACUITY_LINK,
    ctaType: 'book',
    imageUrl: '/porche_back.jpeg',
    displayOrder: 1,
    enabled: true,
    includedItems: [
      'Full exterior vehicle wrap (door jambs excluded)',
      'Premium 3M or Avery Dennison cast vinyl',
      'Surface prep and disassembly of lights/trim for seamless wrap',
      'Turnaround: 3–4 business days'
    ]
  },
  {
    name: 'Sedan / XL SUV / Custom Vinyl Wraps',
    description: 'Color-change wraps for sedans, XL SUVs, exotics, chrome deletes, and accents. Certified 3M & Avery materials.',
    price: 'Request Quote',
    pricingType: 'inspection',
    categoryId: 'vinyl-wraps',
    category: 'Vinyl Wraps',
    time: '3–4 days',
    turnaround: '3–4 days',
    carType: 'All Vehicles',
    vehicleSize: null,
    ctaType: 'quote',
    imageUrl: '/porche_back.jpeg',
    displayOrder: 2,
    enabled: true,
    includedItems: [
      'Tailored color consultation & material samples',
      'Chrome delete, roof wraps, or full wraps',
      'High-durability exterior vinyl finishes'
    ]
  },

  // 9. CUSTOM VEHICLE ENHANCEMENTS
  {
    name: 'Ambient Lighting',
    description: 'Factory look ambient lighting includes 4 doors, dashboard, storage box, door handles, and footlight. Controlled through the screen.',
    price: '799.99',
    pricingType: 'fixed',
    categoryId: 'custom-enhancements',
    category: 'Custom Vehicle Enhancements',
    time: '6 hr',
    carType: 'All Vehicles',
    vehicleSize: null,
    acuityLink: ACUITY_LINK,
    ctaType: 'book',
    imageUrl: '/services/specialised.jpg',
    displayOrder: 1,
    enabled: true,
    includedItems: [
      '4 door panels illumination',
      'Dashboard flow LED strip',
      'Storage box & door handle accents',
      'Footwell LED lighting',
      'Screen / smartphone integration'
    ]
  },
  {
    name: 'Starlight Headliner (500 Stars)',
    description: 'Custom handcrafted starlight headliner installation featuring 500 fiber-optic stars with twinkle effects and multiple color modes.',
    price: '699.99',
    pricingType: 'fixed',
    categoryId: 'custom-enhancements',
    category: 'Custom Vehicle Enhancements',
    time: '6 hr',
    carType: 'All Vehicles',
    vehicleSize: null,
    acuityLink: ACUITY_LINK,
    ctaType: 'book',
    imageUrl: '/services/specialised.jpg',
    displayOrder: 2,
    enabled: true,
    includedItems: [
      '500 individual fiber-optic star strands',
      'Twinkle and shooting star controls',
      'Bluetooth smartphone app control',
      'OEM fabric preservation'
    ]
  },
  {
    name: 'Underglow Lighting',
    description: 'Custom automotive exterior underglow lighting installation. Weatherproof LED arrays with dynamic RGB presets.',
    price: '400',
    pricingType: 'fixed',
    categoryId: 'custom-enhancements',
    category: 'Custom Vehicle Enhancements',
    time: '10 hr',
    carType: 'All Vehicles',
    vehicleSize: null,
    acuityLink: ACUITY_LINK,
    ctaType: 'book',
    imageUrl: '/services/specialised.jpg',
    displayOrder: 3,
    enabled: true,
    includedItems: [
      'Front, rear, and side underbody LED channels',
      'Heavy-duty waterproof wiring and mounting',
      'Multi-color wireless controller'
    ]
  },
  {
    name: 'Wheel Powder Coating',
    description: 'Durable, heat-treated electrostatic powder coating for all 4 wheels in your color and finish of choice (gloss, satin, matte, metallic).',
    price: '345',
    pricingType: 'starts_at',
    categoryId: 'custom-enhancements',
    category: 'Custom Vehicle Enhancements',
    time: '4 hr',
    carType: 'All Vehicles',
    vehicleSize: null,
    acuityLink: ACUITY_LINK,
    ctaType: 'book',
    imageUrl: '/services/specialised.jpg',
    displayOrder: 4,
    enabled: true,
    includedItems: [
      'Tire dismount and remount/balancing',
      'Wheel curb rash repair preparation',
      'Sandblasting & chemical stripping',
      'High-temp electrostatic curing'
    ]
  },
  {
    name: 'Headlight Restoration',
    description: 'Professional optical restoration to eliminate haze, yellowing, and oxidation, restoring maximum clarity and night visibility.',
    price: 'Price to be confirmed',
    pricingType: 'inspection',
    categoryId: 'custom-enhancements',
    category: 'Custom Vehicle Enhancements',
    time: '2 hr',
    carType: 'All Vehicles',
    vehicleSize: null,
    ctaType: 'quote',
    imageUrl: '/services/specialised.jpg',
    displayOrder: 5,
    enabled: true,
    includedItems: [
      'Multi-stage wet sanding (800 - 3000 grit)',
      'Rotary compound and polish',
      'UV-blocking ceramic sealant'
    ]
  },

  // 10. SPECIALTY CLEANING & RESTORATION
  {
    name: 'Mold & Mildew Remediation',
    description: 'Targeted antimicrobial mold and mildew remediation to eliminate dangerous spores, deep moisture, and musty growth. Requires inspection before final pricing.',
    price: '800–1,650+',
    pricingType: 'inspection',
    categoryId: 'specialty-restoration',
    category: 'Specialty Cleaning & Restoration',
    time: 'Requires Inspection',
    carType: 'All Vehicles',
    vehicleSize: null,
    ctaType: 'assessment',
    imageUrl: '/whyus/flood.jpg',
    displayOrder: 1,
    enabled: true,
    isSpecialty: true,
    includedItems: [
      'In-person diagnostic contamination inspection',
      'EPA-registered antimicrobial fogging & treatment',
      'Deep steam extraction of affected seats & carpets',
      'High-output ozone air purification',
      'Cabin air filter replacement recommendation'
    ]
  },
  {
    name: 'Flood & Water Damage Cleaning',
    description: 'Emergency water extraction, industrial dehumidification, and interior restoration for flood-affected vehicles. Requires inspection before final pricing.',
    price: 'Custom Quote',
    pricingType: 'inspection',
    categoryId: 'specialty-restoration',
    category: 'Specialty Cleaning & Restoration',
    time: 'Requires Inspection',
    carType: 'All Vehicles',
    vehicleSize: null,
    ctaType: 'assessment',
    imageUrl: '/whyus/flood.jpg',
    displayOrder: 2,
    enabled: true,
    isSpecialty: true,
    includedItems: [
      'Standing water extraction',
      'Under-carpet padding assessment & drying',
      'Commercial grade thermal dehumidification',
      'Antimicrobial prevention to halt mold germination'
    ]
  },
  {
    name: 'Rodent Infestation / Engine Bay Cleanup',
    description: 'Complete biohazard cleanout, nest removal, sanitization, and enzyme disinfection for rodent intrusion in cabin or engine compartments. Requires inspection before final pricing.',
    price: 'Custom Quote',
    pricingType: 'inspection',
    categoryId: 'specialty-restoration',
    category: 'Specialty Cleaning & Restoration',
    time: 'Requires Inspection',
    carType: 'All Vehicles',
    vehicleSize: null,
    ctaType: 'assessment',
    imageUrl: '/whyus/flood.jpg',
    displayOrder: 3,
    enabled: true,
    isSpecialty: true,
    includedItems: [
      'Safe biohazard and nesting debris removal',
      'HEPA-filtered vacuuming',
      'Enzymatic waste neutralization',
      'Ozone odor eradication & germicidal fogging'
    ]
  },
  {
    name: 'Interior Odor Removal',
    description: 'Molecular odor eradication for heavy cigarette smoke, pet accidents, spoiled food, gasoline spills, or chemical smells. Requires inspection before final pricing.',
    price: 'Custom Quote',
    pricingType: 'inspection',
    categoryId: 'specialty-restoration',
    category: 'Specialty Cleaning & Restoration',
    time: 'Requires Inspection',
    carType: 'All Vehicles',
    vehicleSize: null,
    ctaType: 'assessment',
    imageUrl: '/whyus/flood.jpg',
    displayOrder: 4,
    enabled: true,
    isSpecialty: true,
    includedItems: [
      'Source contamination neutralization',
      'Deep steam cleaning of headliner & fabrics',
      'Industrial ozone and chlorine dioxide treatment',
      'HVAC duct sanitizing treatment'
    ]
  },
  {
    name: 'Waterlogged Carpet & Interior Restoration',
    description: 'Intensive restoration for carpets saturated by sunroof leaks, door seal failures, or AC condenser clogs. Requires inspection before final pricing.',
    price: 'Custom Quote',
    pricingType: 'inspection',
    categoryId: 'specialty-restoration',
    category: 'Specialty Cleaning & Restoration',
    time: 'Requires Inspection',
    carType: 'All Vehicles',
    vehicleSize: null,
    ctaType: 'assessment',
    imageUrl: '/whyus/flood.jpg',
    displayOrder: 5,
    enabled: true,
    isSpecialty: true,
    includedItems: [
      'Carpet subfloor inspection & moisture detection',
      'Continuous extraction and thermal air drying',
      'Fiber sanitization and mildew prevention',
      'Underpad treatment to eliminate stagnant dampness'
    ]
  }
];

const runSeed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB Atlas.');

    // 1. Remove all existing services
    const deleteServicesResult = await Service.deleteMany({});
    console.log(`Cleared all existing services (${deleteServicesResult.deletedCount} removed).`);

    // 2. Remove and reset ServiceCategories
    await ServiceCategory.deleteMany({});
    for (const cat of categoryDocs) {
      await ServiceCategory.create(cat);
    }
    console.log(`Successfully created ${categoryDocs.length} Service Categories.`);

    // 3. Reset Category collection (admin tags & car types)
    await Category.deleteMany({});
    const categorySeedOps = [
      ...categoryDocs.map((c, i) => ({ type: 'service', name: c.title, displayOrder: i })),
      { type: 'car', name: 'Sedan', displayOrder: 0 },
      { type: 'car', name: 'SUV', displayOrder: 1 },
      { type: 'car', name: 'XL SUV', displayOrder: 2 },
      { type: 'car', name: 'All Vehicles', displayOrder: 3 },
    ];
    await Category.insertMany(categorySeedOps);
    console.log('Categories tags (admin dropdowns and car types) synchronized.');

    // 4. Seed all freshly categorized services
    const insertedServices = await Service.insertMany(services);
    console.log(`Successfully seeded ALL ${insertedServices.length} services!`);

    console.log('\nSummary by Category:');
    for (const cat of categoryDocs) {
      const count = insertedServices.filter(s => s.categoryId === cat.slug).length;
      console.log(`- ${cat.title}: ${count} services`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error seeding services:', error);
    process.exit(1);
  }
};

runSeed();
