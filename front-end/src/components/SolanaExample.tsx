"use client";

import { useSolanaWallets } from "@privy-io/react-auth";
import { useSendTransaction, useSignMessage } from "@privy-io/react-auth/solana";
import { Connection, PublicKey, Transaction, SystemProgram, clusterApiUrl } from "@solana/web3.js";
import { useState } from "react";

export function SolanaExample() {
  const { wallets } = useSolanaWallets();
  const { sendTransaction } = useSendTransaction();
  const { signMessage } = useSignMessage();
  const [message, setMessage] = useState("Hello Solana!");
  const [signature, setSignature] = useState<string | null>(null);

  const handleSignMessage = async () => {
    if (wallets.length === 0) {
      alert("No Solana wallets connected!");
      return;
    }

    try {
      const messageBytes = new TextEncoder().encode(message);
      const signatureBytes = await signMessage({ message: messageBytes });
      setSignature(Buffer.from(signatureBytes).toString('hex'));
    } catch (error) {
      console.error("Error signing message:", error);
      alert("Failed to sign message");
    }
  };

  const handleSendTransaction = async () => {
    if (wallets.length === 0) {
      alert("No Solana wallets connected!");
      return;
    }

    try {
      const wallet = wallets[0];
      const connection = new Connection(clusterApiUrl('devnet'));
      
      // Create a simple transfer transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(wallet.address),
          toPubkey: new PublicKey(wallet.address), // Sending to self for demo
          lamports: 1000, // 0.000001 SOL
        })
      );

      const receipt = await sendTransaction({
        transaction,
        connection,
      });

      alert(`Transaction sent! Signature: ${receipt.signature}`);
    } catch (error) {
      console.error("Error sending transaction:", error);
      alert("Failed to send transaction");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Solana Integration Example</h2>
      
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Connected Wallets:</h3>
        {wallets.length === 0 ? (
          <p className="text-gray-600">No wallets connected</p>
        ) : (
          <ul className="space-y-2">
            {wallets.map((wallet, index) => (
              <li key={index} className="text-sm">
                <strong>{wallet.name}</strong>: {wallet.address}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="message-input" className="block text-sm font-medium mb-2">
            Message to sign:
          </label>
          <input
            id="message-input"
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter message to sign"
          />
        </div>

        <button
          onClick={handleSignMessage}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Sign Message
        </button>

        {signature && (
          <div className="p-3 bg-green-100 rounded">
            <p className="text-sm">
              <strong>Signature:</strong> {signature}
            </p>
          </div>
        )}

        <button
          onClick={handleSendTransaction}
          className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          Send Test Transaction
        </button>
      </div>
    </div>
  );
} 