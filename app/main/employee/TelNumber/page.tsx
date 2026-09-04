"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Phone,
  Building2,
  Stethoscope,
  Bed,
  UserPlus,
  Home,
  Wrench,
  Briefcase,
  Printer,
  MapPin,
  ArrowRight,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";


interface Contact {
  name: string;
  number: string;
  description?: string;
}

interface DirectoryCategory {
  id: string;
  title: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  contacts: Contact[];
}

const directoryData: DirectoryCategory[] = [
  {
    id: "opd",
    title: "ตึกผู้ป่วยนอก (OPD Building)",
    icon: Stethoscope,
    color: "text-rose-600",
    bgColor: "bg-rose-50",
    contacts: [
      { name: "ประชาสัมพันธ์ (Public Relations)", number: "101" },
      { name: "เวรเปลหน้า OPD (OPD Stretcher)", number: "154" },
      { name: "ห้องงานประกัน (Insurance)", number: "131, 132, 133" },
      { name: "เวรเปลหน้า ER (ER Stretcher)", number: "153" },
      { name: "หัวหน้า ER (Head of ER)", number: "111" },
      { name: "ห้องฉุกเฉิน (Emergency Room - ER)", number: "110, 113" },
      { name: "ห้องพักแพทย์ (Doctors' Lounge)", number: "107" },
      { name: "พยาบาลหัวหน้าพยาบาล (Nurse Supervisor)", number: "330" },
      { name: "หัวหน้าพยาบาล OPD (Head Nurse OPD)", number: "1078" },
      { name: "หน้าห้องตรวจ (Clinic Front Desk)", number: "172" },
      { name: "คลินิกหอบหืดและโรคไต (โต๊ะ 106)", number: "122" },
      { name: "ห้องอัลตราซาวด์ 200 (Ultrasound)", number: "174" },
      { name: "ห้องตรวจ 202", number: "191" },
      { name: "ห้องตรวจ 203", number: "192" },
      { name: "ห้องตรวจ 204", number: "193" },
      { name: "ห้องตรวจ 205", number: "123" },
      { name: "ห้องตรวจ 206", number: "124" },
      { name: "ห้องตรวจ 207", number: "125" },
      { name: "ชันสูตร LAB (Laboratory)", number: "118" },
      { name: "ห้องเจาะเลือด (Blood Test)", number: "119" },
      { name: "หัวหน้าเภสัชกรรม (Head of Pharmacy)", number: "103" },
      { name: "ห้องจ่ายยา (Pharmacy)", number: "104" },
      { name: "ห้องจ่ายยา IPD (IPD Pharmacy)", number: "105" },
      { name: "ห้องการเงิน (Finance)", number: "151" },
      { name: "คลินิกทางเดินหายใจ ARI", number: "1088" },
      { name: "คลินิกพิเศษ TB", number: "161" },
      { name: "คลินิกโรคเรื้อรัง NCD", number: "700" },
      { name: "เลขา แพทย์ (Doctor's Secretary)", number: "231" },
      { name: "ศูนย์คุณภาพ (Quality Center)", number: "234" },
      { name: "กายภาพบำบัด (Physical Therapy)", number: "232" },
      { name: "หัวหน้าทันตกรรม (Head of Dental)", number: "222" },
      { name: "ทันตกรรม (Dentistry)", number: "251" },
      { name: "X-RAY", number: "241" },
      { name: "ศูนย์ CT", number: "200" },
      { name: "หัวหน้าห้องคลอด L.R", number: "333" },
      { name: "ห้องคลอด L.R (Delivery Room)", number: "331, 332" },
      { name: "บริหารทั่วไป (General Admin)", number: "401" },
      { name: "บริหารทั่วไป - การเงิน", number: "402" },
    ],
  },
  {
    id: "ipd",
    title: "ตึกผู้ป่วยใน (IPD Building)",
    icon: Bed,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    contacts: [
      { name: "หัวหน้าผู้ป่วยใน (Head of IPD)", number: "313" },
      { name: "ผู้ป่วยใน Ward 1", number: "311, 312" },
      { name: "ผู้ป่วยใน Ward 3", number: "601" },
    ],
  },
  {
    id: "ppcu",
    title: "ศูนย์สุขภาพชุมชนเมืองพลูตาหลวง (PCU)",
    icon: Building2,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    contacts: [
      { name: "PCU พลูตาหลวง", number: "114" },
      { name: "หน้าห้องตรวจ PCU พลูตาหลวง", number: "171" },
      { name: "สุขภาพจิตและยาเสพติด (Mental Health)", number: "1074" },
      { name: "คลินิกพิเศษ ARV", number: "1072" },
    ],
  },
  {
    id: "others",
    title: "แผนกอื่นๆ (Other Departments)",
    icon: Briefcase,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    contacts: [
      { name: "งานพัสดุ (Supplies)", number: "403" },
      { name: "ศูนย์คอมพิวเตอร์ (IT Center)", number: "999" },
      { name: "สาธารณสุข อำเภอ (District Health Office)", number: "777" },
      { name: "งานโสตฯ (Audio Visual)", number: "711" },
      { name: "โรงครัว (Nutrition)", number: "600" },
      { name: "หน่วยจ่ายกลาง (Central Supply)", number: "611" },
      { name: "คลังยา (Drug Store)", number: "621" },
      { name: "ห้องยานพาหนะ (Transport)", number: "400" },
      { name: "ห้องช่าง (Maintenance)", number: "408" },
      { name: "แพทย์แผนไทย / แพทย์แผนจีน", number: "644" },
      { name: "งานยุทธศาสตร์ (Strategy)", number: "622" },
    ],
  },

  {
    id: "external",
    title: "เบอร์โทรภายนอก (External Numbers)",
    icon: Phone,
    color: "text-slate-600",
    bgColor: "bg-slate-50",
    contacts: [
      { name: "เบอร์โทรศัพท์กลาง", number: "038-245051" },
      { name: "เบอร์โทรศัพท์กลาง", number: "066-005-6082" },
    ],
  },
];

