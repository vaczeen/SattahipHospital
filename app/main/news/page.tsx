"use client";

import React, { useState } from "react";
import { NewsCard } from "@/components/NewsCard";
import { NewsModal } from "@/components/NewsModal";
import { newsItems } from "@/lib/news-data";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function NewsPage() {
  const [selectedNews, setSelectedNews] = useState<
    (typeof newsItems)[0] | null
  >(null);

  return (
    <div className="container mx-auto px-4 py-12">
      <Link
        href="/main"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary transition-colors mb-6 group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />{" "}
        กลับหน้าแรก
      </Link>

      <h1 className="text-3xl font-bold text-gray-950 mb-6 border-l-4 border-emerald-700 pl-4">
        ข่าวสารและกิจกรรม
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {newsItems.map((item, index) => (
          <div key={index} className="w-full">
            <NewsCard {...item} onClick={() => setSelectedNews(item)} />
          </div>
        ))}
      </div>

      <NewsModal
        isOpen={!!selectedNews}
        onClose={() => setSelectedNews(null)}
        newsItem={selectedNews}
      />
    </div>
  );
}
