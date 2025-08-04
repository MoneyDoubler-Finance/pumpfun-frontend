import mongoose from 'mongoose';
import Deposit from '../models/Deposit';
import runCurveDeployer from '../cron/curveDeployer';
import 'dotenv/config';

async function testCurveDeployer() {
  try {
    // Connect to MongoDB
    const { MONGODB_URI } = process.env;
    if (!MONGODB_URI) {
      console.error('✖ Missing MONGODB_URI in .env');
      process.exit(1);
    }

    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Create a test deposit
    const testDeposit = new Deposit({
      userId: 'did:privy:test123456789',
      amount: 2000000, // 2 SOL (>= MIN_DEPLOY_COST of 1 SOL)
      transactionSignature: 'test_signature_' + Date.now(),
      processed: false
    });

    const savedDeposit = await testDeposit.save();
    console.log('✅ Test deposit created:', {
      id: savedDeposit._id,
      userId: savedDeposit.userId,
      amount: savedDeposit.amount,
      processed: savedDeposit.processed
    });

    // Wait a moment for the deposit to be saved
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Run the curve deployer
    console.log('🔄 Running Curve Deployer...');
    await runCurveDeployer();

    // Check if deposit was processed
    const updatedDeposit = await Deposit.findById(savedDeposit._id);
    console.log('📊 Deposit status after processing:', {
      id: updatedDeposit?._id,
      processed: updatedDeposit?.processed,
      processedAt: updatedDeposit?.processedAt
    });

    // Clean up
    await Deposit.findByIdAndDelete(savedDeposit._id);
    console.log('🧹 Test deposit cleaned up');

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run the test
testCurveDeployer(); 