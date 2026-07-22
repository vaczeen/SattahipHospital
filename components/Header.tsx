"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";

export function Header() {

  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // header บนสูงประมาณ 100px ปรับตามจริง
      setIsSticky(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
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
    { name: "สำหรับเจ้าหน้าที่", href: "/main/employee" },
  ];

  return (
    <>
      <header className="w-full shadow-sm bg-teal-950">
        {/* Top Bar with Logo and Info (Simplified for now) */}
        <div className="container mx-auto px-4 py-4 flex justify-between items-center  text-white ">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="Logo" width={50} height={50} />
            <Link
              href="/main"
              className="text-2xl font-kanit font-bold tracking-wide bg-gradient-to-r from-emerald-300 via-white to-emerald-400 bg-clip-text text-transparent"
            >
              SATTAHIP HOSPITAL
            </Link>
          </div>
          <div className="hidden md:flex gap-6 text-sm ">
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


      <div className={`sticky top-2 z-50 bg-emerald-700 text-white ${isSticky ? "rounded-3xl shadow-xl mx-4 w-250 py-2 place-self-center bg-teal-950" : ""}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <nav className="flex gap-8 h-full items-center">
              {navItems.map((item) => (
                <div
                  key={item.name}
                  className="relative group h-full py-4 flex items-center "
                >
                  <Link
                    href={item.href}
                    className=" text-white/90 font-medium py-4 hover:text-amber-100 transition-colors flex items-center gap-1"
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

            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-white/10 rounded-full">
                <Search className="w-5 h-5 text-white" />
              </button>
              {/* <button className="bg-secondary hover:bg-secondary/90 text-primary-foreground px-6 py-2 rounded-md font-medium transition-colors">
                                Appointment
                            </button> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
