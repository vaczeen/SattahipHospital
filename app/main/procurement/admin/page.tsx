import { getProcurements } from "@/lib/actions";
import AdminInterface from "./AdminInterface";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { HeartHandshake, ChevronLeft } from "lucide-react";

export default async function ProcurementAdminPage() {
  const procurementsData = await getProcurements();
  // Serialize dates
  const procurements = (procurementsData as any[]).map((item) => ({
    ...item,
    publishedAt: new Date(item.publishedAt).toISOString(),
    createdAt: new Date(item.createdAt).toISOString(),
  }));

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className=" bg-gradient-to-r from-blue-50 to-blue-100/50 text-gray-950 py-16">
        <div className="container mx-auto px-4">
          <Link
            href="/main/procurement"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary transition-colors mb-6 group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />{" "}
            ย้อนกลับ
          </Link>
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
            <div
              className={cn(
                "p-6 rounded-[2.5rem] bg-white text-blue-600 shadow-xl shadow-slate-200/50 flex items-center justify-center transition-transform hover:scale-105 duration-500",
              )}
            >
              {HeartHandshake && (
                <HeartHandshake
                  className="w-16 h-16 md:w-20 md:h-20"
                  strokeWidth={1.2}
                />
              )}
            </div>
            <h1 className="text-3xl font-bold mb-8 text-primary">
              จัดการข้อมูลจัดซื้อจัดจ้าง
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <AdminInterface initialProcurements={procurements} />
      </div>
    </div>
  );
}
