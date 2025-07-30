"use client";
import React from "react";
import Link from "next/link";

const TopToken: React.FC = () => {
  // Sample token address for demo
  const sampleTokenAddress = "C1NYLjRoFHPvBASeiWsFqFmWFcoFwzPYGKHCAiU86HAd";

  return (
    <div className="w-full p-4">
      <h2 className="text-white text-xl font-semibold mb-4">Top Tokens</h2>
      <div className="text-gray-400 mb-6">
        {/* Token list will be implemented here */}
        <p>Top tokens coming soon...</p>
      </div>
      
      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Link 
          href="/create-coin" 
          className="bg-custom-gradient hover:bg-opacity-80 text-white font-semibold py-3 px-6 rounded-lg text-center transition-all duration-200"
        >
          🚀 Create New Token
        </Link>
        <Link 
          href={`/trading/${sampleTokenAddress}`}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition-all duration-200"
        >
          📈 Trading Interface (Demo)
        </Link>
      </div>
      
      {/* Quick Info */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-white font-semibold mb-2">🔥 Buy-Back & Burn Active</h3>
        <p className="text-gray-300 text-sm">
          The platform now features automatic buy-back-and-burn functionality. 
          Trading fees are collected in a treasury and used to buy and burn tokens automatically.
        </p>
      </div>
    </div>
  );
};

export default TopToken;
