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
        <main className="h-full px-4 mt-2 mx-auto">
          {children}
        </main>
      </div>
    </ProtectRouteUser>
  );
}

