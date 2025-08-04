import { PrivyClient } from '@privy-io/server-auth';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const appId = process.env.PRIVY_APP_ID;
const appSecret = process.env.PRIVY_APP_SECRET;
const authKey = process.env.PRIVY_AUTHORIZATION_PRIVATE_KEY;

let privy: PrivyClient | null = null;

if (appId && appSecret && authKey) {
  privy = new PrivyClient(appId, appSecret, {
    walletApi: {
      authorizationPrivateKey: authKey,
    },
  });
} else {
  console.error("ERROR: Missing one or more required Privy environment variables.");
}

export { privy };