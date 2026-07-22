"use client";

import { useState } from "react";
import {
  User,
  SunSnow,
  Car,
  Wrench,
  CreditCard,
  Receipt,
  ChartNoAxesCombined,
  FolderOpen,
  Store,
  Phone,
  HeartHandshake,
  ChevronLeft,
  ChevronRight,
  Scale,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface MenuItem {
  icon?: React.ElementType;
  imageSrc?: string;
  label: string;
  description: string;
  color: string;
  bgGradient: string;
 
  href?: string;
  iconClassName?: string;
  imageClassName?: string;
}

const menuItems: MenuItem[] = [
  {
    icon: FolderOpen,
    label: "เอกสาร",
    description: "คลังเอกสารโรงพยาบาล",
    color: "text-indigo-600",
    bgGradient: "from-indigo-50 to-indigo-100/50",
  },
  {
    icon: User,
    label: "ข้อมูลภายใน",
    description: "ข้อมูลบุคคล,ทะเบียนทรัพย์สิน,รายงานลูกหนี้",
    color: "text-blue-600",
    bgGradient: "from-blue-50 to-blue-100/50",
    href: "http://10.0.1.7/",
  },
  {
    icon: Phone,
    label: "เบอร์โทรศัพท์ภายใน",
    description: "ค้นหาหมายเลขภายใน",
    color: "text-blue-500",
    bgGradient: "from-blue-50 to-blue-100/50",
    href: "/main/employee/TelNumber",
  },
  {
    icon: Car,
    label: "ขออนุญาตใช้รถส่วนกลาง",
    description: "ขออนุญาตใช้รถส่วนกลาง",
    color: "text-violet-600",
    bgGradient: "from-violet-50 to-violet-100/50",
    href: "http://10.0.1.10/CAR/index.php",
  },
  {
    icon: Wrench,
    label: "ขออนุมัติซ่อมพัสดุ",
    description: "ขออนุมัติซ่อมพัสดุ",
    color: "text-orange-600",
    bgGradient: "from-orange-50 to-orange-100/50",
  },
  {
    icon: CreditCard,
    label: "ระบบเงินเดือน",
    description: "ตรวจสอบรายรับ",
    color: "text-cyan-600",
    bgGradient: "from-cyan-50 to-cyan-100/50",
    href: "/main/employee/SalaryModule",
  },
  {
    icon: Receipt,
    label: "รายชื่อบริษัทรับเช็ค",
    description: "รายชื่อบริษัทรับเช็ค",
    color: "text-rose-600",
    bgGradient: "from-rose-50 to-rose-100/50",
    href: "http://c.km10.org/check/show.php",
  },
  {
    icon: ChartNoAxesCombined,
    label: "KPI Monitor",
    description: "KPI และ Performance",
    color: "text-amber-600",
    bgGradient: "from-amber-50 to-amber-100/50",
    href: "http://10.0.1.10/KPI%20monitor/Report.php",
  },
  {
    icon: Store,
    label: "เบิกพัสดุคอมพิวเตอร์",
    description: "เบิกพัสดุคอมพิวเตอร์/หมึกพิมพ์",
    color: "text-pink-600",
    href: "/inventory",
    bgGradient: "from-pink-50 to-pink-100/50",
  },
  {
    imageSrc: "/smo.png",
    label: "Smart Office",
    description: "Smart Office",
    color: "text-black",
    bgGradient: "from-slate-50 to-slate-100/50",
    href: "http://a.km10.org:8087/login?ReturnUrl=%2F",
    iconClassName: "bg-gray-800 group-hover:bg-gray-900/80",
  },
  {
    imageSrc: "/Sahakorn.png",
    label: "สหกรณ์ออมทรัพย์สาธารณสุขชลบุรี จำกัด",
    description: "เข้าสู่ระบบสมาชิกออนไลน์",
    color: "text-black",
    bgGradient: "from-slate-50 to-slate-100/50",
    href: "/main/employee/Sahakorn",
    iconClassName: "bg-white group-hover:bg-white",
    imageClassName: "w-40 h-16",
  },
  {
    icon: Scale,
    label: "กฎระเบียบและข้อปฏิบัติ",
    description: "กฎระเบียบและข้อปฏิบัติในโรงพยาบาล",
    color: "text-yellow-600",
    bgGradient: "from-yellow-50 to-yellow-100/50",
    href: "/main/employee/Rules",
  },
  {
    icon: SunSnow,
    label: "Cool Chain",
    description: "อุณหภูมิตู้",
    color: "text-cyan-600",
    bgGradient: "from-cyan-50 to-cyan-100/50",
    href: "https://www.km10.org/th/",
  },
  {
    imageSrc: "/hdc.png",
    label: "HDC",
    description: "HDC,HDC58,PDC,OP.NSHO",
    color: "text-cyan-600",
    bgGradient: "from-cyan-50 to-cyan-100/50",
    href: "https://hdc.moph.go.th/cbi/public/main",
    iconClassName: "bg-white group-hover:bg-white",
    imageClassName: "w-16 h-16",
  },
  {
    imageSrc: "/nsho.png",
    label: "OP.NHSO",
    description: "OP.NHSO",
    color: "text-cyan-600",
    bgGradient: "from-cyan-50 to-cyan-100/50",
    href: "https://maintenance.nhso.go.th/",
    iconClassName: "bg-white group-hover:bg-white",
    imageClassName: "w-16 h-16",
  },
  {
    imageSrc: "/MorStation.png",
    label: "หมอพร้อม Station",
    description: "หมอพร้อม Station",
    color: "text-black",
    bgGradient: "from-slate-50 to-slate-100/50",
    href: "https://mohpromtstation.moph.go.th/login",
    iconClassName: "bg-white group-hover:bg-white",
    imageClassName: "w-16 h-16",
  },
  {
    imageSrc: "/5.jpg",
    label: "MOPH ERP",
    description: "Hospital bed information Administration",
    color: "text-black",
    bgGradient: "from-slate-50 to-slate-100/50",
    href: "https://mohpromtstation.moph.go.th/login",
    iconClassName: "bg-white group-hover:bg-white",
    imageClassName: "w-16 h-16",
  },
  {
    imageSrc: "/5.jpg",
    label: "สำนักงานปลัดกระทรวงสาธารณสุข",
    description: "ข้อมูลบุคลากรรายบุคคล NonHR",
    color: "text-black",
    bgGradient: "from-slate-50 to-slate-100/50",
    href: "https://nonhr.moph.go.th/",
    iconClassName: "bg-white group-hover:bg-white",
    imageClassName: "w-16 h-16",
  },
];

export function EmployeeCard() {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 15;
  const totalPages = Math.ceil(menuItems.length / itemsPerPage);

  const nextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages - 1));
  const prevPage = () => setCurrentPage((p) => Math.max(p - 1, 0));

  const currentItems = menuItems.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage,
  );

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-950 border-l-4 border-emerald-700 pl-4">
          เมนูสำหรับเจ้าหน้าที่
        </h1>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={prevPage}
              disabled={currentPage === 0}
              className="p-2 rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-medium text-gray-500">
              {currentPage + 1} / {totalPages}
            </span>
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages - 1}
              className="p-2 rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-hidden relative min-h-[120px]">
        {currentItems.map((item, index) => {
          const CardContent = () => (
            <>
              {/* Background Gradient Effect on Hover */}
              <div
                className={cn(
                  "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br",
                  item.bgGradient,
                )}
              />

              <div
                className={cn(
                  "relative z-10 p-4 rounded-2xl bg-muted/30 group-hover:bg-white/60 group-hover:shadow-sm transition-all duration-300 mb-3",
                  item.color,
                  item.iconClassName,
              
                )}
              >
             
                {item.imageSrc ? (
                  <div className={cn("w-8 h-8 relative", item.imageClassName)}>
                    <Image
                      src={item.imageSrc}
                      alt={item.label}
                      fill
                      sizes="1080px"
                      className="object-contain"
                    />
                  </div>
                ) : (
                  item.icon && (
                    <item.icon className="w-8 h-8" strokeWidth={1.5} />
                  )
                )}
              </div>

              <div className="relative z-10 text-center space-y-1">
                <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                  {item.label}
                </h3>
                <p className="text-xs text-muted-foreground group-hover:text-gray-600 transition-colors">
                  {item.description}
                </p>
              </div>

              {/* Visual Decorative Element - Only show if icon exists */}
              {item.icon && (
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-20 transition-all duration-300 transform translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0">
                  <item.icon
                    className={cn("w-12 h-12 rotate-12", item.color)}
                  />
                </div>
              )}
                  
            </>
          );

          const cardClasses =
            "group relative flex flex-col items-center justify-center p-6 bg-background border rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden";

          if (item.href) {
            return (
              <Link
                key={index}
                href={item.href}
                className={cardClasses}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  item.href.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
              >
                <CardContent />
              </Link>
            );
          }

          return (
            <div key={index} className={cardClasses}>
              <CardContent />
            </div>
          );
        })}
      </div>
    </div>
  );
}
