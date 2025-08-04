import { Schema, model, Document } from 'mongoose';

interface IFaucetWallet extends Document {
  userId: string;
  address: string;
}

const faucetWalletSchema = new Schema<IFaucetWallet>({
  userId: { type: String, required: true, unique: true },
  address: { type: String, required: true, unique: true },
}, { 
  timestamps: true,
  collection: 'faucet_wallets' 
});

export const FaucetWallet = model<IFaucetWallet>('FaucetWallet', faucetWalletSchema); 