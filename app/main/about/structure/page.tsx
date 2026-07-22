import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

// Mock Data
const staffData = {
  ceo: {
    id: 1,
    name: "นาย คุณากร วงศ์ทิมารัตน์",
    description: "นายแพทย์ชำนาญการพิเศษ",
    position: "ผู้อำนวยการโรงพยาบาล",
    image: "/organization/ponew.png",
  },
  viceCEOs: [
    {
      id: 2,
      name: "นาย อภิญญา วงศ์แก้ว",
      description: "นายแพทย์ชำนาญการ",
      position: "รองผู้อำนวยการโรงพยาบาล",
      image: "/organization/doctorh.jpg",
    },
    {
      id: 3,
      name: "นาย อัครพนธ์ ทวีกิตติกุล",
      description: "นายแพทย์ชำนาญการ",
      position: "รองผู้อำนวยการโรงพยาบาล",
      image: "/organization/insuranceh.jpg",
    },
  ],
  departmentHeads: [
    {
      id: 4,
      name: "นาย อภิญญา วงศ์แก้ว",
      description: "นายแพทย์ชำนาญการ",
      position: "หัวหน้ากลุ่มงานการแพทย์",
      image: "/organization/doctorh.jpg",
    },
    {
      id: 5,
      name: "นาย อัครพนธ์ ทวีกิตติกุล",
      description: "นายแพทย์ชำนาญการ",
      position: "หัวหน้ากลุ่มงานประกันสุขภาพยุทธศาสตร์และสารสนเทศทางการแพทย์",
      image: "/organization/insuranceh.jpg",
    },
    {
      id: 6,
      name: "น.ส. สุพิชฌาย์ ตั้งพิบูลธรรม",
      description: "ทันตแพทย์ชำนาญการพิเศษ",
      position: "หัวหน้ากลุ่มงานทันตกรรม",
      image: "/organization/denth.jpg",
    },
    {
      id: 7,
      name: "นาง ฉัตรกุล มณีพรหม",
      description: "เภสัชกรชำนาญการพิเศษ",
      position: "หัวหน้ากลุ่มงานเภสัชกรรมและคุ้มครองผู้บริโภค",
      image: "/organization/pharh.jpg",
    },
    {
      id: 8,
      name: "นาง สมถวิล ทาหอม",
      description: "พยาบาลวิชาชีพชำนาญการพิเศษ",
      position: "หัวหน้ากลุ่มงานการพยาบาล",
      image: "/organization/nurseh.jpg",
    },
    {
      id: 9,
      name: "นาง วัญเพ็ญ อุทัยพร",
      description: "นักเทคนิคการแพทย์ชำนาญการ",
      position: "หัวหน้ากลุ่มงานเทคนิคการแพทย์",
      image: "/organization/labh.jpg",
    },
    {
      id: 10,
      name: "นาง ปารดา ถนอมศรี",
      description: "นักกายภาพบำบัดชำนาญการ",
      position: "หัวหน้ากลุ่มงานเวชกรรมฟื้นฟู",
      image: "/organization/pth.jpg",
    },
    {
      id: 11,
      name: "น.ส. มลทิวา กองปา",
      description: "นักรังสีการแพทย์ชำนาญการ",
      position: "หัวหน้ากลุ่มงานรังสีวิทยา",
      image: "/organization/xrayh.jpg",
    },
    {
      id: 12,
      name: "น.ส. สุภารัตน์ ไชยหาญ",
      description: "แพทย์แผนไทยชำนาญการ",
      position: "หัวหน้ากลุ่มงานการแพทย์แผนไทยและการแพทย์ทางเลือก",
      image: "/organization/massageh.jpg",
    },
    {
      id: 13,
      name: "นาง จิตสุภา ไสยจิตร์",
      description: "พยาบาลวิชาชีพชำนาญการ",
      position: "หัวหน้ากลุ่มงานบริการด้านปฐมภูมิและองค์รวม",
      image: "/organization/pcuh.jpg",
    },
    {
      id: 14,
      name: "น.ส. สุพัตรา ท้วมไทย",
      description: "พยาบาลวิชาชีพชำนาญการ",
      position: "หัวหน้ากลุ่มงานจิตเวชและยาเสพติด",
      image: "/organization/psychoh.jpg",
    },
    {
      id: 15,
      name: "น.ส. สำเนียง พงษ์แพทย์",
      description: "โภชนากรชำนาญการ",
      position: "หัวหน้ากลุ่มงานโภชนศาสตร์",
      image: "/organization/foodh.jpg",
    },
    {
      id: 16,
      name: "นาง ทิพย์วรรณ คุ่ยจาด",
      description: "เจ้าพนักงานธุรการชำนาญการ",
      position: "หัวหน้ากลุ่มงานบริหารทั่วไป",
      image: "/organization/manageh.jpg",
    },
  ],
};

