# Privy Server SDK Wrapper

This module provides a comprehensive wrapper around the Privy Server SDK for managing embedded wallets and Solana transactions.

## Setup

### Environment Variables

Add the following environment variables to your `back-end/.env` file:

```env
PRIVY_APP_ID=your_privy_app_id
PRIVY_SERVER_KEY=your_privy_server_key_with_wallet_control_scope
PRIVY_CLUSTER=devnet  # or mainnet-beta
```

**Important**: The `PRIVY_SERVER_KEY` must include the Wallet-Control scope to enable embedded wallet operations.

### Installation

The required dependency is already installed:
```json
"@privy-io/server-auth": "^1.29.0"
```

## Usage

### Basic Import

```typescript
import { 
  privy, 
  getEmbeddedWallet, 
  sendSolanaTx,
  getUser 
} from './lib/privyClient';
```

### Get User's Embedded Wallet

```typescript
import { getEmbeddedWallet } from './lib/privyClient';

const wallet = await getEmbeddedWallet(userId);
console.log(wallet.address); // User's wallet address
console.log(wallet.cluster); // 'devnet' or 'mainnet-beta'
```

### Send Solana Transaction

```typescript
import { sendSolanaTx } from './lib/privyClient';
import { Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';

const transaction = new Transaction().add(
  SystemProgram.transfer({
    fromPubkey: userWallet,
    toPubkey: recipientWallet,
    lamports: 0.1 * LAMPORTS_PER_SOL,
  })
);

const signature = await sendSolanaTx(userId, transaction, {
  skipPreflight: false,
  maxRetries: 3
});
```

### Get User Information

```typescript
import { getUser } from './lib/privyClient';

const user = await getUser(userId);
console.log(user.wallet?.address);
console.log(user.email?.address);
```

## Features

### ✅ Must-Haves (Implemented)

- **Environment Validation**: Validates `PRIVY_APP_ID`, `PRIVY_SERVER_KEY`, and `PRIVY_CLUSTER`
- **Singleton Client**: `export const privy = new PrivyClient({...})`
- **Embedded Wallet Helper**: `getEmbeddedWallet(userId) → { address, cluster }`
- **Transaction Helper**: `sendSolanaTx(userId, tx, opts) → signature`

### ✅ Nice-to-Have (Included)

- **Retry Logic**: Automatic retry with exponential backoff for rate limits (429 errors)
- **Type Safety**: Full TypeScript support with proper interfaces
- **Error Handling**: Comprehensive error messages and logging
- **Additional Helpers**: `getUser`, `getWallet`, `createWallet`

## Error Handling

The wrapper includes automatic retry logic for Privy rate limits:

```typescript
// Automatic retry with exponential backoff
const wallet = await getEmbeddedWallet(userId); // Will retry up to 3 times
```

## Rate Limiting

The wrapper automatically handles Privy rate limits with exponential backoff:
- Base delay: 1000ms
- Max retries: 3
- Exponential backoff: 1s, 2s, 4s

## Examples

See `privyClient.example.ts` for complete usage examples including:
- Getting user wallets
- Sending SOL transactions
- Getting user information
- Advanced Privy client usage

## Integration with Other Modules

Other backend modules (webhooks, deposit, curve deployer) can import helpers from this singleton:

```typescript
// In routes/deposit.ts
import { getEmbeddedWallet, sendSolanaTx } from '../lib/privyClient';

export async function handleDeposit(userId: string, amount: number) {
  const wallet = await getEmbeddedWallet(userId);
  // ... deposit logic
}
``` 