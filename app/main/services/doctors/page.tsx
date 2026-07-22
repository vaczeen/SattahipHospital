import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
// Mock Data
const staffData = {
  departmentHeads: [
    {
      id: 1,
      name: "พญ. ใจดี มีเมตตา",
      position: "หัวหน้าแผนกอายุรกรรม",
      image: "/doctors/doctor-placeholder.jpg",
    },
    {
      id: 2,
      name: "นพ. รักษา ดี",
      position: "หัวหน้าแผนกศัลยกรรม",
      image: "/doctors/doctor-placeholder.jpg",
    },
    {
      id: 3,
      name: "พญ. เด็กดี มีสุข",
      position: "หัวหน้าแผนกกุมารเวชกรรม",
      image: "/doctors/doctor-placeholder.jpg",
    },
    {
      id: 4,
      name: "นพ. กระดูก แข็งแรง",
      position: "หัวหน้าแผนกออร์โธปิดิกส์",
      image: "/doctors/doctor-placeholder.jpg",
    },
    {
      id: 5,
      name: "พญ. สวยใส ไร้สิว",
      position: "หัวหน้าแผนกผิวหนัง",
      image: "/doctors/doctor-placeholder.jpg",
    },
    {
      id: 6,
      name: "นพ. ตาดี มองเห็น",
      position: "หัวหน้าแผนกจักษุ",
      image: "/doctors/doctor-placeholder.jpg",
    },
    {
      id: 7,
      name: "พญ. หูทิพย์ ได้ยิน",
      position: "หัวหน้าแผนกโสต ศอ นาสิก",
      image: "/doctors/doctor-placeholder.jpg",
    },
    {
      id: 8,
      name: "นพ. หัวใจ แข็งแกร่ง",
      position: "หัวหน้าแผนกหัวใจ",
      image: "/doctors/doctor-placeholder.jpg",
    },
    {
      id: 9,
      name: "พญ. สมอง ฉับไว",
      position: "หัวหน้าแผนกระบบประสาท",
      image: "/doctors/doctor-placeholder.jpg",
    },
    {
      id: 10,
      name: "นพ. ฟันสวย ยิ้มใส",
      position: "หัวหน้าแผนกทันตกรรม",
      image: "/doctors/doctor-placeholder.jpg",
    },
    {
      id: 11,
      name: "พญ. กายภาพ บำบัด",
      position: "หัวหน้าแผนกเวชศาสตร์ฟื้นฟู",
      image: "/doctors/doctor-placeholder.jpg",
    },
    {
      id: 12,
      name: "นพ. จิตใจ สงบ",
      position: "หัวหน้าแผนกจิตเวช",
      image: "/doctors/doctor-placeholder.jpg",
    },
    {
      id: 13,
      name: "พญ. ฉุกเฉิน ทันท่วงที",
      position: "หัวหน้าแผนกอุบัติเหตุและฉุกเฉิน",
      image: "/doctors/doctor-placeholder.jpg",
    },
  ],
};

const DoctorCard = ({
  name,
  position,
  className,
}: {
  name: string;
  position: string;
  className?: string;
}) => (
  <div
    className={cn(
      "flex flex-col items-center bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 w-64 z-10",
      className,
    )}
  >
    <div className="w-24 h-24 rounded-full bg-blue-100 mb-4 flex items-center justify-center overflow-hidden border-4 border-blue-50">
      {/* Find a real generic user icon or use a colored div for now if image fails */}
      <div className="text-4xl">👨‍⚕️</div>
    </div>
    <h3 className="font-bold text-gray-800 text-lg text-center mb-1">{name}</h3>
    <p className="text-sm text-primary font-medium text-center">{position}</p>
  </div>
);

export default function DoctorsPage() {
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <Link
        href="/main"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary transition-colors mb-6 group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />{" "}
        กลับหน้าแรก
      </Link>
      <div className="text-center mb-16">
        <h1 className="text-3xl font-bold text-emerald-700 mb-4">
          รายชื่อแพทย์
        </h1>
        <p className="text-gray-600">
          แพทย์ประจำและแพทย์หมุนเวียนโรงพยาบาลสัตหีบ กม.10
        </p>
      </div>

      <div className="flex flex-col items-center space-y-12">
        {/* Connection to Dept Heads */}
        <div className="w-full max-w-6xl relative">
          {/* Level 3: Department Heads */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
            {staffData.departmentHeads.map((head) => (
              <DoctorCard
                key={head.id}
                name={head.name}
                position={head.position}
                className="w-full max-w-[280px] hover:-translate-y-1"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
