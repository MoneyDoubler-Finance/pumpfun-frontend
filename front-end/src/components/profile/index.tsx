"use client";
import React from "react";
import { useParams } from "next/navigation";

const ProfilePage: React.FC = () => {
  const params = useParams();
  const address = params?.address as string;

  return (
    <div className="w-full h-full p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-white text-3xl font-bold mb-6">Profile</h1>
        <div className="bg-gray-800 rounded-lg p-6">
          <p className="text-gray-400">Profile for address: {address}</p>
          <p className="text-gray-400 mt-4">Profile functionality coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
