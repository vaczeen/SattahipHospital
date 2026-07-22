import React from "react";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function DonatePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Link
        href="/main"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary transition-colors mb-6 group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />{" "}
        กลับหน้าแรก
      </Link>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-gray-950 mb-6 border-l-4 border-emerald-700 pl-4">
            ช่องทางการบริจาค
          </h1>

          <div className="flex flex-col md:flex-row gap-8 mb-8">
            <div className="flex justify-center">
              <Image
                src="/fillboon.jpg"
                alt="ช่องทางการบริจาค"
                width={350}
                height={350}
                className="rounded-xl shadow-lg  max-w-sm object-contain bg-white"
              />
            </div>
            <div className="flex justify-center">
              <Image
                src="/กองทุนพระเทพ2.jpg"
                alt="ช่องทางการบริจาค"
                width={350}
                height={200}
                className="rounded-xl shadow-lg  max-w-sm object-contain bg-white"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
