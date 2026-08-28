import React from "react";
import { notFound } from "next/navigation";
import { departmentsData } from "@/lib/departmentsData";
import { getDepartmentDocuments } from "@/lib/department-actions";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import prisma from "@/lib/prisma";
import DepartmentContent from "./DepartmentContent";

export default async function DepartmentDetailPage({params}) {
  // ← ดึง style จาก file
  const deptStyle = departmentsData.find((d) => d.slug === params.slug);

  // ← ดึง label/description จาก DB
  const deptConfig = await prisma.departmentConfig.findUnique({
    where: { slug: params.slug },
  });

  if (!deptStyle || !deptConfig) notFound();

  const documents = await getDepartmentDocuments(params.slug);

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Header Section */}
      <div
        className={cn(
          "w-full py-12 md:py-20 bg-gradient-to-br transition-all duration-700",
          deptStyle.bgGradient,
        )}
      >
        <div className="container mx-auto px-4">
          <Link
            href="/main/about/department"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary transition-colors mb-6 group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />{" "}
            กลับหน้าหน่วยงาน
          </Link>

          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
            <div
              className={cn(
                "p-6 rounded-[2.5rem] bg-white/90 shadow-xl shadow-slate-200/50 flex items-center justify-center transition-transform hover:scale-105 duration-500",
                deptStyle.color,
              )}
            >
              {deptStyle.icon && (
                <deptStyle.icon
                  className="w-16 h-16 md:w-20 md:h-20"
                  strokeWidth={1.2}
                />
              )}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-2 tracking-tight">
                {deptConfig.label}
              </h1>
              <p className="text-slate-600 max-w-2xl text-lg font-medium opacity-80">
                {deptConfig.description ||
                  `ข้อมูลและเอกสารต่างๆ ของ${deptConfig.label} โรงพยาบาลสัตหีบ`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="container mx-auto px-4 -mt-10 pb-20">
        <DepartmentContent
          slug={params.slug}
          initialDocuments={documents}
          label={deptConfig.label}
          description={deptConfig.description ?? ""}
        />
      </div>
    </div>
  );
}
