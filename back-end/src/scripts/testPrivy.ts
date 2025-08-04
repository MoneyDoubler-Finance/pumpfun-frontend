import { privy, getEmbeddedWallet } from '../lib/privyClient';

(async () => {
  const userId = process.argv[2];
  if (!userId) {
    console.error('Usage: yarn ts-node src/scripts/testPrivy.ts <userId>');
    process.exit(1);
  }

  const user = await privy.getUser(userId);
  console.log('User →', { id: user.id, email: user.email?.address });

  const wallet = await getEmbeddedWallet(userId);
  console.log('Embedded wallet →', wallet);
})(); 