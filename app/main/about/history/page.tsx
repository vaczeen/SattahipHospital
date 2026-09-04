import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Link
        href="/main"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary transition-colors mb-6 group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />{" "}
        กลับหน้าแรก
      </Link>
      <img
        src="/km10pic.png"
        className="w-full sm:w-2/3 md:w-1/2 lg:w-1/3 h-auto rounded-md mx-auto shadow-sm shadow-gray-500"
      />
      <h1 className="text-2xl font-bold text-gray-950 mt-4 mb-6 border-l-4 border-emerald-700 pl-4">
        ประวัติโรงพยาบาล
      </h1>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-lg text-gray-600">
            โรงพยาบาลสัตหีบ กม.10 เป็นโรงพยาบาลรัฐบาล ตั้งอยู่ที่ 33/37 ม.1 ต.
            พลูตาหลวง อ. สัตหีบ จ. ชลบุรี
            สังกัดในส่วนกลาง(กรม/กระทรวง)กระทรวงสาธารณสุข ต้นสังกัดในพื้นที่
            สำนักงานสาธารณสุข จังหวัดชลบุรี โดยเปิดให้บริการ 60 เตียง
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-gray-950 mb-6 border-l-4 border-emerald-700 pl-4">
            ข้อมูลทั่วไป
          </h2>
          <p className="text-lg text-gray-600">ข้อมูลทั่วไปเกี่ยวกับเรา</p>
        </div>
      </div>
    </div>
  );
}
