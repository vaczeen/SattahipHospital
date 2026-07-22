import React from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

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
        src="/vision.png"
        className="w-1/3 h-auto rounded-md mx-auto shadow-sm shadow-gray-500 "
      />
      <h1 className="text-2xl font-bold text-gray-950 mb-6 mt-6 border-l-4 border-emerald-700 pl-4">
        วิสัยทัศน์
      </h1>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-lg text-gray-600">
            บริการด้วยความปลอดภัย มุ่งสู่ความทันสมัยด้วยเทคโนโลยี
            พัฒนาบุคลากรอย่างต่อเนื่อง
          </p>
        </div>
      </div>

      <h1 className="text-2xl font-bold text-gray-950 mb-6 mt-6 border-l-4 border-emerald-700 pl-4">
        เข็มมุ่ง
      </h1>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-lg text-gray-600">
            1. เพิ่มอัตราการเข้าถึงบริการของผู้ป่วย stroke fast track (ร้อยละ50)
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-lg text-gray-600">
            2. เพิ่มอัตราผู้ป่วยเบาหวานที ่เข้าสู่ระยะสงบ NCD remission
            (ร้อยละ20)
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-lg text-gray-600">3. Patient safety goal</p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-lg text-gray-600">4. Personnel safety</p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-lg text-gray-600">5. การเงินมีเสถียรภาพ</p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-lg text-gray-600">
            6. เพิ่มการใช้เทคโนโลยีในการให้บริการผู้ป่วยและบริหารจัดการ
          </p>
          <p className="text-lg ml-4 text-gray-600">
            (Telemedicine / Ip paperless / รับรอง HAIT / โรงพยาบาลอัจฉริยะ)
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-lg text-gray-600">
            7. ปรับปรุงภูมิทัศน์สภาพแวดล้อมให้ปลอดภัย สะดวก สวยงาม
          </p>
        </div>
      </div>
    </div>
  );
}
