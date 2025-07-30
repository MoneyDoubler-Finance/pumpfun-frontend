"use client";
import React from "react";
import { CiFilter } from "react-icons/ci";

const FilterListButton: React.FC = () => {
  return (
    <div className="flex items-center gap-2 px-3 py-1 border-[1px] border-[#64ffda] rounded-lg cursor-pointer hover:bg-[#64ffda] hover:bg-opacity-10">
      <CiFilter className="text-[#64ffda]" />
      <span className="text-white text-sm">Filters</span>
    </div>
  );
};

export default FilterListButton;
