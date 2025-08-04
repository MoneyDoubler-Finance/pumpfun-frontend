import mongoose from 'mongoose';
import 'dotenv/config';

const { MONGODB_URI } = process.env;
if (!MONGODB_URI) {
  console.error('✖ Missing MONGODB_URI in .env');
  process.exit(1);
}

export const init = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as mongoose.ConnectOptions);
    console.log('✔ MongoDB connected');
  } catch (err) {
    console.error('✖ MongoDB connection error:', err);
    process.exit(1);
  }
};
