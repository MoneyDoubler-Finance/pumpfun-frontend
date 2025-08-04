// Example usage of the Privy client wrapper
// This file demonstrates how other backend modules can import and use the privyClient

import { 
  privy, 
  getEmbeddedWallet, 
  sendSolanaTx, 
  getUser
} from './privyClient';
import { Transaction, SystemProgram, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

// Example: Get user's embedded wallet
export async function getUserWallet(userId: string): Promise<{ address: string; cluster: string }> {
  try {
    const wallet = await getEmbeddedWallet(userId);
    console.log(`[example] User ${userId} wallet:`, wallet.address);
    return wallet;
  } catch (error) {
    console.error(`[example] Failed to get wallet for user ${userId}:`, error);
    throw error;
  }
}

// Example: Send SOL to another address
export async function sendSol(
  userId: string, 
  recipientAddress: string, 
  amountSol: number
): Promise<string> {
  try {
    // Create a simple transfer transaction
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: new PublicKey(recipientAddress), // This would be the user's wallet
        toPubkey: new PublicKey(recipientAddress),
        lamports: amountSol * LAMPORTS_PER_SOL,
      })
    );
    
    // Send the transaction using Privy
    const signature = await sendSolanaTx(userId, transaction, {
      skipPreflight: false
    });
    
    console.log(`[example] Transaction sent:`, signature);
    return signature;
  } catch (error) {
    console.error(`[example] Failed to send SOL:`, error);
    throw error;
  }
}

// Example: Get user information
export async function getUserInfo(userId: string) {
  try {
    const user = await getUser(userId);
    console.log(`[example] User info:`, {
      id: user.id,
      email: user.email?.address,
      wallet: user.wallet?.address,
      linkedAccounts: user.linkedAccounts?.length || 0
    });
    return user;
  } catch (error) {
    console.error(`[example] Failed to get user info:`, error);
    throw error;
  }
}

// Example: Direct Privy client usage (for advanced cases)
export async function advancedPrivyUsage(userId: string) {
  try {
    // Access the raw Privy client for advanced operations
    const user = await privy.getUser(userId);
    const wallet = await privy.walletApi.getWallet({ id: userId });
    
    console.log(`[example] Advanced usage - User:`, user.id);
    console.log(`[example] Advanced usage - Wallet:`, wallet?.address);
    
    return { user, wallet };
  } catch (error) {
    console.error(`[example] Advanced Privy usage failed:`, error);
    throw error;
  }
} 