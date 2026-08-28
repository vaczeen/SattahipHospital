"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useEcomStore from "@/store/ecom-store";
import { CircleUserRound, ChevronDown, Menu, X } from "lucide-react";
import { showToast } from "nextjs-toast-notify";

const Navbar = () => {
  const carts = useEcomStore((state) => state.carts);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const token = useEcomStore((state) => state.token);
  const user = useEcomStore((state) => state.user);
  const logout = useEcomStore((state) => state.logout);
  const pathname = usePathname();

  const getNavLinkClass = (path) => {
    const isActive = pathname === path || pathname.startsWith(path + "/");
    return isActive
      ? "bg-white px-2 py-1 rounded-md text-sm font-bold text-black"
      : "px-2 py-1 rounded-md text-sm font-bold hover:bg-white hover:text-black";
  };

  return (
    <nav className="bg-neutral-900">
      <div className="mx-auto px-4">
        <div className="flex justify-between items-center h-14 md:h-16 text-white">
          {/* Logo + Desktop Nav Links (left side) */}
          <div className="flex items-center gap-2">
            <Link
              href={"/inventory"}
              className="text-xl md:text-2xl font-bold shrink-0"
            >
              BECCA
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1">
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
          </div>

          {/* Right side: User / Auth + Mobile hamburger */}
          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2 hover:bg-white hover:text-black rounded-sm relative">
                <button
                  className="flex items-center gap-2"
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                >
                  <CircleUserRound />
                  <ChevronDown className="hidden sm:block" />
                </button>
                {isUserDropdownOpen && (
                  <div className="absolute mt-2 top-10 right-0 bg-black text-white shadow-md rounded-md p-2 z-50 min-w-32">
                    {user.role === "admin" && (
                      <Link
                        href="/inventory/admin"
                        className="block text-sm font-bold hover:text-gray-300 pb-2 border-b border-gray-700 mb-2"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setIsUserDropdownOpen(false);
                      }}
                      className="text-sm font-bold hover:text-gray-300 w-full text-left"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-4">
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

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-white/10 rounded-lg"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-700 py-3 space-y-1">
            <Link
              href={"/inventory"}
              onClick={() => setIsMobileMenuOpen(false)}
              className={
                pathname === "/inventory"
                  ? "block bg-white px-3 py-2 rounded-md text-sm font-bold text-black"
                  : "block px-3 py-2 rounded-md text-sm font-bold hover:bg-white hover:text-black text-white"
              }
            >
              หน้าแรก
            </Link>
            <Link
              href={"/inventory/shop"}
              onClick={() => setIsMobileMenuOpen(false)}
              className={
                pathname.startsWith("/inventory/shop")
                  ? "block bg-white px-3 py-2 rounded-md text-sm font-bold text-black"
                  : "block px-3 py-2 rounded-md text-sm font-bold hover:bg-white hover:text-black text-white"
              }
            >
              คลังพัสดุ
            </Link>
            <Link
              href={"/inventory/user/history"}
              onClick={(e) => {
                setIsMobileMenuOpen(false);
                if (!token) {
                  e.preventDefault();
                  showToast.info("กรุณา ลงชื่อเข้าใช้งานก่อน");
                }
              }}
              className={
                pathname.startsWith("/inventory/user/history")
                  ? "block bg-white px-3 py-2 rounded-md text-sm font-bold text-black"
                  : "block px-3 py-2 rounded-md text-sm font-bold hover:bg-white hover:text-black text-white"
              }
            >
              ประวัติการเบิก
            </Link>
            <Link
              href={"/inventory/cart"}
              onClick={() => setIsMobileMenuOpen(false)}
              className={
                pathname.startsWith("/inventory/cart")
                  ? "block bg-white px-3 py-2 rounded-md text-sm font-bold text-black relative"
                  : "block px-3 py-2 rounded-md text-sm font-bold hover:bg-white hover:text-black relative text-white"
              }
            >
              ตะกร้า
              {carts.length > 0 && (
                <span className="absolute top-1 right-2 bg-red-500 rounded-full px-2 text-xs text-white">
                  {carts.length}
                </span>
              )}
            </Link>
            {!user && (
              <>
                <Link
                  href={"/inventory/register"}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-sm font-bold hover:bg-white hover:text-black text-white"
                >
                  Register
                </Link>
                <Link
                  href={"/inventory/login"}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-sm font-bold hover:bg-white hover:text-black text-white"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
