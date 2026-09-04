import { getITATree, getITAYears } from "@/lib/ita-actions";
import ITAClient from "./ITAClient";
import { Info, ChevronLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "ข้อมูล ITA | โรงพยาบาลสัตหีบ",
  description: "ข้อมูล ITA - การประเมินคุณธรรมและความโปร่งใสในการดำเนินงานของหน่วยงานภาครัฐ",
};

export default async function ITAPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string }>;
}) {
  const params = await searchParams;
  const selectedYear = params.year ? parseInt(params.year) : 0;
  const [items, availableYears] = await Promise.all([
    getITATree(selectedYear > 0 ? selectedYear : undefined),
    getITAYears(),
  ]);

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Hero Header */}
      <div className="w-full py-12 md:py-20 bg-purple-50 transition-all duration-700">
        <div className="container mx-auto px-4">
          <Link
            href="/main"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary transition-colors mb-6 group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />{" "}
            กลับหน้าแรก
          </Link>
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
            <div className="p-6 text-purple-500 rounded-[2.5rem] bg-white/90 shadow-xl shadow-slate-200/50 flex items-center justify-center transition-transform hover:scale-105 duration-500">
              <Info className="w-16 h-16 md:w-20 md:h-20" strokeWidth={1.2} />
            </div>

            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold mb-3">
                ข้อมูล ITA
              </h1>
              <p className="text-slate-600 max-w-2xl text-lg font-medium opacity-80">
                การประเมินคุณธรรมและความโปร่งใสในการดำเนินงานของหน่วยงานภาครัฐ
              </p>
              <div className="mt-3 inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium">
                <span>📅</span>
                <span>ปีงบประมาณ {selectedYear > 0 ? selectedYear : new Date().getFullYear()} : 1 ตุลาคม {selectedYear > 0 ? selectedYear - 1 : new Date().getFullYear() - 1} - 30 กันยายน {selectedYear > 0 ? selectedYear : new Date().getFullYear()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <ITAClient
          items={items as any}
          availableYears={availableYears}
          selectedYear={selectedYear}
        />
      </div>
    </div>
  );
}
