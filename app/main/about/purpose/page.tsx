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
        src="/km10old.bmp"
        className="w-full sm:w-2/3 md:w-1/2 lg:w-1/3 h-auto rounded-md mx-auto shadow-sm shadow-gray-500"
      />
      <h1 className="text-2xl font-bold text-gray-950 mb-6 border-l-4 border-emerald-700 pl-4">
        พันธกิจของเรา
      </h1>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-lg text-gray-600">
            1. ให้บริการด้านสุขภาพแบบองค์รวมที่ปลอดภัย มีคุณภาพ
            เข้าถึงได้ทุกกลุ่มวัย
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-lg text-gray-600">
            2. ใช้เทคโนโลยีสารสนเทศและนวัตกรรม
            เพื่อเพิ่มประสิทธิภาพการบริหารจัดการ และพัฒนาระบบบริการสุขภาพ
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-lg text-gray-600">
            3. สร้างเสริมสุขภาพและป้องกันโรค โดยบูรณาการการร่วมมือกับเครือข่าย
            สุขภาพและชุมชน
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-lg text-gray-600">
            4. สร้างวัฒนธรรมองค์กรที่ส่งเสริมการเรียนรู้และพัฒนาอย่างต่อเนื ่อง
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-lg text-gray-600">5. บริหารด้วยหลักธรรมาภิบาล</p>
        </div>
      </div>

      <h1 className="text-2xl font-bold text-gray-950 mb-6 border-l-4 border-emerald-700 pl-4">
        ยุทธศาสตร์
      </h1>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-lg text-gray-600">
            1. ให้บริการด้านสุขภาพแบบองค์รวมที่ปลอดภัย
            มีคุณภาพสำหรับประชาชนทุกกลุ่มวัย
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-lg text-gray-600">
            2. พัฒนาระบบบริการด้วยเทคโนโลยีและนวัตกรรมที่ทันสมัย
            รองรับการเปลี่ยนแปลงในยุคดิจิทัล
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-lg text-gray-600">
            3. สร้างเสริมสุขภาพและป้องกันโรค
            โดยบูรณาการร่วมกับเครือข่ายสุขภาพและชุมชน
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-lg text-gray-600">
            4. ส่งเสริมและพัฒนาศักยภาพของบุคลากรให้มีความรู้
            ความสามารถและความสุขในการทำงาน
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-lg text-gray-600">
            5. บริหารจัดการองค์กรอย่างมีธรรมาภิบาล โปร่งใสและยั่งยืน
          </p>
        </div>
      </div>
    </div>
  );
}
