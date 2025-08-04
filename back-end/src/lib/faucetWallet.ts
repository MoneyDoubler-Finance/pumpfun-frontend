import { FaucetWallet } from '../models/FaucetWallet';
import { privy } from './privyClient';

const FAUCET_WALLET_DB_ID = 'server-faucet-wallet';

export async function initializeFaucetWallet() {
  if (!privy || !privy.walletApi) {
    console.error('❌ Cannot initialize faucet: Privy client is not available.');
    return;
  }

  console.log('🔄 Initializing faucet wallet...');
  try {
    let faucetWalletDoc = await FaucetWallet.findOne({ userId: FAUCET_WALLET_DB_ID });

    if (!faucetWalletDoc) {
      console.log('🔄 Creating new server-owned faucet wallet...');
      
      const createdWallet = await privy.walletApi.create({
        chainType: 'solana'
      });

      if (!createdWallet) throw new Error('Privy API failed to create a wallet.');

      faucetWalletDoc = new FaucetWallet({
        userId: FAUCET_WALLET_DB_ID,
        address: createdWallet.address
      });
      await faucetWalletDoc.save();
      console.log(`✅ New faucet wallet created: ${createdWallet.address}`);
    } else {
      console.log(`✅ Existing faucet wallet found: ${faucetWalletDoc.address}`);
    }
  } catch (error) {
    console.error('❌ Error initializing faucet wallet:', error);
  }
}

export async function getFaucetWallet() {
  return FaucetWallet.findOne({ userId: FAUCET_WALLET_DB_ID });
}