import React from "react";
import prisma from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { departmentsData } from "@/lib/departmentsData";

export default async function department() {
  const deptConfigs = await prisma.departmentConfig.findMany();

  const departments = departmentsData.map((style) => {
    const config = deptConfigs.find((c) => c.slug === style.slug);
    return {
      ...style,
      label: config?.label ?? style.slug,
      description: config?.description ?? "",
    };
  });
  
  return (
    <div className="container mx-auto px-4 py-12">
      <Link
        href="/main"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary transition-colors mb-6 group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />{" "}
        กลับหน้าแรก
      </Link>

      <h1 className="text-3xl font-bold text-gray-950 mb-8 border-l-4 border-emerald-700 pl-4">
        หน่วยงานต่างๆ
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {departments.map((item, index) => {
          const CardContent = () => (
            <>
              {/* Background Gradient Effect on Hover */}
              <div
                className={cn(
                  "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br",
                  item.bgGradient,
                )}
              />

              <div
                className={cn(
                  "relative z-10 p-4 rounded-2xl bg-muted/30 group-hover:bg-white/60 group-hover:shadow-sm transition-all duration-300 mb-3",
                  item.color,
                  item.iconClassName,
                )}
              >
                {item.imageSrc ? (
                  <div className={cn("w-8 h-8 relative", item.imageClassName)}>
                    <Image
                      src={item.imageSrc}
                      alt={item.label}
                      fill
                      sizes="1080px"
                      className="object-contain"
                    />
                  </div>
                ) : (
                  item.icon && (
                    <item.icon className="w-8 h-8" strokeWidth={1.5} />
                  )
                )}
              </div>

              <div className="relative z-10 text-center space-y-1">
                <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                  {item.label}
                </h3>
                <p className="text-xs text-muted-foreground group-hover:text-gray-600 transition-colors">
                  {item.description}
                </p>
              </div>

              {/* Visual Decorative Element - Only show if icon exists */}
              {item.icon && (
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-20 transition-all duration-300 transform translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0">
                  <item.icon
                    className={cn("w-12 h-12 rotate-12", item.color)}
                  />
                </div>
              )}
            </>
          );

          const cardClasses =
            "group relative flex flex-col items-center justify-center p-6 bg-background border rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden";

          const href = `/main/about/department/${item.slug}`;

          return (
            <Link
              key={index}
              href={href}
              className={cardClasses}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              <CardContent />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
