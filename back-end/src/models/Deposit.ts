// models/Deposit.ts
import mongoose from 'mongoose';

const depositSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  amount: {
    type: Number,
    required: true
  },
  processed: {
    type: Boolean,
    default: false,
    index: true
  },
  transactionSignature: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  processedAt: {
    type: Date,
    default: null
  }
});

const Deposit = mongoose.model('Deposit', depositSchema);

export default Deposit; 