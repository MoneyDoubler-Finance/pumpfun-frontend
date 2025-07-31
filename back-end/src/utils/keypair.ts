import { Keypair } from '@solana/web3.js';
import fs from 'fs';
import path from 'path';

export function loadKeypair(): Keypair {
  const keypairPath = path.join(process.cwd(), '..', 'id.json');
  const secretKey = JSON.parse(fs.readFileSync(keypairPath, 'utf-8'));
  return Keypair.fromSecretKey(new Uint8Array(secretKey));
} 