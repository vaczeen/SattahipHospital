"use client";

import { useState, useMemo } from "react";
import { Users, FileText, ShieldAlert, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import DocumentsTab from "./DocumentsTab";
import { departmentsData, DepartmentItem } from "@/lib/departmentsData";

interface DepartmentContentProps {
  slug: string;
  initialDocuments: any[];
}

const DoctorCard = ({
  name,
  position,
  description,
  className,
}: {
  name: string;
  position: string;
  description: string;
  className?: string;
}) => (
  <div
    className={cn(
      "flex flex-col items-center bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 w-full max-w-[280px] z-10",
      className,
    )}
  >
    <div className="w-20 h-20 rounded-full bg-blue-100 mb-4 flex items-center justify-center overflow-hidden border-4 border-blue-50">
      <div className="text-3xl">👨‍⚕️</div>
    </div>
    <h3 className="font-bold text-blue-800 text-base text-center mb-1">
      {name}
    </h3>
    <h3 className="font-medium text-blue-500 text-xs text-center mb-1">
      {description}
    </h3>
    <p className="text-[10px] text-gray-500 font-medium text-center uppercase tracking-wider">
      {position}
    </p>
  </div>
);

const staffData = {
  ceo: {
    name: "นาย คุณากร วงศ์ทิมารัตน์",
    description: "นายแพทย์ชำนาญการพิเศษ",
    position: "ผู้อำนวยการโรงพยาบาล",
  },
  viceCEOs: [
    {
      id: 2,
      name: "นาย อภิญญา วงศ์แก้ว",
      description: "นายแพทย์ชำนาญการ",
      position: "รองผู้อำนวยการโรงพยาบาล",
    },
    {
      id: 3,
      name: "นาย อัครพนธ์ ทวีกิตติกุล",
      description: "นายแพทย์ชำนาญการ",
      position: "รองผู้อำนวยการโรงพยาบาล",
    },
  ],
  departmentHeads: [
    {
      id: 4,
      name: "นาย อภิญญา วงศ์แก้ว",
      description: "นายแพทย์ชำนาญการ",
      position: "หัวหน้ากลุ่มงานการแพทย์",
      dept: "กลุ่มงานการแพทย์",
    },
    {
      id: 5,
      name: "นาย อัครพนธ์ ทวีกิตติกุล",
      description: "นายแพทย์ชำนาญการ",
      position: "หัวหน้ากลุ่มงานประกันสุขภาพยุทธศาสตร์และสารสนเทศทางการแพทย์",
      dept: "กลุ่มงานประกันสุขภาพฯ",
    },
    {
      id: 6,
      name: "น.ส. สุพิชฌาย์ ตั้งพิบูลธรรม",
      description: "ทันตแพทย์ชำนาญการพิเศษ",
      position: "หัวหน้ากลุ่มงานทันตกรรม",
      dept: "กลุ่มงานทันตกรรม",
    },
    {
      id: 7,
      name: "นาง ฉัตรกุล มณีพรหม",
      description: "เภสัชกรชำนาญการพิเศษ",
      position: "หัวหน้ากลุ่มงานเภสัชกรรมและคุ้มครองผู้บริโภค",
      dept: "กลุ่มงานเภสัชกรรมฯ",
    },
    {
      id: 8,
      name: "นาง สมถวิล ทาหอม",
      description: "พยาบาลวิชาชีพชำนาญการพิเศษ",
      position: "หัวหน้ากลุ่มงานการพยาบาล",
      dept: "กลุ่มงานการพยาบาล",
    },
    {
      id: 9,
      name: "นาง วัญเพ็ญ อุทัยพร",
      description: "นักเทคนิคการแพทย์ชำนาญการ",
      position: "หัวหน้ากลุ่มงานเทคนิคการแพทย์",
      dept: "กลุ่มงานเทคนิคการแพทย์",
    },
    {
      id: 10,
      name: "นาง ปารดา ถนอมศรี",
      description: "นักกายภาพบำบัดชำนาญการ",
      position: "หัวหน้ากลุ่มงานเวชกรรมฟื้นฟู",
      dept: "กลุ่มงานเวชกรรมฟื้นฟู",
    },
    {
      id: 11,
      name: "น.ส. มลทิวา กองปา",
      description: "นักรังสีการแพทย์ชำนาญการ",
      position: "หัวหน้ากลุ่มงานรังสีวิทยา",
      dept: "กลุ่มงานรังสีวิทยา",
    },
    {
      id: 12,
      name: "น.ส. สุภารัตน์ ไชยหาญ",
      description: "แพทย์แผนไทยชำนาญการ",
      position: "หัวหน้ากลุ่มงานการแพทย์แผนไทยและการแพทย์ทางเลือก",
      dept: "กลุ่มงานแพทย์แผนไทยฯ",
    },
    {
      id: 13,
      name: "นาง จิตสุภา ไสยจิตร์",
      description: "พยาบาลวิชาชีพชำนาญการ",
      position: "หัวหน้ากลุ่มงานบริการด้านปฐมภูมิและองค์รวม",
      dept: "กลุ่มงานบริการด้านปฐมภูมิและองค์รวม",
    },
    {
      id: 14,
      name: "น.ส. สุพัตรา ท้วมไทย",
      description: "พยาบาลวิชาชีพชำนาญการ",
      position: "หัวหน้ากลุ่มงานจิตเวชและยาเสพติด",
      dept: "กลุ่มงานจิตเวชและยาเสพติด",
    },
    {
      id: 15,
      name: "น.ส. สำเนียง พงษ์แพทย์",
      description: "โภชนากรชำนาญการ",
      position: "หัวหน้ากลุ่มงานโภชนศาสตร์",
      dept: "กลุ่มงานโภชนศาสตร์",
    },
    {
      id: 16,
      name: "นาง ทิพย์วรรณ คุ่ยจาด",
      description: "เจ้าพนักงานธุรการชำนาญการ",
      position: "หัวหน้ากลุ่มงานบริหารทั่วไป",
      dept: "กลุ่มงานบริหารทั่วไป",
    },
  ],
};

export default function DepartmentContent({
  slug,
  initialDocuments,
}: DepartmentContentProps) {
  const [activeTab, setActiveTab] = useState<
    "structure" | "documents" | "policies"
  >("structure");

  // Lookup department locally on the client to avoid serialization issues with icons
  const department = useMemo(() => {
    return departmentsData.find((d) => d.slug === slug);
  }, [slug]);

  // Find head of THIS department
  const currentHead = useMemo(() => {
    if (!department) return null;
    return staffData.departmentHeads.find(
      (h) =>
        h.dept.toLowerCase().includes(department.label.toLowerCase()) ||
        department.label.toLowerCase().includes(h.dept.toLowerCase()),
    );
  }, [department]);

  if (!department) return null;

  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
      {/* Tabs Header */}
      <div className="flex flex-wrap border-b bg-slate-50/30">
        <button
          onClick={() => setActiveTab("structure")}
          className={cn(
            "flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-all",
            activeTab === "structure"
              ? "text-primary border-primary bg-white shadow-[0_4px_10px_-4px_rgba(0,0,0,0.05)]"
              : "text-slate-400 border-transparent hover:text-slate-600 hover:bg-slate-50/50",
          )}
        >
          <Users className="w-4 h-4" /> โครงสร้างองค์กร
        </button>
        <button
          onClick={() => setActiveTab("documents")}
          className={cn(
            "flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-all",
            activeTab === "documents"
              ? "text-primary border-primary bg-white shadow-[0_4px_10px_-4px_rgba(0,0,0,0.05)]"
              : "text-slate-400 border-transparent hover:text-slate-600 hover:bg-slate-50/50",
          )}
        >
          <FileText className="w-4 h-4" /> เอกสาร
        </button>
        <button
          onClick={() => setActiveTab("policies")}
          className={cn(
            "flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-all",
            activeTab === "policies"
              ? "text-primary border-primary bg-white shadow-[0_4px_10px_-4px_rgba(0,0,0,0.05)]"
              : "text-slate-400 border-transparent hover:text-slate-600 hover:bg-slate-50/50",
          )}
        >
          <ShieldAlert className="w-4 h-4" /> นโยบาย
        </button>
      </div>

      {/* Tabs Content */}
      <div className="p-6 md:p-10 min-h-[400px]">
        {activeTab === "structure" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                โครงสร้างบุคลากร
              </h2>
              <p className="text-slate-500 text-sm">
                ทีมงานและคณะผู้บริหารของ {department.label}
              </p>
            </div>

            <div className="flex flex-col items-center space-y-12">
              {/* Level 1: CEO */}
              <div className="relative group">
                <DoctorCard
                  name={staffData.ceo.name}
                  description={staffData.ceo.description}
                  position={staffData.ceo.position}
                  className="border-t-4 border-t-primary scale-90 md:scale-100"
                />
                <div className="absolute top-full left-1/2 w-0.5 h-12 bg-slate-200 -translate-x-1/2"></div>
              </div>

              {/* Level 2: Department Head (Focal Point) */}
              <div className="relative pt-4 flex flex-col items-center">
                {currentHead ? (
                  <div className="flex flex-col items-center">
                    <div className="bg-primary/5 px-4 py-1 rounded-full text-[10px] font-bold text-primary uppercase tracking-tighter mb-4 border border-primary/10">
                      หัวหน้ากลุ่มงานปัจจุบัน
                    </div>
                    <DoctorCard
                      name={currentHead.name}
                      description={currentHead.description}
                      position={currentHead.position}
                      className="ring-4 ring-primary/5 ring-offset-2"
                    />
                  </div>
                ) : (
                  <div className="text-slate-400 italic py-10">
                    ไม่พบข้อมูลหัวหน้ากลุ่มงานเฉพาะ
                  </div>
                )}
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-200 w-full max-w-2xl text-center">
                <p className="text-slate-400 text-sm italic">
                  "เรามุ่งมั่นให้บริการด้วยหัวใจ เพื่อสุขภาพที่ดีของประชาชน"
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "documents" && (
          <DocumentsTab
            department={department}
            initialDocuments={initialDocuments}
          />
        )}

        {activeTab === "policies" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-4xl mx-auto space-y-6">
            <div className="bg-indigo-50/50 p-8 rounded-3xl border border-indigo-100/50 text-center">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <ShieldAlert className="w-8 h-8 text-indigo-500" />
              </div>
              <h3 className="text-xl font-bold text-indigo-900 mb-2">
                นโยบายหน่วยงาน
              </h3>
              <p className="text-indigo-600/80 text-sm max-w-md mx-auto">
                นโยบายและแนวทางปฏิบัติสำคัญของ{department.label}{" "}
                กำลังอยู่ระหว่างการอัปเดตข้อมูลเข้าสู่ระบบดิจิทัล
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border border-slate-100 bg-slate-50/30 flex items-center gap-4 opacity-40"
                >
                  <div className="w-10 h-10 rounded-lg bg-slate-200 animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-1/2 bg-slate-200 rounded animate-pulse" />
                    <div className="h-2 w-full bg-slate-100 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
