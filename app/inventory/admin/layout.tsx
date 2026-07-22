import React from "react";
import Sidebar from "@/app/api/admin/Sidebar";
import Headerbar from "@/app/api/admin/Headerbar";
import ProtectRouteAdmin from "@/app/api/routes/ProtectRouteAdmin";

export default function AdminInventoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectRouteAdmin>
      <div className="flex h-screen w-full">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Headerbar />
          <main className="flex-1 p-6 bg-gray-200 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </ProtectRouteAdmin>
  );
}

