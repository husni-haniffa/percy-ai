"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ImageOff } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/layout/container";
import { Pagination } from "@/components/shared/pagination";
import { StatusTabs, type TabOption } from "@/components/shared/status-tabs";
import { capitalize, formatDate, formatPrice } from "@/lib/format";
import { getDisplayStatus, statusStyles } from "@/lib/listing-status";
import {
    refreshAfterAdminChange,
    useAdminListings,
    type AdminStatus,
    type PendingListing,
} from "@/lib/use-admin";
import { useApi } from "@/lib/use-api";
import { RemoveDialog } from "./remove-dialog";

function Row({
    listing,
    onRemove,
}: {
    listing: PendingListing;
    onRemove: (listing: PendingListing) => void;
}) {
    const api = useApi();
    const queryClient = useQueryClient();
    const status = getDisplayStatus(listing);
    const style = statusStyles[status];
    const image = listing.images[0];

    const restore = useMutation({
        mutationFn: () =>
            api(`/api/admin/listings/${listing._id}/restore`, { method: "POST" }),
        onSuccess: async () => {
            toast.success("Listing restored. It is back in the review queue.");
            await refreshAfterAdminChange(queryClient);
        },
        onError: (error) => toast.error(error.message),
    });

    return (
        <div className="flex flex-col gap-4 rounded-xl border bg-white p-4 sm:flex-row">
            <div className="size-24 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                {image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={image} alt="" className="size-full object-cover" />
                ) : (
                    <div className="flex size-full items-center justify-center text-neutral-300">
                        <ImageOff className="size-6" />
                    </div>
                )}
            </div>

            <div className="min-w-0 flex-1 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate font-semibold">{listing.title}</h3>
                    <Badge className={style.className}>{style.label}</Badge>
                </div>
                <p className="text-sm text-neutral-600">
                    {capitalize(listing.category)} · {listing.city} · {formatPrice(listing.price)} ·
                    posted {formatDate(listing.createdAt)}
                </p>
                <p className="text-xs text-neutral-500">
                    By {listing.owner.name} · {listing.owner.email} · {listing.owner.phone}
                </p>
                <p className="text-xs text-neutral-500">
                    {listing.views ?? 0} views · {listing.contactInfoViews ?? 0} contact views ·{" "}
                    {listing.inquiries ?? 0} inquiries
                </p>
                {status === "removed" && (
                    <p className="text-xs text-red-800">Removed: {listing.removalReason}</p>
                )}
            </div>

            <div className="flex shrink-0 flex-row gap-2 sm:flex-col">
                {status === "live" && (
                    <Link
                        href={`/listings/${listing._id}`}
                        className={buttonVariants({ variant: "outline", size: "sm" })}
                    >
                        View
                    </Link>
                )}
                {status === "pending" && (
                    <Link href="/admin" className={buttonVariants({ variant: "outline", size: "sm" })}>
                        Review
                    </Link>
                )}
                {status === "removed" ? (
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={restore.isPending}
                        onClick={() => restore.mutate()}
                    >
                        {restore.isPending ? "Restoring..." : "Restore"}
                    </Button>
                ) : (
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-red-700 hover:text-red-800"
                        onClick={() => onRemove(listing)}
                    >
                        Remove
                    </Button>
                )}
            </div>
        </div>
    );
}

export function AllListings() {
    const [status, setStatus] = useState<AdminStatus>("all");
    const [page, setPage] = useState(1);
    const [toRemove, setToRemove] = useState<PendingListing | null>(null);

    const { data, isPending, error, refetch } = useAdminListings(status, page);
    const counts = data?.counts;

    const tabs: TabOption<AdminStatus>[] = [
        { value: "all", label: "All", count: counts?.all },
        { value: "live", label: "Live", count: counts?.live },
        { value: "pending", label: "Pending", count: counts?.pending },
        { value: "rejected", label: "Rejected", count: counts?.rejected },
        { value: "expired", label: "Expired", count: counts?.expired },
        { value: "removed", label: "Removed", count: counts?.removed },
    ];

    return (
        <Container className="space-y-6 py-10">
            <div>
                <h1 className="text-3xl font-bold text-red-700 sm:text-4xl">All listings</h1>
                <p className="mt-1 text-neutral-600">
                    Every listing on Percy. Remove anything reported as a scam or against the rules.
                </p>
            </div>

            <StatusTabs
                options={tabs}
                value={status}
                onChange={(next) => {
                    setStatus(next);
                    setPage(1);
                }}
            />

            {isPending ? (
                <div className="space-y-4">
                    <Skeleton className="h-32 w-full rounded-xl" />
                    <Skeleton className="h-32 w-full rounded-xl" />
                    <Skeleton className="h-32 w-full rounded-xl" />
                </div>
            ) : error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-800">
                    <p>{error.message}</p>
                    <Button className="mt-4" onClick={() => refetch()}>
                        Try again
                    </Button>
                </div>
            ) : data.items.length === 0 ? (
                <div className="rounded-xl border border-dashed bg-white py-16 text-center text-sm text-neutral-500">
                    No listings with this status.
                </div>
            ) : (
                <div className="space-y-4">
                    {data.items.map((listing) => (
                        <Row key={listing._id} listing={listing} onRemove={setToRemove} />
                    ))}
                </div>
            )}

            {data && (
                <Pagination
                    page={data.page}
                    totalPages={data.totalPages}
                    onChange={(next) => {
                        setPage(next);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                />
            )}

            <RemoveDialog listing={toRemove} onClose={() => setToRemove(null)} />
        </Container>
    );
}