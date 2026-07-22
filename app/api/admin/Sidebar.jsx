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

const Sidebar = () => {
  const user = useEcomStore((state) => state.user);
  const logout = useEcomStore((state) => state.logout);
  const pathname = usePathname();

  const getNavLinkClass = (path, exact = false) => {
    const isActive = exact ? pathname === path : pathname.startsWith(path);
    return isActive
      ? "bg-neutral-900 rounded-md text-white px-4 py-2 flex items-center "
      : "tex-gray-300 px-4 py-2 hover:bg-gray-700 hover:text-white rounded flex items-center";
  };

  return (
    <div className="bg-zinc-800 w-64  text-white flex flex-col h-screen">
      <div className="h-24 bg-neutral-900 flex items-center justify-center tex-2xl font-bold">
        Admin Panel
      </div>
      <nav className="flex-1 px-4 py-4 space-y-2">
        <Link href={"/inventory/admin"} className={getNavLinkClass('/inventory/admin', true)}>
          <LayoutDashboard className="mr-2" />
          Dashboard
        </Link>

        <Link href={"/inventory/admin/manage"} className={getNavLinkClass('/inventory/admin/manage')}>
          <UserCog className="mr-2" />
          Manage
        </Link>

        <Link href={"/inventory/admin/category"} className={getNavLinkClass('/inventory/admin/category')}>
          <ChartBarStacked className="mr-2" />
          Category
        </Link>

        <Link href={"/inventory/admin/addproduct"} className={getNavLinkClass('/inventory/admin/addproduct')}>
          <PackagePlus className="mr-2" />
          Add Product
        </Link>

        <Link href={"/inventory/admin/product"} className={getNavLinkClass('/inventory/admin/product')}>
          <PackageSearch className="mr-2" />
          Product
        </Link>

        <Link href={"/inventory/admin/orders"} className={getNavLinkClass('/inventory/admin/orders')}>
          <History className="mr-2" />
          Orders
        </Link>

        <Link href={"/inventory/admin/report"} className={getNavLinkClass('/inventory/admin/report')}>
          <Newspaper className="mr-2" />
          Report
        </Link>

        <Link href={"/inventory"} className={getNavLinkClass('/inventory', true)}>
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
  );
};

export default Sidebar;
