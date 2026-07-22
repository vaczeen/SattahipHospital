"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import {
  ChevronDown,
  ChevronUp,
  FileText,
  Download,
  Calendar,
  Lock,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ADMIN_PASSWORD = "paddu";

type Procurement = {
  id: number;
  title: string;
  description: string | null;
  fileUrl: string;
  category: string;
  publishedAt: string | Date;
  createdAt: string | Date;
};

export default function ProcurementClient({
  procurements,
}: {
  procurements: any[];
}) {
  const router = useRouter();

  // Admin modal state
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const handleAdminUnlock = () => {
    if (adminPassword === ADMIN_PASSWORD) {
      setShowAdminModal(false);
      router.push("/main/procurement/admin");
    } else {
      setPasswordError(true);
      setAdminPassword("");
      setTimeout(() => setPasswordError(false), 2000);
    }
  };

  // Group by Fiscal Year (Buddhist Era)
  const groupedProcurements = useMemo(() => {
    const groups: Record<number, Procurement[]> = {};

    procurements.forEach((item) => {
      const date = new Date(item.publishedAt);
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // 1-12

      // Fiscal Year calculation: Oct (10) starts the next year
      const fiscalYear = month >= 10 ? year + 1 : year;
      const buddhistYear = fiscalYear + 543;

      if (!groups[buddhistYear]) {
        groups[buddhistYear] = [];
      }
      groups[buddhistYear].push(item);
    });

    // Sort years descending
    return Object.entries(groups)
      .sort(([a], [b]) => Number(b) - Number(a))
      .map(([year, items]) => ({
        year: Number(year),
        items: items.sort(
          (a, b) =>
            new Date(b.publishedAt).getTime() -
            new Date(a.publishedAt).getTime(),
        ),
      }));
  }, [procurements]);

  const [openYears, setOpenYears] = useState<number[]>(
    groupedProcurements.length > 0 ? [groupedProcurements[0].year] : [],
  );

  const toggleYear = (year: number) => {
    setOpenYears((prev) =>
      prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year],
    );
  };

  return (
    <div className="space-y-6">
      {/* Admin Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowAdminModal(true)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary border border-border rounded-lg px-4 py-2 hover:border-primary/50 hover:bg-primary/5 transition-all"
        >
          <Settings className="w-4 h-4" />
          ลงข้อมูล (สำหรับเจ้าหน้าที่)
        </button>
      </div>

      {/* Password Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm mx-4 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center space-y-2">
              <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center mx-auto">
                <Lock className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">
                ยืนยันตัวตนเจ้าหน้าที่
              </h3>
              <p className="text-sm text-gray-500">
                ใส่รหัสผ่านเพื่อเข้าสู่ระบบจัดการข้อมูล
              </p>
            </div>
            <div className="space-y-3">
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdminUnlock()}
                placeholder="รหัสผ่าน..."
                autoFocus
                className={cn(
                  "w-full px-4 py-2.5 border rounded-lg text-sm outline-none transition-all",
                  passwordError
                    ? "border-red-400 bg-red-50 placeholder-red-300 animate-pulse"
                    : "border-border focus:border-primary focus:ring-2 focus:ring-primary/20",
                )}
              />
              {passwordError && (
                <p className="text-red-500 text-xs text-center">
                  รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAdminModal(false);
                  setAdminPassword("");
                  setPasswordError(false);
                }}
                className="flex-1 px-4 py-2.5 border border-border rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleAdminUnlock}
                className="flex-1 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors"
              >
                เข้าสู่ระบบ
              </button>
            </div>
          </div>
        </div>
      )}
      {groupedProcurements.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-border">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-muted-foreground">
            ไม่พบข้อมูลการจัดซื้อจัดจ้าง
          </h3>
        </div>
      ) : (
        groupedProcurements.map((group) => (
          <div
            key={group.year}
            className="border border-border/50 rounded-xl overflow-hidden bg-white shadow-sm"
          >
            <button
              onClick={() => toggleYear(group.year)}
              className="w-full flex items-center justify-between p-4 bg-primary/5 hover:bg-primary/10 transition-colors"
            >
              <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                ปีงบประมาณ {group.year}
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
                  ? "max-h-[2000px] opacity-100"
                  : "max-h-0 opacity-0 overflow-hidden",
              )}
            >
              <div className="divide-y divide-gray-100">
                {group.items.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 hover:bg-gray-50 flex flex-col md:flex-row gap-4 items-start md:items-center"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary/10 text-secondary">
                          {item.category}
                        </span>
                        <span className="text-xs text-muted-foreground/70">
                          {format(new Date(item.publishedAt), "d MMM yyyy", {
                            locale: th,
                          })}
                        </span>
                      </div>
                      <h4 className="font-medium text-gray-900 group-hover:text-primary transition-colors leading-snug">
                        <a
                          href={item.fileUrl}
                          target="_blank"
                          className="hover:underline"
                        >
                          {item.title}
                        </a>
                      </h4>
                      {item.description && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <a
                      href={item.fileUrl}
                      target="_blank"
                      className="shrink-0 inline-flex items-center gap-2 px-4 py-2 bg-white border border-border text-primary text-sm font-medium rounded-lg hover:bg-primary hover:text-white transition-all shadow-sm whitespace-nowrap"
                    >
                      <Download className="w-4 h-4" />
                      ดาวน์โหลด
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
