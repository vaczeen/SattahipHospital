"use client";

import { X, Calendar, User } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";

interface NewsItem {
    date: string;
    author: string;
    title: string;
    imageSrc?: string;
    content?: string;
}

interface NewsModalProps {
    isOpen: boolean;
    onClose: () => void;
    newsItem: NewsItem | null;
}

export function NewsModal({ isOpen, onClose, newsItem }: NewsModalProps) {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        if (isOpen) {
            document.body.style.overflow = "hidden";
            window.addEventListener("keydown", handleEsc);
        }

        return () => {
            document.body.style.overflow = "unset";
            window.removeEventListener("keydown", handleEsc);
        };
    }, [isOpen, onClose]);

    if (!isOpen || !newsItem) return null;

    const renderContent = (text: string) => {
        // Regex to match URLs or (img:/path/to/img.png)
        const combinedRegex = /(https?:\/\/[^\s]+|\(img:[^\)]+\))/g;
        const parts = text.split(combinedRegex);

        return parts.map((part, index) => {
            // Check for image tag: (img:path)
            const imgMatch = part.match(/\(img:([^\)]+)\)/);
            if (imgMatch) {
                const imgSrc = imgMatch[1];
                return (
                    <span key={index} className="block my-6 max-w-sm mx-auto overflow-hidden rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
                        <Image
                            src={imgSrc}
                            alt="Inline image"
                            width={400}
                            height={400}
                            className="w-full h-auto object-contain"
                        />
                    </span>
                );
            }

            // Check for regular URL
            const urlRegex = /https?:\/\/[^\s]+/;
            if (part.match(urlRegex)) {
                return (
                    <a
                        key={index}
                        href={part}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline break-all"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {part}
                    </a>
                );
            }

            // Regular text
            return <span key={index}>{part}</span>;
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-background w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 z-10 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="relative w-full h-64 md:h-80 shrink-0">
                    <div className="absolute inset-0 bg-gray-200">
                        {newsItem.imageSrc ? (
                            <Image
                                src={newsItem.imageSrc}
                                alt={newsItem.title}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                No Image
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-6 md:p-8">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            <span>{newsItem.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <User className="w-4 h-4" />
                            <span>{newsItem.author}</span>
                        </div>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">
                        {newsItem.title}
                    </h2>

                    <div className="prose prose-gray max-w-none">
                        {newsItem.content ? (
                            <div className="whitespace-pre-wrap leading-relaxed">
                                {renderContent(newsItem.content)}
                            </div>
                        ) : (
                            <p className="text-muted-foreground italic">
                                No content available for this article.
                            </p>
                        )}

                        {/* Dummy lorem ipsum content for demonstration if short content */}
                        {!newsItem.content && (
                            <div className="space-y-4 text-muted-foreground">
                                <p>
                                    No content available for this article.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
