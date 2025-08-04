import { 
  PublicKey, 
  Transaction, 
  SystemProgram,
  SYSVAR_RENT_PUBKEY
} from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { PROGRAM_ID } from './programId';

// Token Metadata Program ID
const TOKEN_METADATA_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');

// Helper function to find PDA
export function findProgramAddress(
  seeds: (Buffer | Uint8Array)[],
  programId: PublicKey
): [PublicKey, number] {
  const [publicKey, bump] = PublicKey.findProgramAddressSync(seeds, programId);
  return [publicKey, bump];
}

// Helper function to get associated token account address
export function getAssociatedTokenAddress(
  mint: PublicKey,
  owner: PublicKey
): PublicKey {
  return PublicKey.findProgramAddressSync(
    [
      owner.toBuffer(),
      TOKEN_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
    ],
    ASSOCIATED_TOKEN_PROGRAM_ID
  )[0];
}

// Create initCurveMeta instruction
export function createInitCurveMetaInstruction(
  payer: PublicKey,
  tokenMint: PublicKey,
  metadata: PublicKey,
  decimals: number,
  name: string,
  symbol: string,
  uri: string
): any {
  return {
    programId: PROGRAM_ID,
    keys: [
      { pubkey: payer, isSigner: true, isMut: true },
      { pubkey: tokenMint, isSigner: false, isMut: true },
      { pubkey: metadata, isSigner: false, isMut: true },
      { pubkey: SystemProgram.programId, isSigner: false, isMut: false },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isMut: false },
      { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isMut: false },
      { pubkey: TOKEN_METADATA_PROGRAM_ID, isSigner: false, isMut: false },
    ],
    data: Buffer.from([
      0x01, // Instruction discriminator for initCurveMeta
      decimals,
      ...Buffer.from(name, 'utf8'),
      ...Buffer.from(symbol, 'utf8'),
      ...Buffer.from(uri, 'utf8'),
    ])
  };
}

// Create initCurvePool instruction
export function createInitCurvePoolInstruction(
  payer: PublicKey,
  tokenMint: PublicKey,
  metadata: PublicKey,
  curve: PublicKey,
  globalConfig: PublicKey,
  globalVault: PublicKey,
  tokenVault: PublicKey,
  curveConfig: any
): any {
  return {
    programId: PROGRAM_ID,
    keys: [
      { pubkey: payer, isSigner: true, isMut: true },
      { pubkey: tokenMint, isSigner: false, isMut: false },
      { pubkey: metadata, isSigner: false, isMut: false },
      { pubkey: curve, isSigner: false, isMut: true },
      { pubkey: globalConfig, isSigner: false, isMut: false },
      { pubkey: globalVault, isSigner: false, isMut: true },
      { pubkey: tokenVault, isSigner: false, isMut: true },
      { pubkey: SystemProgram.programId, isSigner: false, isMut: false },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isMut: false },
      { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isMut: false },
    ],
    data: Buffer.from([
      0x02, // Instruction discriminator for initCurvePool
      ...Buffer.from(JSON.stringify(curveConfig), 'utf8'),
    ])
  };
}

// Export instruction creators for the deployer
export const initCurveMetaIx = createInitCurveMetaInstruction;
export const initCurvePoolIx = createInitCurvePoolInstruction; 