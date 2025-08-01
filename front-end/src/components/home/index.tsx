"use client";
import React from "react";
import FilterList from "./FilterList";
import TopToken from "./TopToken";

const HomePage: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col gap-4">
      <FilterList />
      <TopToken />
    </div>
  );
};

export default HomePage;
