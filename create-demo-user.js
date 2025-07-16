const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config();

async function createDemoUser() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if demo user already exists
    const existingUser = await User.findOne({ email: 'demo@taxbridge.com' });
    
    if (existingUser) {
      console.log('✅ Demo user already exists');
      await mongoose.disconnect();
      return;
    }

    // Create demo user
    console.log('Creating demo user...');
    const demoUser = await User.create({
      email: 'demo@taxbridge.com',
      password: 'demo123456',
      country: 'US'
    });

    console.log('✅ Demo user created successfully!');
    console.log('📧 Email: demo@taxbridge.com');
    console.log('🔑 Password: demo123456');
    console.log('🌍 Country: US');
    console.log('🆔 User ID:', demoUser._id);

    await mongoose.disconnect();
    console.log('✅ Database connection closed');

  } catch (error) {
    console.error('❌ Error creating demo user:', error);
    
    if (error.code === 11000) {
      console.log('✅ Demo user already exists (duplicate key error)');
    } else {
      console.error('Full error details:', error);
    }
    
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Run the script
createDemoUser();
