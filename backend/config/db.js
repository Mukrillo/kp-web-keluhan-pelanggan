const mongoose = require('mongoose');

const connectDB = async () => {
  let retries = 5;

  while (retries) {
    try {
      const conn = await mongoose.connect(
        process.env.MONGO_URI || 'mongodb://localhost:27017/keluhan-pelanggan',
        {
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 45000,
        }
      );

      console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
      return;
    } catch (error) {
      retries -= 1;
      console.error(`❌ MongoDB connection failed. Retries left: ${retries}`);
      console.error(`   Reason: ${error.message}`);

      if (retries === 0) {
        console.error('❌ Could not connect to MongoDB after 5 attempts. Exiting...');
        process.exit(1);
      }

      console.log('   Retrying in 3 seconds...');
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }
};

// Handle disconnection events
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('error', (err) => {
  console.error(`❌ MongoDB error: ${err.message}`);
});

module.exports = connectDB;
