"use client";
import React from "react";
import { tradeRecord } from "@/utils/types";

interface TradeProps {
  trade: tradeRecord;
}

export const Trade: React.FC<TradeProps> = ({ trade }) => {
  return (
    <tr className="border-b border-gray-700 text-white">
      <td className="py-2 text-center">{trade.user.username || trade.user.wallet.slice(0, 8)}</td>
      <td className={`py-2 text-center ${trade.type === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
        {trade.type.toUpperCase()}
      </td>
      <td className="py-2 text-center">{trade.solAmount.toFixed(4)} SOL</td>
      <td className="py-2 text-center">{new Date(trade.date).toLocaleDateString()}</td>
      <td className="py-2 text-center">
        <a 
          href={`https://solscan.io/tx/${trade.transactionHash}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300"
        >
          {trade.transactionHash.slice(0, 8)}...
        </a>
      </td>
    </tr>
  );
};
