"use client";

import React, { useState } from "react";
import Sidebar from "@/app/api/admin/Sidebar";
import ProtectRouteAdmin from "@/app/api/routes/ProtectRouteAdmin";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export default function AdminInventoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProtectRouteAdmin>
      <div className="flex h-screen w-full">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile header */}
          <header className="lg:hidden bg-white h-14 flex items-center px-4 shadow-sm sticky top-0 z-30">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
            <Link href="/inventory/admin" className="ml-3 text-lg font-bold text-gray-800">
              Admin Panel
            </Link>
          </header>

          <main className="flex-1 p-3 sm:p-4 md:p-6 bg-gray-200 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </ProtectRouteAdmin>
  );
}

