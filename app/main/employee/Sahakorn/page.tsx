"use client";

import { useState } from "react";
import { CreditCard, ChevronLeft, ChevronRight } from "lucide-react";
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
    imageSrc: "/Sahakorn.png",
    label: "สหกรณ์ออมทรัพย์สาธารณสุขชลบุรี จำกัด",
    description: "เข้าสู่ระบบสหกรณ์ออมทรัพย์",
    color: "text-black",
    bgGradient: "from-slate-50 to-slate-100/50",
    href: "https://sav.tblcloudservice.com/coop_member_online/login.php?mem_online_fund=24ec013001c3e051fe76a59f4e384f17",
    iconClassName: "bg-white group-hover:bg-white",
    imageClassName: "w-40 h-16",
  },
  {
    imageSrc: "/Sahakorn.png",
    label: "แบบฟอร์มสหกรณ์ออมทรัพย์ สาธารณสุขชลบุรี จำกัด",
    description: "แบบฟอร์มสหกรณ์ออมทรัพย์ สาธารณสุขชลบุรี จำกัด",
    color: "text-indigo-600",
    bgGradient: "from-indigo-50 to-indigo-100/50",
    href: "https://cbicoop.com/?page_id=366",
    iconClassName: "bg-white group-hover:bg-white",
    imageClassName: "w-64 h-16",
  },
];

export default function Sahakorn() {
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
    <div className="w-full px-4 md:px-8 lg:px-12 max-w-7xl mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-primary border-l-4 border-emerald-700 pl-4 mt-10">
          สหกรณ์ออมทรัพย์สาธารณสุขชลบุรี จำกัด
        </h2>
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

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 relative min-h-[120px] ">
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
            "w-full group relative flex flex-col items-center justify-center p-6 bg-background border rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden";

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