const DoctorCard = ({
  name,
  position,
  description,
  image,
  className,
}: {
  name: string;
  position: string;
  description: string;
  image?: string;
  className?: string;
}) => (
  <div
    className={cn(
      "flex flex-col items-center bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 w-70 z-10",
      className,
    )}
  >
    <div className="w-24 h-24 rounded-full bg-blue-100 mb-4 flex items-center justify-center overflow-hidden border-4 border-blue-50 relative">
      {image ? (
        <Image src={image} alt={name} fill className="object-cover" />
      ) : (
        <div className="text-4xl">👨‍⚕️</div>
      )}
    </div>
    <h3 className="font-bold text-emerald-950 text-lg text-center mb-1">{name}</h3>
    <h3 className="font-medium text-emerald-700 text-md text-center mb-1">
      {description}
    </h3>
    <p className="text-sm text-gray-600 font-medium text-center">{position}</p>
  </div>
);

export default function DoctorsPage() {
  return (
    <div className="container mx-auto px-4 py-12 min-h-screen bg-slate-50">
     <Link
        href="/main"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary transition-colors mb-6 group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />{" "}
        กลับหน้าแรก
      </Link>
      <div className="text-center mb-16">
        <h1 className="text-3xl font-bold text-emerald-700 mb-4">
          โครงสร้างองค์กร
        </h1>
        <p className="text-gray-600 font-semibold">
          คณะผู้บริหารและหัวหน้ากลุ่มงานโรงพยาบาลสัตหีบ กม.10
        </p>
      </div>

      <div className="flex flex-col items-center space-y-12">
        {/* Level 1: CEO */}
        <div className="relative">
          <DoctorCard
            name={staffData.ceo.name}
            description={staffData.ceo.description}
            position={staffData.ceo.position}
            image={staffData.ceo.image}
            className="border-t-4 border-emerald-700"
          />
          {/* Line connecting CEO to subordinates */}
          <div className="absolute top-full left-1/2 w-0.5 h-12 bg-gray-300 -translate-x-1/2"></div>
        </div>

        {/* Level 2: Vice CEOs */}
        <div className="relative w-full max-w-4xl">
          {/* Horizontal Connector Line for Vice CEOs */}
          <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-gray-300 -mt-0"></div>
          {/* Vertical Lines up to the horizontal bar are handled by the parent container spacing essentially, 
                         but strictly speaking we need lines going UP from the Vices to meet the horizontal bar.
                     */}

          <div className="flex flex-col md:flex-row justify-center gap-16 md:gap-32 relative pt-8">
            {/* Connecting lines going up */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-gray-300 -mt-8 hidden"></div>{" "}
            {/* Central line overlap workaround */}
            {/* Left Vice Branch Line */}
            <div className="absolute top-0 left-1/4 w-0.5 h-8 bg-gray-300 -translate-x-1/2 hidden md:block"></div>
            <div className="absolute top-0 right-1/4 w-0.5 h-8 bg-gray-300 translate-x-1/2 hidden md:block"></div>
            {staffData.viceCEOs.map((vice) => (
              <div
                key={vice.id}
                className="relative flex flex-col items-center"
              >
                <DoctorCard
                  name={vice.name}
                  description={vice.description}
                  position={vice.position}
                  image={vice.image}
                />
                {/* Line going down to Dept Heads - Simplified: Just one central flow or separate? 
                                    Usually hierarchical trees merge back or fan out. 
                                    For 13 heads, let's group them or just show them below.
                                */}
              </div>
            ))}
          </div>
        </div>

        {/* Connection to Dept Heads */}
        <div className="w-full max-w-6xl relative pt-8">
          {/* Optional: Add a visual separator or connection */}
          <div className="flex items-center justify-center mb-8">
            <div className="h-0.5 w-1/3 bg-gray-200"></div>
            <span className="px-4 text-gray-400 text-sm font-semibold uppercase tracking-wider">
              หัวหน้ากลุ่มงาน
            </span>
            <div className="h-0.5 w-1/3 bg-gray-200"></div>
          </div>

          {/* Level 3: Department Heads */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
            {staffData.departmentHeads.map((head) => (
              <DoctorCard
                key={head.id}
                name={head.name}
                description={head.description}
                position={head.position}
                image={head.image}
                className="w-full max-w-[400px] hover:-translate-y-1 "
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
