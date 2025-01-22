import mongoose from 'mongoose';

// Function to Connect to MongoDB
const connectDB = async (DATABASE_URL) => {
  try {
    const DB_OPTIONS = {
      dbName: "taskflow" // Database Name
    };

    await mongoose.connect(DATABASE_URL, DB_OPTIONS);
    console.log('MongoDB connected successfully...');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); // Exit the process with a failure code
  }

  // Handle database disconnection
  mongoose.connection.on('disconnected', () => {
    console.error('MongoDB disconnected. Attempting to reconnect...');
    connectDB(DATABASE_URL); // Reconnect automatically
  });
};

export default connectDB;
