import React from "react";
import Navbar from "@/app/api/navbar";
import ProtectRouteUser from "@/app/api/routes/ProtectRouteUser";

export default function UserInventoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectRouteUser>
      <div>
        <Navbar />
        <main className="h-full mx-auto">
          {children}
        </main>
      </div>
    </ProtectRouteUser>
  );
}

