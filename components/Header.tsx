"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Menu, X } from "lucide-react";

export function Header() {
  const [isSticky, setIsSticky] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);
  const [showEmployeeLogin, setShowEmployeeLogin] = useState(false);
  const [employeeCode, setEmployeeCode] = useState("");
  const [employeeToken, setEmployeeToken] = useState<string | null>(
    typeof window !== "undefined"
      ? localStorage.getItem("employee_token")
      : null,
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleEmployeeLogin = async () => {
    const res = await fetch("/api/employee-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: employeeCode }),
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("employee_token", data.token);
      setEmployeeToken(data.token);
      setShowEmployeeLogin(false);
      setEmployeeCode("");
      window.location.href = "/main/employee"; // ← redirect หลัง login สำเร็จ
    } else {
      alert(data.message);
    }
  };

  const navItems: {
    name: string;
    href: string;
    onClick?: () => void;
    children?: { name: string; href: string }[];
  }[] = [
    {
      name: "เกี่ยวกับเรา",
      href: "#",
      children: [
        { name: "ประวัติโรงพยาบาล", href: "/main/about/history" },
        { name: "วิสัยทัศน์ ", href: "/main/about/vision" },
        { name: "พันธกิจของเรา", href: "/main/about/purpose" },
        { name: "คณะผู้บริหาร", href: "/main/about/structure" },
        { name: "หน่วยงานต่างๆ", href: "/main/about/department" },
      ],
    },
    {
      name: "บริการทางการแพทย์",
      href: "#",
      children: [
        { name: "งานบริการคลินิก", href: "/main/services/clinics" },
        { name: "รายชื่อแพทย์", href: "/main/services/doctors" },
      ],
    },

    { name: "ข่าวสาร", href: "/main/news" },
    { name: "ติดต่อเรา", href: "/main/contact" },
    { name: "บริจาค", href: "/main/donate" },
    {
      name: "สำหรับเจ้าหน้าที่",
      href: "#",
      onClick: () => {
        if (employeeToken) {
          window.location.href = "/main/employee"; // มี token แล้วไปเลย
        } else {
          setShowEmployeeLogin(true); // ยังไม่มี token แสดง popup
        }
      },
    },
  ];

  return (
    <>
      <header className="w-full shadow-sm bg-teal-950">
        {/* Top Bar with Logo and Info */}
        <div className="container mx-auto px-4 py-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Logo"
              width={50}
              height={50}
              className="w-10 h-10 sm:w-12 sm:h-12"
            />
            <Link
              href="/main"
              className="text-lg sm:text-2xl font-kanit font-bold tracking-wide bg-gradient-to-r from-white via-orange-100 to-white bg-clip-text text-transparent"
            >
              SATTAHIP HOSPITAL
            </Link>
          </div>
          <div className="hidden lg:flex gap-6 text-sm">
            <div>
              <span className="opacity-80">เบอร์ติดต่อ</span>
              <p className="font-semibold">038245051</p>
            </div>
            <div>
              <span className="opacity-80">ช่วงเวลาเปิดทำการ</span>
              <p className="font-semibold">08:00 -16:00 ทุกวัน</p>
            </div>
            <div>
              <span className="opacity-80">ตำแหน่งที่ตั้ง</span>
              <p className="font-semibold">
                331 ทางหลวงยุทธศาสตร์ สัตหีบ - พนมสารคาม
              </p>
              <p className="font-semibold">
                ต.พลูตาหลวง 20180, อ.สัตหีบ, จ.ชลบุรี
              </p>
            </div>
          </div>
        </div>
      </header>

      <div
        className={`sticky top-2 z-50 bg-emerald-700 text-white ${isSticky ? "rounded-3xl shadow-xl mx-2 sm:mx-4 py-2 bg-teal-950" : ""}`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Desktop Nav */}
            <nav className="hidden md:flex gap-6 lg:gap-8 h-full items-center">
              {navItems.map((item) => (
                <div
                  key={item.name}
                  className="relative group h-full py-4 flex items-center"
                >
                  {item.onClick ? (
                    <button
                      className="text-white/90 font-medium py-4 hover:text-amber-100 transition-colors flex items-center gap-1 text-sm lg:text-base"
                      onClick={item.onClick}
                    >
                      {item.name}
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-white/90 font-medium py-4 hover:text-amber-100 transition-colors flex items-center gap-1 text-sm lg:text-base"
                    >
                      {item.name}
                      {item.children && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="opacity-70 group-hover:rotate-180 transition-transform duration-200"
                        >
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      )}
                    </Link>
                  )}

                  {/* Dropdown Menu */}
                  {item.children && (
                    <div className="absolute top-full left-0 hidden group-hover:block pt-2 w-56 animate-in fade-in zoom-in-95 duration-200">
                      <div className="bg-white rounded-lg shadow-xl overflow-hidden py-2 border border-emerald-400">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className="block px-4 py-3 text-sm text-gray-950 hover:bg-emerald-50 hover:text-gray-950 transition-colors border-l-2 border-transparent hover:border-gray-950"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Mobile hamburger + search */}
            <div className="flex items-center gap-2 md:hidden">
              <button className="p-2 hover:bg-white/10 rounded-full">
                <Search className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 hover:bg-white/10 rounded-full"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-white" />
                ) : (
                  <Menu className="w-6 h-6 text-white" />
                )}
              </button>
            </div>

            {/* Desktop search */}
            <div className="hidden md:flex items-center gap-4">
              <button className="p-2 hover:bg-white/10 rounded-full">
                <Search className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-teal-900 border-t border-white/10">
            <div className="container mx-auto px-4 py-4 space-y-1">
              {navItems.map((item) => (
                <div key={item.name}>
                  {item.children ? (
                    <>
                      <button
                        onClick={() =>
                          setMobileDropdown(
                            mobileDropdown === item.name ? null : item.name,
                          )
                        }
                        className="w-full flex items-center justify-between px-3 py-3 text-white/90 hover:bg-white/10 rounded-lg transition-colors text-sm"
                      >
                        <span>{item.name}</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={`opacity-70 transition-transform duration-200 ${mobileDropdown === item.name ? "rotate-180" : ""}`}
                        >
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </button>
                      {mobileDropdown === item.name && (
                        <div className="pl-4 space-y-1">
                          {item.children.map((child) => (
                            <Link
                              key={child.name}
                              href={child.href}
                              onClick={() => setMobileMenuOpen(false)}
                              className="block px-3 py-2 text-sm text-white/80 hover:bg-white/10 rounded-lg transition-colors"
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : item.onClick ? (
                    <button
                      onClick={() => {
                        item.onClick?.();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-3 text-white/90 hover:bg-white/10 rounded-lg transition-colors text-sm"
                    >
                      {item.name}
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-3 text-white/90 hover:bg-white/10 rounded-lg transition-colors text-sm"
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {showEmployeeLogin && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-80 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-800 mb-1">
              สำหรับเจ้าหน้าที่
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              กรอกรหัส 5 หลักท้ายของบัตรประชาชน
            </p>

            <input
              type="password"
              maxLength={5}
              value={employeeCode}
              onChange={(e) => setEmployeeCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleEmployeeLogin()}
              placeholder="X X X X X"
              className="w-full text-center text-2xl tracking-widest border-2 rounded-lg px-4 py-3 mb-4 outline-none focus:border-emerald-500"
            />

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowEmployeeLogin(false);
                  setEmployeeCode("");
                }}
                className="flex-1 py-2 rounded-lg border text-gray-600 hover:bg-gray-50"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleEmployeeLogin}
                className="flex-1 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
              >
                เข้าสู่ระบบ
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
