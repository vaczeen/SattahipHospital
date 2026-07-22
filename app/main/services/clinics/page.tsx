import React from "react";
import Link from "next/link";
import {
  Stethoscope,
  BicepsFlexed,
  HeartPulse,
  Flower2,
  Building2,
  Users,
  Clock,
  ChevronLeft,
} from "lucide-react";
import { LiaToothSolid } from "react-icons/lia";
import { FaBedPulse } from "react-icons/fa6";
import { HugeiconsIcon } from "@hugeicons/react";
import { DentalToothIcon } from "@hugeicons/core-free-icons";
import { TbMassage } from "react-icons/tb";

interface Clinic {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  color: string; // Text color
  bgColor: string; // Background color for icon wrapper
  hoverBorder: string; // Border color on hover
}

const clinics: Clinic[] = [
  {
    id: "opd",
    title: "ผู้ป่วยนอก (OPD)",
    description: "บริการตรวจรักษาโรคทั่วไป โดยแพทย์ผู้เชี่ยวชาญ",
    icon: Stethoscope,
    href: "/main/services/clinics/OPD",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    hoverBorder: "hover:border-blue-500",
  },
  {
    id: "special",
    title: "คลินิกพิเศษ",
    description: "บริการตรวจรักษาโดยแพทย์เฉพาะทางสาขาต่างๆ",
    icon: HeartPulse,
    href: "/main/services/clinics/SpecialClinic",
    color: "text-red-600",
    bgColor: "bg-red-100",
    hoverBorder: "hover:border-red-500",
  },
  {
    id: "dent",
    title: "ทันตกรรม (Dental)",
    description: "บริการตรวจรักษา ฟัน ขูดหินปูน อุดฟัน ถอนฟัน",
    icon: (props: any) => <HugeiconsIcon icon={DentalToothIcon} {...props} />,
    href: "/main/services/clinics/Dent",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    hoverBorder: "hover:border-purple-500",
  },
  {
    id: "ppcu",
    title: "ศูนย์สุขภาพชุมชนเมืองพลูตาหลวง ",
    description: "บริการสุขภาพระดับปฐมภูมิ ใกล้บ้าน ใกล้ใจ",
    icon: Users,
    href: "/main/services/clinics/PPCU",
    color: "text-orange-600",
    bgColor: "bg-orange-100",
    hoverBorder: "hover:border-orange-500",
  },

  {
    id: "pt",
    title: "กายภาพบำบัด (Physical Therapy)",
    description: "ฟื้นฟูสมรรถภาพร่างกาย ลดอาการปวด",
    icon: BicepsFlexed,
    href: "/main/services/clinics/PT",
    color: "text-indigo-600",
    bgColor: "bg-indigo-100",
    hoverBorder: "hover:border-indigo-500",
  },

  {
    id: "thai-mass",
    title: "แพทย์แผนไทย (Thai Traditional Medicine)",
    description: "นวดแผนไทย ประคบสมุนไพร และการดูแลสุขภาพวิถีไทย",
    icon: TbMassage,
    href: "/main/services/clinics/ThaiMassage",
    color: "text-sky-600",
    bgColor: "bg-sky-100",
    hoverBorder: "hover:border-sky-500",
  },
];

const scheduleData = [
  {
    dept: "แผนกผู้ป่วยนอก (OPD)",
    days: {
      mon: ["ตรวจโรคทั่วไป", "คลินิกความดัน (HT)"],
      tue: [
        "ตรวจโรคทั่วไป",
        "คลินิกโรคหอบหืด (Asthma)",
        "คลินิกโรคปอดอุดกั้นเรื้อรัง (COPD)",
      ],
      wed: [
        "ตรวจโรคทั่วไป",
        "คลินิกเบาหวาน (DM)",
        "ผู้ป่วยความเสี่ยงสูง (High Risk)",
      ],
      thu: ["ตรวจโรคทั่วไป", "คลินิกวัณโรคปอด (TB)", "คลินิกชะลอไต (CKD)"],
      fri: ["ตรวจโรคทั่วไป", "คลินิกเบาหวาน (DM)"],
    },
  },
  {
    dept: "ทันตกรรม",
    days: {
      mon: ["ทันตกรรมทั่วไป (8.00 - 11.00 น.)", "คิวนัด (13.00 - 15.00 น.)"],
      tue: [
        "ทันตกรรมทั่วไป (8.00 - 11.00 น.)",
        "คิวนัด (13.00 - 15.00 น.)",
        "นอกเวลา (16.00 - 20.00 น.)",
      ],
      wed: [
        "ทันตกรรมทั่วไป (8.00 - 11.00 น.)",
        "คิวนัด (13.00 - 15.00 น.)",
        "นอกเวลา (16.00 - 20.00 น.)",
      ],
      thu: ["ทันตกรรมทั่วไป (8.00 - 11.00 น.)", "คิวนัด (13.00 - 15.00 น.)"],
      fri: ["ทันตกรรมทั่วไป (8.00 - 11.00 น.)"],
    },
  },
  {
    dept: "กายภาพบำบัด",
    days: {
      mon: ["ให้บริการ (8.00 - 16.00 น.)"],
      tue: ["ให้บริการ (8.00 - 16.00 น.)"],
      wed: ["ให้บริการ (8.00 - 16.00 น.)"],
      thu: ["ให้บริการ (8.00 - 16.00 น.)"],
      fri: ["ให้บริการ (8.00 - 16.00 น.)"],
    },
  },
  {
    dept: "แพทย์แผนไทย",
    days: {
      mon: ["ให้บริการ (8.00 - 12.00 น. และ 13.00 - 15.00 น.)"],
      tue: ["ให้บริการ (8.00 - 12.00 น. และ 13.00 - 15.00 น.)"],
      wed: ["ให้บริการ (8.00 - 12.00 น. และ 13.00 - 15.00 น.)"],
      thu: ["ให้บริการ (8.00 - 12.00 น. และ 13.00 - 15.00 น.)"],
      fri: ["ให้บริการ (8.00 - 14.00 น.)"],
    },
  },
  {
    dept: "ศูนย์สุขภาพชุมชนตำบลพลูตาหลวง",
    days: {
      mon: ["วางแผนครอบครัว (13.00 - 16.00 น.)"],
      tue: ["คัดกรองสุขภาพ (13.00 - 16.00 น.)"],
      wed: ["วางแผนครอบครัว (13.00 - 16.00 น.)"],
      thu: ["คัดกรองสุขภาพ (13.00 - 16.00 น.)"],
      fri: ["วางแผนครอบครัว (13.00 - 16.00 น.)"],
    },
  },
];

