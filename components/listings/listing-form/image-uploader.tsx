"use client";

import { useRef } from "react";
import { AlertCircle, ImagePlus, Loader2, Star, X } from "lucide-react";
import { toast } from "sonner";
import { useApi } from "@/lib/use-api";
import { cn } from "@/lib/utils";

export type ImageItem =
    | { id: string; status: "existing"; url: string }
    | { id: string; status: "uploading"; previewUrl: string }
    | { id: string; status: "ready"; previewUrl: string; key: string }
    | { id: string; status: "error"; previewUrl: string; message: string };

type Ticket = { key: string; uploadUrl: string };

const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_MB = 5;

export function ImageUploader({
    items,
    setItems,
    max = 10,
}: {
    items: ImageItem[];
    setItems: React.Dispatch<React.SetStateAction<ImageItem[]>>;
    max?: number;
}) {
    const api = useApi();
    const inputRef = useRef<HTMLInputElement>(null);

    function replaceItem(id: string, newItem: ImageItem) {
        setItems((previous) => previous.map((item) => (item.id === id ? newItem : item)));
    }

    async function handleFiles(fileList: FileList | null) {
        if (!fileList) return;

        // 1. Check the files in the browser first
        const room = max - items.length;
        const picked = Array.from(fileList);
        if (picked.length > room) {
            toast.error(room > 0 ? `You can add ${room} more photo(s)` : `Maximum ${max} photos`);
        }

        const files = picked.slice(0, Math.max(room, 0)).filter((file) => {
            if (!ACCEPTED.includes(file.type)) {
                toast.error(`${file.name}: only JPG, PNG or WEBP images are allowed`);
                return false;
            }
            if (file.size > MAX_SIZE_MB * 1024 * 1024) {
                toast.error(`${file.name} is larger than ${MAX_SIZE_MB} MB`);
                return false;
            }
            return true;
        });
        if (files.length === 0) return;

        // Show the thumbnails straight away, with a spinner
        const placeholders = files.map((file) => ({
            id: crypto.randomUUID(),
            status: "uploading" as const,
            previewUrl: URL.createObjectURL(file),
        }));
        setItems((previous) => [...previous, ...placeholders]);

        try {
            // 2. Ask the backend for one upload ticket per photo
            const tickets = await api<Ticket[]>("/api/images/presign", {
                method: "POST",
                body: JSON.stringify({ contentTypes: files.map((file) => file.type) }),
            });

            // 3. Send each photo straight to R2 with its ticket
            await Promise.all(
                files.map(async (file, index) => {
                    const placeholder = placeholders[index];
                    try {
                        const response = await fetch(tickets[index].uploadUrl, {
                            method: "PUT",
                            headers: { "Content-Type": file.type },
                            body: file,
                        });
                        if (!response.ok) throw new Error("Upload failed");

                        replaceItem(placeholder.id, {
                            id: placeholder.id,
                            status: "ready",
                            previewUrl: placeholder.previewUrl,
                            key: tickets[index].key,
                        });
                    } catch {
                        replaceItem(placeholder.id, {
                            id: placeholder.id,
                            status: "error",
                            previewUrl: placeholder.previewUrl,
                            message: "Upload failed",
                        });
                    }
                })
            );
        } catch (error) {
            // Getting the tickets failed, so every new photo failed
            for (const placeholder of placeholders) {
                replaceItem(placeholder.id, {
                    id: placeholder.id,
                    status: "error",
                    previewUrl: placeholder.previewUrl,
                    message: error instanceof Error ? error.message : "Upload failed",
                });
            }
        }

        if (inputRef.current) inputRef.current.value = "";
    }

    function remove(item: ImageItem) {
        setItems((previous) => previous.filter((other) => other.id !== item.id));

        if (item.status !== "existing") URL.revokeObjectURL(item.previewUrl);

        // A photo that already reached R2 but won't be used: ask the backend to delete it
        if (item.status === "ready") {
            api("/api/images/rollback", {
                method: "POST",
                body: JSON.stringify({ keys: [item.key] }),
            }).catch(() => { });
        }
    }

    function makeCover(id: string) {
        setItems((previous) => {
            const item = previous.find((other) => other.id === id);
            return item ? [item, ...previous.filter((other) => other.id !== id)] : previous;
        });
    }

    return (
        <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {items.map((item, index) => {
                    const source = item.status === "existing" ? item.url : item.previewUrl;
                    const canBeCover = item.status === "ready" || item.status === "existing";

                    return (
                        <div
                            key={item.id}
                            className={cn(
                                "group relative aspect-square overflow-hidden rounded-lg border bg-neutral-100",
                                item.status === "error" && "border-red-400"
                            )}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={source} alt="" className="size-full object-cover" />

                            {item.status === "uploading" && (
                                <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                                    <Loader2 className="size-6 animate-spin text-red-700" />
                                </div>
                            )}

                            {item.status === "error" && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-red-50/90 p-2 text-center text-xs text-red-800">
                                    <AlertCircle className="size-5" />
                                    {item.message}. Remove it and try again.
                                </div>
                            )}

                            {index === 0 && canBeCover && (
                                <span className="absolute left-2 top-2 rounded bg-red-700 px-2 py-0.5 text-xs font-semibold text-white">
                                    Cover
                                </span>
                            )}

                            {index !== 0 && canBeCover && (
                                <button
                                    type="button"
                                    onClick={() => makeCover(item.id)}
                                    className="absolute bottom-2 left-2 flex items-center gap-1 rounded bg-black/70 px-2 py-1 text-xs text-white opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                                >
                                    <Star className="size-3" /> Make cover
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={() => remove(item)}
                                aria-label="Remove photo"
                                className="absolute right-2 top-2 rounded-full bg-black/70 p-1 text-white hover:bg-black"
                            >
                                <X className="size-4" />
                            </button>
                        </div>
                    );
                })}

                {items.length < max && (
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed text-sm text-neutral-500 transition hover:border-red-700 hover:text-red-700"
                    >
                        <ImagePlus className="size-6" />
                        Add photos
                    </button>
                )}
            </div>

            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="hidden"
                onChange={(event) => handleFiles(event.target.files)}
            />

            <p className="text-xs text-neutral-500">
                {items.length} of {max} photos. JPG, PNG or WEBP, up to {MAX_SIZE_MB} MB each. The
                first photo is the cover.
            </p>
        </div>
    );
}