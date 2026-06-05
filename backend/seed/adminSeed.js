/**
 * Admin Seed Script
 * Creates the default admin user.
 *
 * Usage: node seed/adminSeed.js
 * Or via npm: npm run seed (from backend/)
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load .env from backend root
dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User.model');

const ADMIN_DATA = {
  fullname: 'Super Administrator',
  email: 'admin@keluhan.com',
  username: 'admin',
  password: 'Admin@12345',
  role: 'admin',
};

const seed = async () => {
  try {
    const mongoUri =
      process.env.MONGO_URI || 'mongodb://localhost:27017/keluhan-pelanggan';

    console.log('');
    console.log('🌱 ================================================');
    console.log('   SimKeluhan — Admin Seed Script');
    console.log('   ================================================');
    console.log(`   Connecting to: ${mongoUri}`);

    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log('   ✅ MongoDB connected');

    // Check if admin already exists
    const existing = await User.findOne({
      $or: [{ username: ADMIN_DATA.username }, { email: ADMIN_DATA.email }],
    });

    if (existing) {
      console.log('');
      console.log('   ℹ️  Admin user already exists. Skipping creation.');
      console.log(`   Username : ${existing.username}`);
      console.log(`   Email    : ${existing.email}`);
      console.log(`   Role     : ${existing.role}`);
      console.log('   ================================================');
      console.log('');
      await mongoose.disconnect();
      process.exit(0);
    }

    const admin = await User.create(ADMIN_DATA);

    console.log('');
    console.log('   ✅ Admin user created successfully!');
    console.log('   ================================================');
    console.log(`   ID       : ${admin._id}`);
    console.log(`   Fullname : ${admin.fullname}`);
    console.log(`   Username : ${ADMIN_DATA.username}`);
    console.log(`   Email    : ${ADMIN_DATA.email}`);
    console.log(`   Password : ${ADMIN_DATA.password}`);
    console.log(`   Role     : ${admin.role}`);
    console.log('   ================================================');
    console.log('');
    console.log('   ⚠️  IMPORTANT: Change the default password after first login!');
    console.log('');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('');
    console.error('   ❌ Seed failed:', error.message);
    if (error.code === 11000) {
      console.error('   Duplicate key — admin already exists with that username/email.');
    }
    console.error('');
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  }
};

seed();