export default function TelephoneDirectoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});

  const toggleCategory = (id: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredDirectory = useMemo(() => {
    if (!searchQuery.trim()) return directoryData;

    const normalizedQuery = searchQuery.toLowerCase().trim();

    return directoryData
      .map((category) => ({
        ...category,
        contacts: category.contacts.filter(
          (contact) =>
            contact.name.toLowerCase().includes(normalizedQuery) ||
            contact.number.includes(normalizedQuery),
        ),
      }))
      .filter((category) => category.contacts.length > 0);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Header / Hero Section */}
      <div className="bg-gradient-to-r from-emerald-600 via-emerald/90 to-teal-800 text-white pt-16 pb-24 px-4">
        <Link
          href="/main/employee"
          className="inline-flex px-32 items-center gap-2 text-xl font-medium text-white hover:text-gray-200 transition-colors mb-6 group "
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform " />{" "}
          ก่อนหน้า
        </Link>
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-2xl mb-6 backdrop-blur-sm border border-white/20">
            <Phone className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-kanit">
            สมุดโทรศัพท์ภายใน
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto font-light">
            รพ.สัตหีบ - Better Information, Better Health
          </p>
        </div>
      </div>

      {/* Search Section */}
      <div className="container mx-auto px-4 -mt-12">
        <div className="max-w-3xl mx-auto">
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl group-focus-within:bg-primary/30 transition-all duration-300" />
            <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 p-2">
              <div className="relative flex items-center">
                <Search className="absolute left-4 w-6 h-6 text-gray-400 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder="ค้นหาชื่อแผนก หรือ หมายเลขต่อภายใน..."
                  className="w-full py-4 pl-14 pr-6 bg-transparent border-none focus:ring-0 text-lg text-gray-800 placeholder:text-gray-400 font-kanit"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    ล้างการค้นหา
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm text-gray-500 font-kanit">
            <span className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-gray-100">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              ข้อมูลอัปเดตล่าสุด: กุมภาพันธ์ 2569
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-gray-100">
              <MapPin className="w-3.5 h-3.5" />
              รพ.สัตหีบ
            </span>
          </div>
        </div>
      </div>

      {/* Directory Content */}
      <div className="container mx-auto px-4 mt-16">
        {filteredDirectory.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDirectory.map((category) => {
              const isExpanded =
                expandedCategories[category.id] || searchQuery.length > 0;
              const displayedContacts = isExpanded
                ? category.contacts
                : category.contacts.slice(0, 5);
              const hasMore = category.contacts.length > 5;

              return (
                <div
                  key={category.id}
                  className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-primary/20 flex flex-col h-full"
                >
                  {/* Category Header */}
                  <div
                    className={`p-6 ${category.bgColor} flex items-center justify-between border-b border-gray-100`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 bg-white rounded-2xl shadow-sm ${category.color} group-hover:scale-110 transition-transform duration-500`}
                      >
                        <category.icon className="w-6 h-6" />
                      </div>
                      <h3
                        className={`text-xl font-bold font-kanit ${category.color}`}
                      >
                        {category.title}
                      </h3>
                    </div>
                    <span className="bg-white/50 px-2.5 py-1 rounded-lg text-xs font-bold text-gray-400 border border-gray-100">
                      {category.contacts.length}
                    </span>
                  </div>

                  {/* Contacts List */}
                  <div className="p-2 flex-grow">
                    {displayedContacts.map((contact, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors group/item"
                      >
                        <div className="flex flex-col min-w-0 pr-4">
                          <span className="text-gray-700 font-medium font-kanit truncate group-hover/item:text-primary transition-colors">
                            {contact.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="bg-gray-100 px-3 py-1.5 rounded-xl border border-gray-200 group-hover/item:border-primary/30 group-hover/item:bg-primary/5 transition-all">
                            <span className="text-primary font-bold font-mono tracking-wider">
                              {contact.number}
                            </span>
                          </div>
                          <button className="opacity-0 group-hover/item:opacity-100 p-2 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-110 active:scale-95"></button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer / Expansion Toggle */}
                  {hasMore && !searchQuery && (
                    <div className="p-4 mt-auto border-t border-gray-50 flex justify-center">
                      <button
                        onClick={() => toggleCategory(category.id)}
                        className="text-sm font-bold text-primary flex items-center gap-2 hover:bg-primary/5 px-4 py-2 rounded-xl transition-all"
                      >
                        {isExpanded
                          ? "แสดงน้อยลง"
                          : `ดูรายละเอียดเพิ่มเติม (${category.contacts.length})`}
                        <ArrowRight
                          className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? "-rotate-90" : "rotate-90"}`}
                        />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="p-6 bg-rose-50 rounded-full mb-6">
              <Search className="w-12 h-12 text-rose-300" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2 font-kanit">
              ไม่พบผลการค้นหา
            </h3>
            <p className="text-gray-500 font-kanit">
              ขออภัย เราไม่พบแผนกหรือหมายเลขที่คุณต้องการค้นหา
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-8 text-primary font-bold hover:underline"
            >
              แสดงข้อมูลทั้งหมด
            </button>
          </div>
        )}
      </div>

      {/* Quick Contact FAB for Mobile */}
      <div className="fixed bottom-6 right-6 lg:hidden">
        <button className="p-5 bg-primary text-white rounded-2xl shadow-2xl shadow-primary/30 hover:scale-110 active:scale-95 transition-all"></button>
      </div>
    </div>
  );
}
