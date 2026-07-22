import { Calendar, User } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface NewsCardProps {
    date: string;
    author: string;
    title: string;
    imageSrc?: string; // Placeholder for now
    onClick?: () => void;
}

export function NewsCard({ date, author, title, imageSrc, onClick }: NewsCardProps) {
    return (
        <div
            onClick={onClick}
            className={cn(
                "group flex flex-col bg-background border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all h-full",
                onClick && "cursor-pointer"
            )}
        >
            <div className="relative h-48 bg-muted w-full overflow-hidden">
                {/* Placeholder for Image */}
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-gray-100">
                    {imageSrc ? (
                        <Image
                            src={imageSrc}
                            alt={title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <span className="text-sm">Image Placeholder</span>
                    )}
                </div>
            </div>

            <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{date}</span>
                    </div>

                </div>

                <h3 className="text-lg font-medium text-gray-950 mb-auto line-clamp-2 group-hover:text-emerald-700 transition-colors">
                    {title}
                </h3>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50 text-xs text-muted-foreground">
                    {/* <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 hover:text-secondary cursor-pointer">
                            <Eye className="w-4 h-4" />
                            <span>{views}</span>
                        </div>
                        <div className="flex items-center gap-1 hover:text-red-500 cursor-pointer">
                            <Heart className="w-4 h-4" />
                            <span>{likes}</span>
                        </div>
                    </div> */}
                    <button className="p-1 rounded-full bg-indigo-100 hover:bg-indigo-200 transition-colors">
                        {/* Arrow icon could go here */}
                        <div className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5" />
                            <span>{author}</span>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}
