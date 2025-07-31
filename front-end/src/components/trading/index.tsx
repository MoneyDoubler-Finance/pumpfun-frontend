"use client";
import React from "react";
import { useParams } from "next/navigation";
import { Chatting } from "./Chatting";
import { TradeForm } from "./TradeForm";
import { coinInfo } from "@/utils/types";

const TradingPage: React.FC = () => {
  const params = useParams();
  const address = params?.address as string;

  // Mock coin data for now
  const mockCoin: coinInfo = {
    _id: address,
    creator: {
      wallet: "mock-wallet",
      username: "Mock Creator"
    },
    name: "Mock Token",
    ticker: "MOCK",
    decimals: 9,
    token: address,
    tokenReserves: 1000000,
    lamportReserves: 1000000000,
    url: "",
    progressMcap: 1000000,
    date: new Date(),
    limit: 10000000,
    bondingCurve: true
  };

  return (
    <div className="w-full h-full flex flex-col lg:flex-row gap-4 p-4">
      <div className="w-full lg:w-2/3">
        <Chatting param={address} coin={mockCoin} />
      </div>
      <div className="w-full lg:w-1/3">
        <TradeForm coin={mockCoin} progress={50} curveAddress={address} />
      </div>
    </div>
  );
};

export default TradingPage;
