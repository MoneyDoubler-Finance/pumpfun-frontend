import Deposit from '../models/Deposit';
import CurveConfig from '../models/CurveConfig';
import { PublicKey, Transaction, Connection, Keypair } from '@solana/web3.js';
import { initCurveMetaIx, initCurvePoolIx, findProgramAddress } from '../program/curveClient';
import { getFaucetWallet } from '../lib/faucetWallet';

// Get minimum deploy cost from environment or default
const MIN_DEPLOY_COST = process.env.MIN_DEPLOY_COST ? 
  parseInt(process.env.MIN_DEPLOY_COST) : 
  1000000; // 1 SOL in lamports

export async function runCurveDeployerDirect(): Promise<void> {
  try {
    console.log('🔄 Starting Curve Deployer (Direct Solana)...');

    // Get faucet wallet for fee sponsorship
    let faucetWallet;
    try {
      faucetWallet = await getFaucetWallet();
      console.log('✅ Using faucet wallet:', faucetWallet.address);
    } catch (error) {
      console.error('❌ No faucet wallet found. Please initialize faucet wallet first.');
      return;
    }

    // 1. Query deposits where processed=false AND amount >= MIN_DEPLOY_COST
    const pendingDeposits = await Deposit.find({
      processed: false,
      amount: { $gte: MIN_DEPLOY_COST }
    }).sort({ createdAt: 1 });

    if (pendingDeposits.length === 0) {
      console.log('ℹ️ No pending deposits to process');
      return;
    }

    console.log(`📦 Found ${pendingDeposits.length} pending deposits to process`);

    // 2. Process each deposit
    for (const deposit of pendingDeposits) {
      try {
        console.log(`🚀 Processing deposit ${deposit._id} for user ${deposit.userId}`);

        // Check if already processed (idempotency)
        const currentDeposit = await Deposit.findById(deposit._id);
        if (!currentDeposit || currentDeposit.processed) {
          console.log(`⏭️ Deposit ${deposit._id} already processed, skipping`);
          continue;
        }

        // 2a. Derive PDAs
        const tokenMint = new PublicKey('11111111111111111111111111111111'); // Placeholder
        
        const [configPda] = findProgramAddress(
          [Buffer.from('curve_config'), tokenMint.toBuffer()],
          new PublicKey('6DnFKqP2y4oAAnPvNNPAgGLKZ9LUo181wzpCw1ytjoRr')
        );

        const [poolPda] = findProgramAddress(
          [Buffer.from('curve_pool'), tokenMint.toBuffer()],
          new PublicKey('6DnFKqP2y4oAAnPvNNPAgGLKZ9LUo181wzpCw1ytjoRr')
        );

        console.log('✅ PDAs derived:', {
          configPda: configPda.toString(),
          poolPda: poolPda.toString()
        });

        // 2b. Build Transaction
        const connection = new Connection(process.env.SOLANA_RPC_URL || "https://api.devnet.solana.com", "confirmed");
        const tx = new Transaction();
        
        // Get recent blockhash
        const { blockhash } = await connection.getLatestBlockhash();
        tx.recentBlockhash = blockhash;
        tx.feePayer = faucetWallet.keypair.publicKey;

        // Add initCurveMeta instruction
        const metaIx = initCurveMetaIx(
          faucetWallet.keypair.publicKey,
          tokenMint,
          configPda,
          9,
          'Test Token',
          'TEST',
          'https://example.com/metadata.json'
        );
        tx.add(metaIx);

        // Add initCurvePool instruction
        const poolIx = initCurvePoolIx(
          faucetWallet.keypair.publicKey,
          tokenMint,
          configPda,
          poolPda,
          new PublicKey(process.env.GLOBAL_CONFIG_PUBKEY || '11111111111111111111111111111111'),
          new PublicKey(process.env.GLOBAL_VAULT_PUBKEY || '11111111111111111111111111111111'),
          new PublicKey(process.env.TOKEN_VAULT_PUBKEY || '11111111111111111111111111111111'),
          {
            initialPrice: 1000000,
            priceIncrement: 100000,
            maxSupply: 1000000000,
          }
        );
        tx.add(poolIx);

        console.log('✅ Transaction built with both instructions');

        // For now, just simulate the transaction (since we don't have a real faucet keypair)
        console.log('📝 Transaction would be sent with signature: simulated_signature_' + Date.now());

        // 2d. Mark deposit as processed
        await Deposit.findByIdAndUpdate(deposit._id, {
          processed: true,
          processedAt: new Date()
        });

        console.log(`✅ Deposit ${deposit._id} marked as processed`);

      } catch (error) {
        console.error(`❌ Error processing deposit ${deposit._id}:`, error);
        
        // Mark as processed to avoid infinite retries on permanent failures
        await Deposit.findByIdAndUpdate(deposit._id, {
          processed: true,
          processedAt: new Date()
        });
      }
    }

    console.log('✅ Curve Deployer (Direct) completed');

  } catch (error) {
    console.error('❌ Curve Deployer (Direct) error:', error);
  }
}

// Export for use in cron runner
export default runCurveDeployerDirect; 