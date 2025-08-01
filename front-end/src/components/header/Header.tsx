"use client";
import React from "react";
import ConnectButton from "../buttons/ConnectButton";

const Header: React.FC = () => {
  return (
    <header className="w-full bg-gray-900 border-b border-gray-700">
      <div className="max-w-[1240px] mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-white text-2xl font-bold">LB Pump</h1>
        </div>
        <div className="flex items-center gap-4">
          <ConnectButton />
        </div>
      </div>
    </header>
  );
};

export default Header;
