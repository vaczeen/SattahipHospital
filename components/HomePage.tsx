"use client";

import { NewsCard } from "./NewsCard";
import { NewsModal } from "./NewsModal";
import { useState, useRef, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Building2,
  HeartHandshake,
  Info,
  Waypoints,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { newsItems, information } from "@/lib/news-data";
import { InformationCard } from "./InformationCard";

const services = [
  {
    id: 1,
    name: "จัดซื้อจัดจ้าง",
    description: "รายการประกาศจัดซื้อจัดจ้างและสรุปผลการจัดหาพัสดุ",
    href: "/main/procurement",
    icon: HeartHandshake,
    color: "bg-blue-50 text-blue-600 ",
    hoverColor: "group-hover:bg-blue-600 group-hover:text-white ",
    text: "hover:text-blue-600"
  },
  {
    id: 2,
    name: "หน่วยงานที่เกี่ยวข้อง",
    description: "ข้อมูลติดต่อหน่วยงานภายนอกโรงพยาบาล",
    href: "/main/externalAgencies",
    icon: Building2,
    color: "bg-emerald-50 text-emerald-600",
    hoverColor: "group-hover:bg-emerald-600 group-hover:text-white",
    text: "hover:text-emerald-600"
  },
  {
    id: 3,
    name: "ประกาศและนโยบาย",
    description: "ประกาศและนโยบายต่างๆจากกระทรวงสาธารณสุข",
    href: "/main/policy",
    icon: Info,
    color: "bg-yellow-50 text-yellow-600",
    hoverColor: "group-hover:bg-yellow-600 group-hover:text-white",
    text: "hover:text-yellow-600"
  },
  {
    id: 4,
    name: "แผนปฏิบัติและแนวทาง",
    description: "แผนปฏิบัติและแนวทางของโรงพยาบาลสัตหีบ",
    href: "/main/externalAgencies",
    icon: Waypoints,
    color: "bg-purple-50 text-purple-600",
    hoverColor: "group-hover:bg-purple-600 group-hover:text-white",
    text: "hover:text-purple-600"
  },
];

export function HomePage() {
  // newsItems removed (imported)

  const [selectedNews, setSelectedNews] = useState<
    (typeof newsItems)[0] | null
  >(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      scrollTo("right");
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isPaused]);

  const scrollTo = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const scrollAmount = 320; // Approx card width

      if (direction === "right") {
        // If we're near the end, scroll back to the beginning
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({
            left: 0,
            behavior: "smooth",
          });
          return;
        }
        scrollRef.current.scrollBy({
          left: scrollAmount,
          behavior: "smooth",
        });
      } else {
        // If we're at the beginning, scroll to the end
        if (scrollLeft <= 0) {
          scrollRef.current.scrollTo({
            left: scrollWidth,
            behavior: "smooth",
          });
          return;
        }
        scrollRef.current.scrollBy({
          left: -scrollAmount,
          behavior: "smooth",
        });
      }
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const scrollPercentage = scrollLeft / (scrollWidth - clientWidth);
      // Map 0-1 percentage to 0-2 index (3 dots)
      const index = Math.round(scrollPercentage * 2);
      setActiveIndex(Math.min(Math.max(index, 0), 2));
    }
  };

  const scrollToDot = (index: number) => {
    if (scrollRef.current) {
      const { scrollWidth, clientWidth } = scrollRef.current;
      const targetScroll = (index / 2) * (scrollWidth - clientWidth);
      scrollRef.current.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-16 bg-background relative group/section">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 text-primary">
          <span className="text-emerald-700 font-bold text-xl tracking-uppercase mb-2 block uppercase tracking-widest">
            ยินดีต้อนรับเข้าสู่ โรงพยาบาลสัตหีบ
          </span>
          <h2 className="text-3xl font-serif font-bold text-gray-900">ข้อมูลข่าวสาร</h2>
        </div>

        <div className="flex justify-end mb-6">
          <Link
            href="/main/news"
            className="group bg-emerald-700 text-white px-6 py-2 rounded-full hover:bg-emerald-800 transition-all font-medium inline-flex items-center gap-2 shadow-sm"
          >
            ดูข้อมูลข่าวสารทั้งหมด
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* news */}
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Navigation Buttons */}
          <button
            onClick={() => scrollTo("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 md:-ml-12 z-10 p-2 bg-white/80 hover:bg-white text-primary rounded-full shadow-md opacity-0 group-hover/section:opacity-100 transition-opacity disabled:opacity-0"
            disabled={activeIndex === 0 && false} // Optional: disable at start
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={() => scrollTo("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 md:-mr-12 z-10 p-2 bg-white/80 hover:bg-white text-primary rounded-full shadow-md opacity-0 group-hover/section:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto pb-6 gap-6 scrollbar-hide -mx-4 px-4 snap-x"
          >
            {[...newsItems, ...newsItems].map((item, index) => (
              <div
                key={index}
                className="min-w-[280px] md:min-w-[320px] snap-center"
              >
                <NewsCard {...item} onClick={() => setSelectedNews(item)} />
              </div>
            ))}
          </div>
        </div>

        {/* Pagination or view all dots */}
        <div className="flex justify-center gap-2 mt-4">
          {[0, 1, 2].map((i) => (
            <button
              key={i}
              onClick={() => scrollToDot(i)}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-colors cursor-pointer",
                activeIndex === i
                  ? "bg-emerald-700"
                  : "bg-primary/20 hover:bg-emerald-700",
              )}
            />
          ))}
        </div>
      </div>

      <NewsModal
        isOpen={!!selectedNews}
        onClose={() => setSelectedNews(null)}
        newsItem={selectedNews}
      />

      {/* information */}
      <div className="container mx-auto px-4 py-20 border-t border-border/10">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-0.5 w-2/3 bg-emerald-700"></div>
            <span className="text-gray-950 font-bold text-sm tracking-widest mb-2 block uppercase">
              Community and Information
            </span>
            <div className="h-0.5 w-2/3 bg-emerald-700"></div>
          </div>
          <h2 className="text-3xl font-serif font-bold text-emerald-700">
            ช่องทางการสื่อสารและข้อมูลสำคัญ
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            ช่องทางการติดตามข่าวสาร บริการ
            และข้อมูลสำคัญจากโรงพยาบาลผ่านระบบออนไลน์
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {information.map((item, index) => (
            <InformationCard
              key={index}
              {...item}
              onClick={() => setSelectedNews(item)}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 mb-4">
        <div className="h-0.5 w-2/3 bg-emerald-700"></div>
      </div>

      {/* service */}
      <div className="container mx-auto px-4 py-10 ">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
          {services.map((service) => (
            <Link
              key={service.id}
              href={service.href}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-border/50 hover:border-primary/20 hover:-translate-y-1"
            >
              <div className="p-4">
                <div
                  className={cn(
                    "w-12 h-10 rounded-xl flex items-center justify-center mb-5 transition-all duration-300",
                    service.color,
                    service.hoverColor,
                  )}
                >
                  <service.icon className="w-6 h-6" />
                </div>
                <h3 className={cn("font-bold text-lg text-gray-950  transition-colors mb-2",service.text)}>
                  {service.name}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {service.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
