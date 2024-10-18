const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    console.log('Connected To MongoDB');
  } catch (error) {
    console.error('Error Connecting to MongoDB:', error.message);
    console.error('Full error:', JSON.stringify(error, null, 2));
    // Don't exit the process here
  }
};

module.exports = connectDB;
