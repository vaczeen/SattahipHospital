"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UserCog,
  LogOut,
  ChartBarStacked,
  PackageSearch,
  History,
  PanelsTopLeft,
  PackagePlus,
  Newspaper,
} from "lucide-react";
import useEcomStore from "@/store/ecom-store";

const Sidebar = ({ isOpen, onClose }) => {
  const user = useEcomStore((state) => state.user);
  const logout = useEcomStore((state) => state.logout);
  const pathname = usePathname();

  const getNavLinkClass = (path, exact = false) => {
    const isActive = exact ? pathname === path : pathname.startsWith(path);
    return isActive
      ? "bg-neutral-900 rounded-md text-white px-4 py-2 flex items-center "
      : "tex-gray-300 px-4 py-2 hover:bg-gray-700 hover:text-white rounded flex items-center";
  };

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  return (
    <> 
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}

      {/* Sidebar */}
      <div className={
        `bg-zinc-800 w-64 text-white flex flex-col h-screen fixed lg:static z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`
      }>
        <div className="h-16 lg:h-24 bg-neutral-900 flex items-center justify-center text-xl lg:text-2xl font-bold">
          Admin Panel
        </div>
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          <Link href={"/inventory/admin"} className={getNavLinkClass('/inventory/admin', true)} onClick={handleNavClick}>
            <LayoutDashboard className="mr-2" />
            Dashboard
          </Link>

          <Link href={"/inventory/admin/manage"} className={getNavLinkClass('/inventory/admin/manage')} onClick={handleNavClick}>
            <UserCog className="mr-2" />
            Manage
          </Link>

          <Link href={"/inventory/admin/category"} className={getNavLinkClass('/inventory/admin/category')} onClick={handleNavClick}>
            <ChartBarStacked className="mr-2" />
            Category
          </Link>

          <Link href={"/inventory/admin/addproduct"} className={getNavLinkClass('/inventory/admin/addproduct')} onClick={handleNavClick}>
            <PackagePlus className="mr-2" />
            Add Product
          </Link>

          <Link href={"/inventory/admin/product"} className={getNavLinkClass('/inventory/admin/product')} onClick={handleNavClick}>
            <PackageSearch className="mr-2" />
            Product
          </Link>

          <Link href={"/inventory/admin/orders"} className={getNavLinkClass('/inventory/admin/orders')} onClick={handleNavClick}>
            <History className="mr-2" />
            Orders
          </Link>

          <Link href={"/inventory/admin/report"} className={getNavLinkClass('/inventory/admin/report')} onClick={handleNavClick}>
            <Newspaper className="mr-2" />
            Report
          </Link>

          <Link href={"/inventory"} className={getNavLinkClass('/inventory', true)} onClick={handleNavClick}>
            <PanelsTopLeft className="mr-2" />
            Main Menu
          </Link>
        </nav>

        <div>
          <Link
            href={"/inventory"}
            className="tex-gray-300 px-4 py-2 hover:bg-gray-700 hover:text-white rounded flex items-center"
            onClick={() => logout()}
          >
            <LogOut className="mr-2" />
            Logout
          </Link>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
