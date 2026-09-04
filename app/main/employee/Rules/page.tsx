"use client";

import { useState, useMemo } from "react";
import {
  FileText,
  Download,
  Calendar,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Scale,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

type RuleDoc = {
  id: number;
  title: string;
  description: string | null;
  fileUrl: string;
  category: string;
  publishedAt: string;
};

const RULE_DOCS: RuleDoc[] = [
  {
    id: 1,
    title: "สิทธิและข้อพึงปฏิบัติของผู้ป่วย",
    description:
      "สิทธิขั้นพื้นฐานของผู้ป่วยและข้อปฏิบัติในการรับบริการทางการแพทย์",
    fileUrl: "https://e-slip.cbo.moph.go.th/payslip/index.php",
    category: "สิทธิผู้ป่วย",
    publishedAt: "2026-01-01",
  },
  {
    id: 2,
    title: "การเข้าถึงประวัติผู้รับบริการ",
    description:
      "แนวทางและกฎระเบียบในการเข้าถึงข้อมูลประวัติผู้รับบริการตามระเบียบโรงพยาบาล",
    fileUrl: "http://a.km10.org:8088/Salary/login.php?&target=a.km10.org",
    category: "แนวทางปฏิบัติ",
    publishedAt: "2026-01-01",
  },
  {
    id: 3,
    title: "ระเบียบการลา และการขออนุญาตลา",
    description:
      "ระเบียบการลาประเภทต่างๆ ของบุคลากร ได้แก่ ลาป่วย ลากิจ ลาพักผ่อน และลาอื่นๆ",
    fileUrl: "#",
    category: "ระเบียบบุคลากร",
    publishedAt: "2026-01-01",
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  สิทธิผู้ป่วย: "bg-blue-50 text-blue-700 border-blue-200",
  แนวทางปฏิบัติ: "bg-emerald-50 text-emerald-700 border-emerald-200",
  ระเบียบบุคลากร: "bg-purple-50 text-purple-700 border-purple-200",
  จรรยาบรรณ: "bg-amber-50 text-amber-700 border-amber-200",
  ความปลอดภัย: "bg-orange-50 text-orange-700 border-orange-200",
  กฎหมาย: "bg-red-50 text-red-700 border-red-200",
  ทั่วไป: "bg-gray-50 text-gray-700 border-gray-200",
};

export default function Rules() {
  const [openYears, setOpenYears] = useState<number[]>([]);

  const grouped = useMemo(() => {
    const groups: Record<number, RuleDoc[]> = {};
    RULE_DOCS.forEach((doc) => {
      const date = new Date(doc.publishedAt);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const fiscalYear = month >= 10 ? year + 1 : year;
      const buddhistYear = fiscalYear + 543;
      if (!groups[buddhistYear]) groups[buddhistYear] = [];
      groups[buddhistYear].push(doc);
    });

    const result = Object.entries(groups)
      .sort(([a], [b]) => Number(b) - Number(a))
      .map(([year, items]) => ({
        year: Number(year),
        items: items.sort(
          (a, b) =>
            new Date(b.publishedAt).getTime() -
            new Date(a.publishedAt).getTime(),
        ),
      }));

    // Auto-open latest year
    if (result.length > 0 && openYears.length === 0) {
      setOpenYears([result[0].year]);
    }
    return result;
  }, []);

  const toggleYear = (year: number) =>
    setOpenYears((prev) =>
      prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year],
    );

  const totalDocs = RULE_DOCS.length;

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-emerald/90 to-teal-800 text-white pt-16 pb-24 px-4">
        <Link
          href="/main/employee"
          className="inline-flex px-32 items-center gap-2 text-xl font-medium text-white hover:text-gray-200 transition-colors mb-6 group "
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform " />{" "}
          ก่อนหน้า
        </Link>
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 mb-4">
            <Scale className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl  font-bold mb-3">
            กฎระเบียบและข้อปฏิบัติ
          </h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            กฎระเบียบ ระเบียบปฏิบัติ สิทธิ และแนวทางต่างๆ
            สำหรับบุคลากรและผู้รับบริการของโรงพยาบาลสัตหีบ
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="space-y-6">
          {/* Doc Count */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BookOpen className="w-4 h-4" />
            <span>{totalDocs} เอกสาร</span>
          </div>

          {/* Document List */}
          {grouped.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-border">
              <FileText className="w-14 h-14 text-muted-foreground mx-auto mb-4 opacity-40" />
              <h3 className="text-lg font-medium text-muted-foreground">
                ยังไม่มีเอกสาร
              </h3>
            </div>
          ) : (
            <div className="space-y-4">
              {grouped.map((group) => (
                <div
                  key={group.year}
                  className="border border-border/50 rounded-2xl overflow-hidden bg-white shadow-sm"
                >
                  <button
                    onClick={() => toggleYear(group.year)}
                    className="w-full flex items-center justify-between p-5 bg-primary/5 hover:bg-primary/10 transition-colors"
                  >
                    <h3 className="text-xl font-bold text-emerald-700 flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      ปีงบประมาณ {group.year}
                      <span className="text-sm font-normal text-primary/60 ml-1">
                        ({group.items.length} รายการ)
                      </span>
                    </h3>
                    {openYears.includes(group.year) ? (
                      <ChevronUp className="w-5 h-5 text-primary" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-primary" />
                    )}
                  </button>

                  <div
                    className={cn(
                      "transition-all duration-300 ease-in-out",
                      openYears.includes(group.year)
                        ? "max-h-[3000px] opacity-100"
                        : "max-h-0 opacity-0 overflow-hidden",
                    )}
                  >
                    <div className="divide-y divide-gray-100">
                      {group.items.map((doc) => (
                        <div
                          key={doc.id}
                          className="p-4 hover:bg-gray-50 flex flex-col md:flex-row gap-4 items-start md:items-center transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                              <span
                                className={cn(
                                  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                                  CATEGORY_COLORS[doc.category] ??
                                    "bg-gray-50 text-gray-700 border-gray-200",
                                )}
                              >
                                {doc.category}
                              </span>
                              <span className="text-xs text-muted-foreground/70">
                                {new Date(doc.publishedAt).toLocaleDateString(
                                  "th-TH",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  },
                                )}
                              </span>
                            </div>
                            <h4 className="font-medium text-gray-900 leading-snug">
                              {doc.fileUrl !== "#" ? (
                                <a
                                  href={doc.fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:text-primary hover:underline transition-colors"
                                >
                                  {doc.title}
                                </a>
                              ) : (
                                doc.title
                              )}
                            </h4>
                            {doc.description && (
                              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                {doc.description}
                              </p>
                            )}
                          </div>

                          <div className="shrink-0">
                            {doc.fileUrl !== "#" ? (
                              <a
                                href={doc.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-border text-emerald-700 text-sm font-medium rounded-lg hover:bg-emerald-700 hover:text-white hover:border-emerald-700 transition-all shadow-sm whitespace-nowrap"
                              >
                                <Download className="w-4 h-4" />
                                เปิดดู
                              </a>
                            ) : (
                              <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 border border-border text-gray-400 text-sm rounded-lg whitespace-nowrap cursor-not-allowed">
                                <FileText className="w-4 h-4" />
                                เร็วๆ นี้
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
