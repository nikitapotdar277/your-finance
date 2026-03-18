import mongoose from 'mongoose';

let isConnected = false;

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI is missing. Add it to your Netlify environment variables.');
  }

  if (isConnected) {
    console.log('Using existing MongoDB connection');
    return;
  }

  try {
    mongoose.set('strictQuery', true);
    const db = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, 
      socketTimeoutMS: 45000,
    });

    isConnected = db.connections[0].readyState;
    console.log('New MongoDB connection established');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}
