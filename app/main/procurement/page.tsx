import { getProcurements } from "@/lib/actions";
import ProcurementClient from "./ProcurementClient";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { HeartHandshake, ChevronLeft } from "lucide-react"; // Using Handshake as alternative to HeartHandshake if preferred, but user used HeartHandshake. Handshake is fine.

export const metadata = {
  title: "จัดซื้อจัดจ้าง | โรงพยาบาลสัตหีบ",
  description: "ประกาศจัดซื้อจัดจ้าง และสรุปผลการจัดหาพัสดุ",
};

export default async function ProcurementPage() {
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
        <div className="container mx-auto px-4 ">
          <Link
            href="/main"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary transition-colors mb-6 group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />{" "}
            กลับหน้าแรก
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
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-bold mb-4">
                ประกวดราคาจัดซื้อจัดจ้าง
              </h1>
              <p className="text-gray-950-foreground/80 max-w-2xl mx-auto">
                ศูนย์รวมข้อมูลข่าวสารการจัดซื้อจัดจ้าง ประกาศ และราคากลาง
                ของโรงพยาบาล
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <ProcurementClient procurements={procurements} />
      </div>
    </div>
  );
}
