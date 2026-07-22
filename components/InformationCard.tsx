import Image from "next/image";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

interface InformationCardProps {
    title: string;
    imageSrc?: string;
    content?: string;
    extraImages?: string[];
    onClick?: () => void;
}

export function InformationCard({ title, imageSrc, extraImages, onClick }: InformationCardProps) {
    return (
        <div
            onClick={onClick}
            className={cn(
                "group relative bg-white border border-border/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col items-center p-8 text-center",
                onClick && "cursor-pointer"
            )}
        >
            <div className="relative w-64 h-64 mb-6 rounded-2xl overflow-hidden bg-muted group-hover:scale-105 transition-transform duration-500 shadow-inner">
                {imageSrc ? (
                    <Image
                        src={imageSrc}
                        alt={title}
                        fill
                        className="object-contain p-2"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-gray-50">
                        <span className="text-xs font-mono">QR CODE</span>
                    </div>
                )}
            </div>

            <h3 className="text-xl font-bold text-gray-950 mb-3 group-hover:text-emerald-700 transition-colors">
                {title}
            </h3>


            {/* Extra Images Grid */}
            {/* {extraImages && extraImages.length > 0 && (
                <div className="grid grid-cols-2 gap-4 mb-6">
                    {extraImages.map((src, index) => (
                        <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden border border-border/10 bg-muted hover:scale-110 transition-transform duration-300">
                            <Image
                                src={src}
                                alt={`${title} extra ${index + 1}`}
                                fill
                                className="object-contain p-1"
                            />
                        </div>
                    ))}
                </div>
            )} */}

            <div className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 group-hover:translate-x-1 transition-transform">
                <span>ดูรายละเอียด</span>
                <ExternalLink className="w-4 h-4" />
            </div>

            {/* Subtle glow effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </div>
    );
}
