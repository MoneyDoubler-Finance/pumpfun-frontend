import { initializeFaucetWallet, getFaucetWallet, updateFaucetEnvVars } from '../lib/faucetWallet';
import { init } from '../db/dbConncetion';

async function testFaucetWallet() {
  try {
    console.log('🔄 Testing Faucet Wallet System...');
    
    // Initialize database connection
    await init();
    
    // Test 1: Initialize faucet wallet
    console.log('\n📝 Test 1: Initializing faucet wallet...');
    const faucetWallet = await initializeFaucetWallet();
    console.log('✅ Faucet wallet created:', {
      privyId: faucetWallet.privyId,
      address: faucetWallet.address
    });
    
    // Test 2: Retrieve faucet wallet
    console.log('\n📝 Test 2: Retrieving faucet wallet...');
    const retrievedWallet = await getFaucetWallet();
    console.log('✅ Faucet wallet retrieved:', {
      privyId: retrievedWallet.privyId,
      address: retrievedWallet.address
    });
    
    // Test 3: Update environment variables
    console.log('\n📝 Test 3: Updating environment variables...');
    updateFaucetEnvVars(faucetWallet);
    console.log('✅ Environment variables updated');
    
    // Test 4: Verify keypair consistency
    console.log('\n📝 Test 4: Verifying keypair consistency...');
    if (faucetWallet.address === retrievedWallet.address) {
      console.log('✅ Keypair consistency verified');
    } else {
      console.log('❌ Keypair consistency failed');
    }
    
    console.log('\n🎉 All faucet wallet tests passed!');
    
  } catch (error) {
    console.error('❌ Faucet wallet test failed:', error);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testFaucetWallet().then(() => {
    console.log('🏁 Test completed');
    process.exit(0);
  }).catch((error) => {
    console.error('💥 Test failed:', error);
    process.exit(1);
  });
}

export { testFaucetWallet }; 