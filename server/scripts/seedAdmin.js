require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const AdminUser = require('../models/AdminUser');

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("MONGO_URI is missing.");
  process.exit(1);
}

async function seedAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB.");

    const username = 'clarityautospa';
    const password = 'ALAncus0930$';
    const saltRounds = 10;
    
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Upsert the user
    await AdminUser.findOneAndUpdate(
      { email: username }, // Use email field for username
      { passwordHash: passwordHash },
      { upsert: true, new: true }
    );

    console.log(`Admin user '${username}' seeded successfully.`);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
}

seedAdmin();
