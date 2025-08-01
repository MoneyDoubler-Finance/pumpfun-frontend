import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // TODO: Implement real deposit logic
    // For now, return a hardcoded vault pubkey
    const vaultPubkey = "11111111111111111111111111111111"; // Placeholder
    
    return NextResponse.json({ 
      vaultPubkey,
      success: true 
    });
  } catch (error) {
    console.error('Deposit API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 