export default function ServicesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Link
        href="/main"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary transition-colors mb-6 group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />{" "}
        กลับหน้าแรก
      </Link>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-emerald-700 mb-4">
          บริการคลินิกของเรา
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          เราพร้อมให้บริการดูแลรักษาสุขภาพของท่าน
          ด้วยทีมแพทย์และบุคลากรทางการแพทย์มืออาชีพ
        </p>
      </div>

      {/* Schedule Table */}
      <div className="mb-20">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-emerald-700 p-6 text-white">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Clock className="w-7 h-7" />
              ตารางเวลาการให้บริการ
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-100">
                  <th className="p-5 font-bold text-gray-700 min-w-[200px]">
                    แผนก/วันทำการ
                  </th>
                  <th className="p-5 font-bold text-gray-700 min-w-[160px] bg-[#FFFDE1]">
                    จันทร์
                  </th>
                  <th className="p-5 font-bold text-gray-700 min-w-[160px] bg-[#FFD8DF]">
                    อังคาร
                  </th>
                  <th className="p-5 font-bold text-gray-700 min-w-[160px] bg-[#E8F5E9]">
                    พุธ
                  </th>
                  <th className="p-5 font-bold text-gray-700 min-w-[160px] bg-orange-100">
                    พฤหัสบดี
                  </th>
                  <th className="p-5 font-bold text-gray-700 min-w-[160px] bg-[#CBDCEB]">
                    ศุกร์
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {scheduleData.map((row, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-blue-50/30 transition-colors"
                  >
                    <td className="p-5 font-bold text-gray-800 bg-slate-50/50">
                      {row.dept}
                    </td>
                    <td className="p-5 bg-[#FFFDE1]">
                      <ul className="space-y-1">
                        {row.days.mon.map((item, i) => (
                          <li
                            key={i}
                            className="text-sm text-gray-600 flex items-start gap-2"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="p-5 bg-[#FFD8DF]">
                      <ul className="space-y-1">
                        {row.days.tue.map((item, i) => (
                          <li
                            key={i}
                            className="text-sm text-gray-600 flex items-start gap-2"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="p-5 bg-[#E8F5E9]">
                      <ul className="space-y-1">
                        {row.days.wed.map((item, i) => (
                          <li
                            key={i}
                            className="text-sm text-gray-600 flex items-start gap-2"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="p-5 bg-orange-100">
                      <ul className="space-y-1">
                        {row.days.thu.map((item, i) => (
                          <li
                            key={i}
                            className="text-sm text-gray-600 flex items-start gap-2"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="p-5 bg-[#CBDCEB]">
                      <ul className="space-y-1">
                        {row.days.fri.map((item, i) => (
                          <li
                            key={i}
                            className="text-sm text-gray-600 flex items-start gap-2"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center mb-8">
        <div className="h-0.5 w-1/3 bg-gray-200"></div>
        <span className="px-4 text-gray-400 text-xl font-medium uppercase tracking-wider">
          ข้อมูลเพิ่มเติม
        </span>
        <div className="h-0.5 w-1/3 bg-gray-200"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {clinics.map((clinic) => (
          <Link
            key={clinic.id}
            href={clinic.href}
            className={`
                            group bg-white rounded-2xl p-6 shadow-sm border border-transparent 
                            transition-all duration-300 hover:shadow-lg hover:-translate-y-1
                            h-60 flex flex-col min-h-[180px]
                            ${clinic.hoverBorder}
                        `}
          >
            <div
              className={`
                            w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-colors
                            ${clinic.bgColor} ${clinic.color}
                        `}
            >
              <clinic.icon className="w-8 h-8" strokeWidth={1.5} />
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-primary transition-colors">
              {clinic.title}
            </h3>

            <p className="text-gray-600 text-sm leading-relaxed flex-grow">
              {clinic.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
