# Faucet Wallet System

This system provides persistent faucet wallet management for fee sponsorship in curve deployments and deposits.

## Overview

The faucet wallet system automatically creates and persists a Solana wallet that can be used for:
- Fee sponsorship in curve deployments
- Funding user deposits
- Transaction signing via Privy

## How It Works

### 1. Automatic Initialization
On service startup, the system automatically:
- Checks if a faucet wallet exists in the database
- Creates a new wallet if none exists
- Stores both Privy wallet ID and on-chain address
- Updates environment variables for compatibility

### 2. Persistence
The faucet wallet is stored in MongoDB with:
- **privyId**: Privy wallet identifier
- **address**: On-chain Solana address
- **keypairSecret**: Encrypted keypair for transaction signing
- **isFaucet**: Flag to identify this as the faucet wallet

### 3. Usage
The faucet wallet is automatically used by:
- `curveDeployer.ts` - For fee sponsorship in curve deployments
- `curveDeployerDirect.ts` - For direct Solana transactions
- `deposit.ts` - For funding user deposits

## API

### `initializeFaucetWallet()`
Creates a new faucet wallet if none exists, otherwise returns the existing one.

```typescript
const faucetWallet = await initializeFaucetWallet();
console.log(faucetWallet.address); // On-chain address
console.log(faucetWallet.privyId); // Privy wallet ID
```

### `getFaucetWallet()`
Retrieves the existing faucet wallet. Throws error if none exists.

```typescript
const faucetWallet = await getFaucetWallet();
const keypair = faucetWallet.keypair; // Solana Keypair
```

### `updateFaucetEnvVars(faucetWallet)`
Updates environment variables for backward compatibility.

```typescript
updateFaucetEnvVars(faucetWallet);
// Sets process.env.FAUCET_PUBKEY and process.env.FAUCET_PRIVY_USER_ID
```

## Database Schema

The faucet wallet is stored in the `Wallet` collection:

```typescript
{
  privyId: string,        // Privy wallet ID
  chain: 'solana',        // Blockchain
  address: string,        // On-chain address
  isFaucet: true,         // Faucet wallet flag
  keypairSecret: string,  // Base64 encoded keypair
  createdAt: Date,
  updatedAt: Date
}
```

## Security

- Keypair is stored encrypted in the database
- Only one faucet wallet can exist per deployment
- Faucet wallet is automatically created on first startup
- Environment variables are updated for compatibility

## Testing

Run the test script to verify the system:

```bash
cd back-end
npx ts-node src/scripts/testFaucetWallet.ts
```

## Migration from Environment Variables

The system automatically migrates from environment variables:
- `FAUCET_PUBKEY` → Stored in database
- `FAUCET_PRIVY_USER_ID` → Stored in database

Old environment variables are no longer needed and have been removed from `.env`. 