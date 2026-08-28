"use client";
import React from "react";
import HistoryCard from "@/app/api/card/HistoryCard";

const history = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-400 to-gray-300">
      <HistoryCard />
    </div>
  );
};

export default history;
