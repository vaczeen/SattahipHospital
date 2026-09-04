import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";

interface MenuItem {
  icon?: React.ElementType;
  imageSrc?: string;
  label: string;
  description: string;
  color: string;
  bgGradient: string;
  href?: string;
  iconClassName?: string;
}

const menuItems: MenuItem[] = [
  {
    imageSrc: "/1.jpg",
    label: "แพทย์สภา",
    description: "The Medical Council of Thailand",
    color: "text-black",
    bgGradient: "from-slate-50 to-slate-100/50",
    href: "https://www.tmc.or.th/",
    iconClassName: "bg-white group-hover:bg-white",
  },
  {
    imageSrc: "/2.jpg",
    label: "สภาเภสัชกรรม",
    description: "The Pharmacy Council",
    color: "text-black",
    bgGradient: "from-slate-50 to-slate-100/50",
    href: "https://www.pharmacycouncil.org/",
    iconClassName: "bg-white group-hover:bg-white",
  },
  {
    imageSrc: "/3.jpg",
    label: "สภาการพยาบาล",
    description: "Thailand Nursing and Midwifery Council",
    color: "text-black",
    bgGradient: "from-slate-50 to-slate-100/50",
    href: "https://www.tnmc.or.th/",
    iconClassName: "bg-white group-hover:bg-white",
  },
  {
    imageSrc: "/4.jpg",
    label: "ทันตแพทย์สภา",
    description: "The Dental Council of Thailand",
    color: "text-black",
    bgGradient: "from-slate-50 to-slate-100/50",
    href: "https://dentalcouncil.or.th/",
    iconClassName: "bg-white group-hover:bg-white",
  },

  {
    imageSrc: "/8.jpg",
    label: "หมอพร้อม PHR",
    description: "MOPH PHR Center",
    color: "text-black",
    bgGradient: "from-slate-50 to-slate-100/50",
    href: "https://phr1.moph.go.th/dashboard/",
    iconClassName: "bg-white group-hover:bg-white",
  },
  {
    imageSrc: "/9.jpg",
    label:
      "ศูนย์มาตรฐานรหัสและข้อมูลสุขภาพแห่งชาติ กลุ่มพัฒนามาตรฐานรหัสด้านสุขภาพ",
    description: "Thai Health Coding Center",
    color: "text-black",
    bgGradient: "from-slate-50 to-slate-100/50",
    href: "http://thcc.or.th/index.php",
    iconClassName: "bg-white group-hover:bg-white",
  },
  {
    imageSrc: "/10.jpg",
    label: "MOPH Claim",
    description:
      "ระบบบริหารจัดการข้อมูลเบิกจ่ายค่าบริการสาธารณสุขของกระทรวงสาธารณสุข",
    color: "text-black",
    bgGradient: "from-slate-50 to-slate-100/50",
    href: "https://claim-nhso.moph.go.th/nhso/",
    iconClassName: "bg-white group-hover:bg-white",
  },
  {
    imageSrc: "/13.jpg",
    label: "สำนักงานหลักประกันสุขภาพแห่งชาติ",
    description: "National Health Security Office",
    color: "text-black",
    bgGradient: "from-slate-50 to-slate-100/50",
    href: "https://www.nhso.go.th/",
    iconClassName: "bg-white group-hover:bg-white",
  },
  {
    imageSrc: "/14.jpg",
    label: "สำนักงานประกันสังคม",
    description: "Social Security Office",
    color: "text-black",
    bgGradient: "from-slate-50 to-slate-100/50",
    href: "https://www.sso.go.th/wpr/",
    iconClassName: "bg-white group-hover:bg-white",
  },
  {
    imageSrc: "/15.jpg",
    label: "กรมบัญชีกลาง",
    description: "The Comptroller General's Department",
    color: "text-black",
    bgGradient: "from-slate-50 to-slate-100/50",
    href: "https://www.cgd.go.th/cs/internet/internet/%E0%B8%AB%E0%B8%99%E0%B9%89%E0%B8%B2%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%812.html?page_locale=th_TH",
    iconClassName: "bg-white group-hover:bg-white",
  },
  {
    imageSrc: "/5.jpg",
    label: "สำนักงานสาธารณสุขจังหวัด ชลบุรี",
    description: "Chonburi Provincial Public Health Office",
    color: "text-black",
    bgGradient: "from-slate-50 to-slate-100/50",
    href: "https://www.cbo.moph.go.th/cbonew/index.php/home#",
    iconClassName: "bg-white group-hover:bg-white",
  },
  {
    imageSrc: "/5.jpg",
    label: "กระทรวงสาธารณสุข",
    description: "Ministry of Public Health",
    color: "text-black",
    bgGradient: "from-slate-50 to-slate-100/50",
    href: "https://moph.go.th/",
    iconClassName: "bg-white group-hover:bg-white",
  },
  {
    imageSrc: "/5.jpg",
    label: "MOPH Immunization Center",
    description: "ระบบฐานข้อมูลกลางของกระทรวงสาธารณสุข",
    color: "text-black",
    bgGradient: "from-slate-50 to-slate-100/50",
    href: "https://cvp1.moph.go.th/accountcenter/",
    iconClassName: "bg-white group-hover:bg-white",
  },
  {
    imageSrc: "/5.jpg",
    label: "กรมอนามัย",
    description: "ศูนย์อนามัยที่ 6 ชลบุรี",
    color: "text-black",
    bgGradient: "from-slate-50 to-slate-100/50",
    href: "https://hpc6.anamai.moph.go.th/th",
    iconClassName: "bg-white group-hover:bg-white",
  },
  {
    imageSrc: "/5.jpg",
    label: "สำนักงานสาธารณสุขอำเภอ สัตหีบ",
    description: "Sattahip District Public Health Office",
    color: "text-black",
    bgGradient: "from-slate-50 to-slate-100/50",
    href: "https://www.ssosth.go.th/sattahip/",
    iconClassName: "bg-white group-hover:bg-white",
  },
];

export default function externalAgencies() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Link
        href="/main"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary transition-colors mb-6 group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />{" "}
        กลับหน้าแรก
      </Link>

      <h1 className="text-3xl font-bold text-gray-950 mb-8 border-l-4 border-emerald-700 pl-4">
        หน่วยงานต่างๆ
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {menuItems.map((item, index) => {
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
                  <div className="w-60 h-60 relative">
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
            "group relative flex flex-col items-center justify-center p-2 bg-background border rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden";

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
