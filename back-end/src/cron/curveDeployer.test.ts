import runCurveDeployer from './curveDeployer';
import Deposit from '../models/Deposit';

// Simple test function
export async function testCurveDeployer() {
  console.log('🧪 Testing Curve Deployer...');
  
  try {
    // Create a test deposit
    const testDeposit = new Deposit({
      userId: 'did:privy:test123',
      amount: 2000000, // 2 SOL
      transactionSignature: 'test_signature_123',
      processed: false
    });
    
    await testDeposit.save();
    console.log('✅ Test deposit created');
    
    // Run the deployer
    await runCurveDeployer();
    
    // Check if deposit was processed
    const updatedDeposit = await Deposit.findById(testDeposit._id);
    console.log('📊 Deposit processed:', updatedDeposit?.processed);
    
    // Clean up
    await Deposit.findByIdAndDelete(testDeposit._id);
    console.log('🧹 Test deposit cleaned up');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testCurveDeployer();
} 