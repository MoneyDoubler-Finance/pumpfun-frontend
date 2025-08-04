// models/Wallet.ts
import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema({
  privyId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  chain: { 
    type: String, 
    required: true,
    default: 'solana'
  },
  address: { 
    type: String, 
    required: true 
  },
  // Faucet wallet specific fields
  isFaucet: {
    type: Boolean,
    default: false
  },
  // Store the encrypted keypair for faucet wallet
  keypairSecret: {
    type: String,
    required: false // Only required for faucet wallets
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Update the updatedAt field on save
walletSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Wallet = mongoose.model('Wallet', walletSchema);

export default Wallet; 