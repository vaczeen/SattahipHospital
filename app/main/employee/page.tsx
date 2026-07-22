import React from "react";
import { EmployeeCard } from "@/components/EmployeeCard";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function EmployeePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Link
        href="/main"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary transition-colors mb-6 group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />{" "}
        กลับหน้าแรก
      </Link>

      <EmployeeCard />
    </div>
  );
}
