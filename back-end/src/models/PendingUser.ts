// models/PendingUser.ts
import mongoose from 'mongoose';

const pendingUserSchema = new mongoose.Schema({
  address: String,
  createdAt: { type: Date, default: Date.now }
});

const PendingUser = mongoose.model('PendingUser', pendingUserSchema);

export default PendingUser;
