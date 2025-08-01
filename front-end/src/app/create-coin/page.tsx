/* eslint-disable @next/next/no-async-client-component */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { useWallet } from '@solana/wallet-adapter-react';

export default function CreateCoin() {
  const { login, logout, authenticated, user } = usePrivy();
  const wallet = useWallet();
  const router = useRouter();
  
  const [depositAmount, setDepositAmount] = useState('1'); // Default 1 SOL
  const [isDepositing, setIsDepositing] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [vaultPubkey, setVaultPubkey] = useState<string | null>(null);
  const [mintPubkey, setMintPubkey] = useState<string | null>(null);

  // Poll for curve status when we have a mint
  useEffect(() => {
    if (!mintPubkey || !isPolling) return;

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/curve-status?mint=${mintPubkey}`);
        const data = await response.json();
        
        if (data.success && data.ready) {
          setIsPolling(false);
          router.push(`/trading/${data.curvePda}`);
        }
      } catch (error) {
        console.error('Error polling curve status:', error);
      }
    }, 2000); // Poll every 2 seconds

    return () => clearInterval(pollInterval);
  }, [mintPubkey, isPolling, router]);

  const handleDepositAndLaunch = async () => {
    if (!authenticated) {
      alert('Please connect/login first');
      return;
    }

    setIsDepositing(true);
    
    try {
      // Step 1: Call deposit API to get vault pubkey
      const depositResponse = await fetch('/api/deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(depositAmount),
          user: user?.id,
        }),
      });

      const depositData = await depositResponse.json();
      
      if (!depositData.success) {
        throw new Error(depositData.error || 'Deposit failed');
      }

      setVaultPubkey(depositData.vaultPubkey);
      setMintPubkey(depositData.mintPubkey || 'placeholder-mint'); // TODO: Get real mint from backend
      
      // Step 2: Open Phantom send dialog
      if (wallet.publicKey && depositData.vaultPubkey) {
        // TODO: Implement actual SOL transfer to vault
        // For now, just simulate the transfer
        console.log('Would send', depositAmount, 'SOL to', depositData.vaultPubkey);
        
        // Step 3: Start polling for curve status
        setIsPolling(true);
      }
      
    } catch (error) {
      console.error('Deposit error:', error);
      alert(`Deposit failed: ${error}`);
    } finally {
      setIsDepositing(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto py-6 space-y-6">
      {/* Connect/Login Section */}
      <div className="text-center">
        {!authenticated ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Connect to Create Token</h2>
            <button
              onClick={login}
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Connect / Login
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Welcome, {user?.email || 'User'}!</h2>
            <button
              onClick={logout}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Disconnect
            </button>
          </div>
        )}
      </div>

      {/* Deposit Section */}
      {authenticated && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">Token Creation</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Initial Deposit (SOL)
            </label>
            <input
              type="number"
              placeholder="1"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="w-full py-2 px-3 bg-gray-800 rounded-lg min-h-10 text-white border-[#64ffda] border-[1px] focus:outline-none focus:ring-2 focus:ring-[#64ffda] focus:border-transparent"
            />
          </div>

          <button
            disabled={isDepositing || isPolling}
            onClick={handleDepositAndLaunch}
            className="w-full py-3 px-4 bg-[#64ffda] text-gray-900 rounded-lg hover:bg-[#64ffda]/80 focus:outline-none focus:ring-2 focus:ring-[#64ffda] disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isDepositing ? 'Processing Deposit...' : 
             isPolling ? 'Creating Token...' : 
             'Deposit & Launch'}
          </button>
        </div>
      )}

      {/* Status Messages */}
      {isPolling && (
        <div className="text-center text-gray-300">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#64ffda] mx-auto mb-2"></div>
          <p>Creating your token... This may take a few moments.</p>
        </div>
      )}

      {vaultPubkey && (
        <div className="text-sm text-gray-400">
          <p>Vault: {vaultPubkey}</p>
          {mintPubkey && <p>Mint: {mintPubkey}</p>}
        </div>
      )}
    </div>
  );
}
