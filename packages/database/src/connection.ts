import mongoose from 'mongoose';

export async function connectToDatabase(uri: string): Promise<void> {
  if (mongoose.connection.readyState >= 1) return;

  try {
    await mongoose.connect(uri);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}