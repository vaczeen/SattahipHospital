import { getPolicyDocuments } from "@/lib/policy-actions";
import PolicyClient from "./PolicyClient";
import { Info, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const metadata = {
  title: "ประกาศและนโยบาย | โรงพยาบาลสัตหีบ",
  description: "ประกาศและนโยบายต่างๆ ของโรงพยาบาลสัตหีบ",
};

export default async function PolicyPage() {
  const docsData = await getPolicyDocuments();
  const docs = (docsData as any[]).map((item) => ({
    ...item,
    publishedAt: new Date(item.publishedAt).toISOString(),
    createdAt: new Date(item.createdAt).toISOString(),
  }));

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Hero Header */}
      <div className="w-full py-12 md:py-20 bg-amber-50 transition-all duration-700">
        <div className="container mx-auto px-4">
          <Link
            href="/main"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary transition-colors mb-6 group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />{" "}
            กลับหน้าแรก
          </Link>
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
            <div className="p-6 text-amber-500 rounded-[2.5rem] bg-white/90 shadow-xl shadow-slate-200/50 flex items-center justify-center transition-transform hover:scale-105 duration-500">
              <Info className="w-16 h-16 md:w-20 md:h-20" strokeWidth={1.2} />
            </div>

            <div className="text-center md:text-left">
              <h1 className="text-3xl  font-bold mb-3">
                ประกาศนโยบายและแผนปฏิบัติการ
              </h1>
              <p className="text-slate-600 max-w-2xl text-lg font-medium opacity-80">
                ประกาศ นโยบาย ระเบียบ และแนวทางปฏิบัติต่างๆ ของโรงพยาบาลสัตหีบ
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <PolicyClient docs={docs} />
      </div>
    </div>
  );
}
