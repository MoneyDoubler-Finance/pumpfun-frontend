import cron from 'node-cron';
import { Program, AnchorProvider, web3, utils, BN } from '@coral-xyz/anchor';
import idl from '../program/idl/pump.json';
import { getKeypair } from '../utils/keypair';

const PROGRAM_ID = process.env.NEXT_PUBLIC_PUMP_PROGRAM_ID!;

export function startBuyBackCron() {
  const kp = getKeypair();
  const provider = new AnchorProvider(
    new web3.Connection('https://api.devnet.solana.com'),
    { publicKey: kp.publicKey, signAllTransactions: async txs => txs, signTransaction: async tx => tx },
    {},
  );
  const program = new Program(idl as any, PROGRAM_ID, provider);

  cron.schedule('*/5 * * * *', async () => {
    const [feeTreasury] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from('fee_treasury')],
      program.programId,
    );
    const balance = await provider.connection.getBalance(feeTreasury);
    const threshold = web3.LAMPORTS_PER_SOL / 10; // 0.1 SOL
    if (balance >= threshold) {
      await program.methods
        .buyBackAndBurn(new BN(threshold))
        .accounts({ feeTreasury })
        .rpc();
      console.log(`🔥 buyBackAndBurn executed with ${threshold} lamports`);
    }
  });
} 