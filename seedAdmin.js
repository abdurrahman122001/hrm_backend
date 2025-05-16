// seedAdmin.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt   = require('bcrypt');

const SALT_ROUNDS = 10;
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'Admin@123';
const ADMIN_EMAIL    = 'admin@example.com'; // adjust as needed

async function seed() {
  try {
    // 1) Connect
    await mongoose.connect(process.env.MONGODB_URI, {
      // these options are now defaults in the driver, so you can omit them
    });
    console.log('✅ Connected to MongoDB');

    // 2) Grab the raw users collection
    const usersColl = mongoose.connection.db.collection('users');

    // 3) Check if admin already exists
    const existing = await usersColl.findOne({ username: ADMIN_USERNAME });
    if (existing) {
      console.log('⚠️  Admin user already exists. No action taken.');
      process.exit(0);
    }

    // 4) Hash the password
    const hashed = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS);

    // 5) Insert raw—this skips your Mongoose pre('save') hook
    const now = new Date();
    await usersColl.insertOne({
      username:  ADMIN_USERNAME,
      email:     ADMIN_EMAIL,
      password:  hashed,
      createdAt: now,
      updatedAt: now
    });

    console.log('🎉 Admin user created with hashed password.');
    process.exit(0);

  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seed();
