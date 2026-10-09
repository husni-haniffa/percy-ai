import { SearchX } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Listing } from "@/types/listing";
import { ListingCard } from "./listing-card";

function CardSkeleton() {
    return (
        <div className="overflow-hidden rounded-xl border bg-white">
            <Skeleton className="aspect-[4/3] w-full rounded-none" />
            <div className="space-y-3 p-4">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/3" />
            </div>
        </div>
    );
}

export function ListingGrid({
    items,
    isLoading,
    error,
    skeletonCount = 6,
    className,
}: {
    items?: Listing[];
    isLoading: boolean;
    error: Error | null;
    skeletonCount?: number;
    className?: string;
}) {
    const gridClass = cn("grid gap-6 sm:grid-cols-2", className ?? "xl:grid-cols-3");

    if (isLoading) {
        return (
            <div className={gridClass}>
                {Array.from({ length: skeletonCount }).map((_, i) => (
                    <CardSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-800">
                {error.message}
            </div>
        );
    }

    if (!items || items.length === 0) {
        return (
            <div className="flex flex-col items-center rounded-xl border border-dashed py-16 text-center">
                <SearchX className="mb-3 size-10 text-neutral-300" />
                <p className="font-semibold text-neutral-900">No listings found</p>
                <p className="mt-1 text-sm text-neutral-500">
                    Try changing or clearing your filters.
                </p>
            </div>
        );
    }

    return (
        <div className={gridClass}>
            {items.map((listing) => (
                <ListingCard key={listing._id} listing={listing} />
            ))}
        </div>
    );
}