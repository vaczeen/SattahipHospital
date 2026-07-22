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
      <main className="h-full px-4 mt-2 mx-auto">
        {children}
      </main>
    </div>
  );
}
