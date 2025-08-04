import express from 'express';
import crypto from 'crypto';
import Wallet from '../../models/Wallet';

const router = express.Router();

// HMAC validation helper
function validateHMAC(payload: string, signature: string, timestamp: string): boolean {
  const { PRIVY_WEBHOOK_SECRET } = process.env;
  
  if (!PRIVY_WEBHOOK_SECRET) {
    console.error('✖ Missing PRIVY_WEBHOOK_SECRET in .env');
    return false;
  }

  // Check if timestamp is within 5 minutes (300 seconds)
  const now = Math.floor(Date.now() / 1000);
  const timestampNum = parseInt(timestamp, 10);
  
  if (Math.abs(now - timestampNum) > 300) {
    console.error('✖ Webhook timestamp is stale');
    return false;
  }

  // Create HMAC signature
  const expectedSignature = crypto
    .createHmac('sha256', PRIVY_WEBHOOK_SECRET)
    .update(`${timestamp}.${payload}`)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );
}

// POST /webhooks/privy
router.post('/privy', async (req, res) => {
  try {
    // Read headers
    const signature = req.headers['x-privy-signature'] as string;
    const timestamp = req.headers['x-privy-timestamp'] as string;

    // Validate required headers
    if (!signature || !timestamp) {
      console.error('✖ Missing required headers');
      return res.status(400).json({ error: 'Missing required headers' });
    }

    // Serialize request body to string
    const payload = JSON.stringify(req.body);

    // Validate HMAC
    if (!validateHMAC(payload, signature, timestamp)) {
      console.error('✖ Invalid HMAC signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Handle wallet.created event
    if (req.body.event === 'wallet.created') {
      const { privyId, chain, address } = req.body.data;

      if (!privyId || !chain || !address) {
        console.error('✖ Missing required wallet data');
        return res.status(400).json({ error: 'Missing required wallet data' });
      }

      // Upsert wallet into database
      await Wallet.findOneAndUpdate(
        { privyId },
        { 
          privyId, 
          chain, 
          address,
          updatedAt: new Date()
        },
        { 
          upsert: true, 
          new: true 
        }
      );

      console.log('✔ Wallet created/updated:', { privyId, chain, address });
    }

    // Return 204 on success
    return res.status(204).send();

  } catch (error) {
    console.error('✖ Webhook handler error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; 