import React from "react";
import Navbar from "@/app/api/navbar";

export default function PublicInventoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar />
      <main className="min-h-screen px-2 sm:px-4 mx-auto bg-gradient-to-b from-gray-400 to-gray-300 p-3 sm:p-6 shadow-2xl border border-gray-500">
        {children}
      </main>
    </div>
  );
}
