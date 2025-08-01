/* eslint-disable @next/next/no-async-client-component */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import { AnchorProvider, Program, web3 } from '@project-serum/anchor';
import BN from 'bn.js';
import idl from '@/generated/pump.json';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';

// Add fallback for environment variable
const PROGRAM_ID_STRING = process.env.NEXT_PUBLIC_PUMP_PROGRAM_ID;
console.log('PROGRAM', PROGRAM_ID_STRING);
if (!PROGRAM_ID_STRING) {
  console.error('Program ID env var missing');
  throw new Error('NEXT_PUBLIC_PUMP_PROGRAM_ID environment variable is not set');
}
console.log('Initialization - PROGRAM_ID_STRING:', PROGRAM_ID_STRING);
const connection  = new web3.Connection('https://api.devnet.solana.com');
console.log('Initialization - Connection created');

export default function CreateCoin() {
  const wallet  = useWallet();
  const router  = useRouter();
  const [name,  setName]   = useState('');
  const [sym,   setSym]    = useState('');
  const [deposit,setDep]   = useState('0.1');          // SOL
  const [busy,  setBusy]   = useState(false);

  const onSubmit = async () => {
    setBusy(true);
    try {
      console.log('Step 1: Starting onSubmit');
      
      if (!wallet.publicKey) {
        alert('Please connect your wallet first');
        setBusy(false);
        return;
      }
      
      console.log('Step 2: Wallet connected, publicKey:', wallet.publicKey.toBase58());
      console.log('Step 3: PROGRAM_ID_STRING:', PROGRAM_ID_STRING);
      console.log('Step 4: IDL loaded:', !!idl);
      
      console.log('Step 5: Creating provider...');
      console.log('Step 5a: connection:', connection);
      console.log('Step 5b: wallet:', wallet);
      console.log('Step 5c: wallet.publicKey:', wallet.publicKey?.toBase58());
      const provider = new AnchorProvider(connection, wallet as any, {});
      console.log('Step 5d: provider created:', provider);
      console.log('Step 6: Provider created, creating program...');
      
      // Create PROGRAM_ID here where web3 is fully loaded
      const PROGRAM_ID = new web3.PublicKey(PROGRAM_ID_STRING);
      console.log('Step 6a: PROGRAM_ID created:', PROGRAM_ID.toBase58());
      console.log('Step 6b: PROGRAM_ID instanceof PublicKey:', PROGRAM_ID instanceof web3.PublicKey);
      console.log('Step 6c: IDL type:', typeof idl);
      console.log('Step 6d: IDL keys:', Object.keys(idl || {}));
      
      const program  = new Program(idl as any, PROGRAM_ID_STRING, provider);
      console.log('Step 7: Program created successfully');
      
      // Create a new token mint for this curve
      const tokenMint = web3.Keypair.generate();
      
      // Derive the curve PDA using the token mint
      const [curvePda, bump] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from('curve'), tokenMint.publicKey.toBytes()],
        PROGRAM_ID,
      );

      const lamports = Math.floor(parseFloat(deposit) * web3.LAMPORTS_PER_SOL);
      if (!Number.isFinite(lamports) || lamports <= 0) {
        alert('Initial deposit must be a positive number');
        setBusy(false);
        return;
      }

      console.log('Creator (wallet) public key:', wallet.publicKey.toBase58());
      console.log('Curve PDA:', curvePda.toBase58());
      console.log({ 
        lamports, 
        name: name.trim(),
        symbol: sym.trim().toUpperCase(),
        decimals: 9,
        initialDeposit: new BN(lamports)
      });
      
      // Build the transaction using Anchor's transaction builder
      const tx = await program.methods
        .createCurve(
          name.trim(), // name
          sym.trim().toUpperCase(), // symbol
          9, // decimals
          new BN(lamports) // initial deposit
        )
        .accounts({
          payer: wallet.publicKey,
          curve: curvePda,
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([])
        .transaction();                          // get the transaction
      
      // Set fee payer and recent blockhash
      tx.feePayer = wallet.publicKey;
      tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
      
      // Debug: Log the account metas to see what's being sent
      console.log('=== ACCOUNT METAS DEBUG ===');
      console.table(tx.instructions[0].keys.map(k => ({
        pubkey: k.pubkey.toBase58(),
        isSigner: k.isSigner,
        isWritable: k.isWritable,
      })));
      console.log('=== END ACCOUNT METAS DEBUG ===');
      
      // Send the transaction using provider
      const signature = await provider.sendAndConfirm(tx);
      console.log('Transaction signature:', signature);

      router.push(`/trading/${curvePda.toBase58()}`);
    } catch (e) {
      console.error(e);
      alert(`Create failed: ${e}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto py-6">
      <input placeholder="Token Name"
             value={name}
             onChange={e=>setName(e.target.value)}
             className="w-full py-2 px-3 bg-gray-800 rounded-lg min-h-10 text-white border-[#64ffda] border-[1px] focus:outline-none focus:ring-2 focus:ring-[#64ffda] focus:border-transparent" />

      <input placeholder="Symbol"
             value={sym}
             onChange={e=>setSym(e.target.value)}
             className="w-full py-2 px-3 bg-gray-800 rounded-lg min-h-10 text-white border-[#64ffda] border-[1px] focus:outline-none focus:ring-2 focus:ring-[#64ffda] focus:border-transparent mt-3" />

      <input placeholder="Initial deposit (SOL)"
             value={deposit}
             onChange={e=>setDep(e.target.value)}
             className="w-full py-2 px-3 bg-gray-800 rounded-lg min-h-10 text-white border-[#64ffda] border-[1px] focus:outline-none focus:ring-2 focus:ring-[#64ffda] focus:border-transparent mt-3" />

      <button disabled={busy} className="w-full py-2 px-4 bg-gray-700 text-white rounded-lg border-[#64ffda] border-[1px] hover:bg-[#64ffda]/30 focus:outline-none focus:ring-2 focus:ring-[#64ffda] focus:border-transparent mt-4 disabled:opacity-50 disabled:cursor-not-allowed" onClick={onSubmit}>
        {busy ? 'Creating…' : 'Create Token'}
      </button>
    </div>
  );
}
