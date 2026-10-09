/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

export function ImageGallery({ images, title }: { images: string[]; title: string }) {
    const [index, setIndex] = useState(0);

    if (images.length === 0) {
        return (
            <div className="flex aspect-[16/10] items-center justify-center rounded-xl bg-neutral-100 text-neutral-300">
                <ImageOff className="size-12" />
            </div>
        );
    }

    const previous = () => setIndex((i) => (i - 1 + images.length) % images.length);
    const next = () => setIndex((i) => (i + 1) % images.length);

    return (
        <div className="space-y-3">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-neutral-100 sm:aspect-[16/10]">
                <img
                    src={images[index]}
                    alt={`${title}, photo ${index + 1}`}
                    className="size-full object-cover"
                />

                {images.length > 1 && (
                    <>
                        <button
                            onClick={previous}
                            aria-label="Previous photo"
                            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow hover:bg-white"
                        >
                            <ChevronLeft className="size-5" />
                        </button>
                        <button
                            onClick={next}
                            aria-label="Next photo"
                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow hover:bg-white"
                        >
                            <ChevronRight className="size-5" />
                        </button>
                        <span className="absolute bottom-3 right-3 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white">
                            {index + 1} / {images.length}
                        </span>
                    </>
                )}
            </div>

            {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {images.map((src, i) => (
                        <button
                            key={src}
                            onClick={() => setIndex(i)}
                            aria-label={`Show photo ${i + 1}`}
                            className={cn(
                                "h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition",
                                i === index
                                    ? "border-red-700"
                                    : "border-transparent opacity-70 hover:opacity-100"
                            )}
                        >
                            <img src={src} alt="" className="size-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}