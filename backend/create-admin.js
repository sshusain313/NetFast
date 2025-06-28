const mongoose = require('mongoose');
const User = require('./models/User');
const Subscription = require('./models/Subscription');
require('dotenv').config();

async function createAdminUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.DATABASE_URL || 'mongodb+srv://shabahatsyed101:8flCr5MKAfy15JpW@cluster0.w8cgqlr.mongodb.net/fast', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ isAdmin: true });
    if (existingAdmin) {
      console.log('❌ Admin user already exists:', existingAdmin.email);
      process.exit(0);
    }

    // Create admin user
    const adminUser = new User({
      email: 'admin@netfast.com',
      name: 'NetFast Admin',
      password: 'admin123456',
      subscription_tier: 'Digital Master',
      isAdmin: true,
      status: 'active'
    });

    await adminUser.save();
    console.log('✅ Admin user created:', adminUser.email);

    // Create subscription for admin
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 10); // 10 years

    const subscription = new Subscription({
      user_id: adminUser._id,
      tier: 'Digital Master',
      amount: 79,
      expires_at: expiresAt,
      status: 'active',
      paymentMethod: 'Admin Account'
    });

    await subscription.save();
    console.log('✅ Admin subscription created');

    console.log('🎉 Admin setup complete!');
    console.log('Email: admin@netfast.com');
    console.log('Password: admin123456');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

createAdminUser(); 