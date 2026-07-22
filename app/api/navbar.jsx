"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useEcomStore from "@/store/ecom-store";
import { CircleUserRound, ChevronDown } from "lucide-react";
import { showToast } from "nextjs-toast-notify";

const Navbar = () => {
  const carts = useEcomStore((state) => state.carts);
  const [isOpen, setIsOpen] = useState(false);
  const token = useEcomStore((state) => state.token);
  const user = useEcomStore((state) => state.user);
  const logout = useEcomStore((state) => state.logout);
  const pathname = usePathname();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const getNavLinkClass = (path) => {
    const isActive = pathname === path || pathname.startsWith(path + "/");
    return isActive
      ? "bg-white px-2 py-1 rounded-md text-sm font-bold text-black"
      : "px-2 py-1 rounded-md text-sm font-bold hover:bg-white hover:text-black";
  };

  return (
    <nav className="bg-neutral-900">
      <div className="mx-auto px-4">
        <div className="flex justify-between h-16 text-white">
          <div className="flex items-center gap-4">
            <Link href={"/inventory"} className="text-2xl font-bold">
              E-COM Store
            </Link>

            <Link
              href={"/inventory"}
              className={
                pathname === "/inventory"
                  ? "bg-white px-2 py-1 rounded-md text-sm font-bold text-black"
                  : "px-2 py-1 rounded-md text-sm font-bold hover:bg-white hover:text-black"
              }
            >
              หน้าแรก
            </Link>

            <Link
              href={"/inventory/shop"}
              className={getNavLinkClass("/inventory/shop")}
            >
              คลังพัสดุ
            </Link>

            <Link
              href={"/inventory/user/history"}
              className={getNavLinkClass("/inventory/user/history")}
              onClick={(e) => {
                if (!token) {
                  e.preventDefault();
                  showToast.info("กรุณา ลงชื่อเข้าใช้งานก่อน");
                }
              }}
            >
              ประวัติการเบิก
            </Link>

            <Link
              href={"/inventory/cart"}
              className={getNavLinkClass("/inventory/cart") + " relative"}
            >
              ตะกร้า
              {carts.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 rounded-full px-2 text-xs">
                  {carts.length}
                </span>
              )}
            </Link>
          </div>

          {user ? (
            <div className="flex items-center gap-2 hover:bg-white hover:text-black rounded-sm relative">
              <button
                className="flex items-center gap-2"
                onClick={toggleDropdown}
              >
                <CircleUserRound />
                <ChevronDown />
              </button>
              {isOpen && (
                <div className="absolute mt-2 top-10 right-0 bg-black text-white shadow-md rounded-md p-2 z-50 min-w-32">
                  {user.role === "admin" && (
                    <Link
                      href="/inventory/admin"
                      className="block text-sm font-bold hover:text-gray-300 pb-2 border-b border-gray-700 mb-2"
                      onClick={() => setIsOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="text-sm font-bold hover:text-gray-300 w-full text-left"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href={"/inventory/register"}
                className={getNavLinkClass("/inventory/register")}
              >
                Register
              </Link>
              <Link
                href={"/inventory/login"}
                className={getNavLinkClass("/inventory/login")}
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
