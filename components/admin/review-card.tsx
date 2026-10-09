"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Mail, MapPin, Phone, User } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImageGallery } from "@/components/listings/image-gallery";
import { getDetails } from "@/components/listings/listing-detail";
import { capitalize, formatDate, formatPrice } from "@/lib/format";
import type { PendingListing } from "@/lib/use-admin";
import { useApi } from "@/lib/use-api";
import { cn } from "@/lib/utils";
import { RejectDialog } from "./reject-dialog";

export function ReviewCard({ listing }: { listing: PendingListing }) {
    const api = useApi();
    const queryClient = useQueryClient();
    const [rejectOpen, setRejectOpen] = useState(false);

    const approve = useMutation({
        mutationFn: () =>
            api(`/api/admin/listings/${listing._id}/approve`, { method: "POST" }),
        onSuccess: async () => {
            toast.success(`"${listing.title}" is now live`);
            await queryClient.invalidateQueries({ queryKey: ["browse"] });
            await queryClient.invalidateQueries({ queryKey: ["listing"] });
        },
        onError: (error) => toast.error(error.message),
        // On success or failure, reload the queue so it never shows stale cards
        onSettled: () => queryClient.invalidateQueries({ queryKey: ["admin", "pending"] }),
    });

    const { owner } = listing;

    return (
        <article className="overflow-hidden rounded-xl border bg-white">
            <div className="grid gap-6 p-5 lg:grid-cols-[380px_1fr]">
                <ImageGallery images={listing.images} title={listing.title} />

                <div className="space-y-5">
                    <div>
                        <div className="mb-2 flex flex-wrap gap-2">
                            <Badge
                                className={cn(
                                    "text-white",
                                    listing.purpose === "sale" ? "bg-red-700" : "bg-black"
                                )}
                            >
                                {listing.purpose === "sale" ? "For sale" : "For rent"}
                            </Badge>
                            <Badge variant="outline">{capitalize(listing.category)}</Badge>
                            {listing.approvedAt && (
                                <Badge className="bg-amber-100 text-amber-800">Previously approved</Badge>
                            )}
                        </div>
                        <h2 className="text-2xl font-bold text-red-700">{listing.title}</h2>
                        <p className="mt-1 flex items-center gap-1.5 text-sm text-neutral-600">
                            <MapPin className="size-4" /> {listing.city}
                        </p>
                        <p className="mt-2 text-2xl font-bold">{formatPrice(listing.price)}</p>
                    </div>

                    <p className="whitespace-pre-line text-sm leading-relaxed text-neutral-700">
                        {listing.description}
                    </p>

                    <dl className="grid gap-x-8 sm:grid-cols-2">
                        {getDetails(listing).map((row) => (
                            <div
                                key={row.label}
                                className="flex justify-between gap-4 border-b py-2 text-sm"
                            >
                                <dt className="text-neutral-500">{row.label}</dt>
                                <dd className="font-medium">{row.value}</dd>
                            </div>
                        ))}
                    </dl>

                    <div className="space-y-1.5 rounded-lg bg-neutral-50 p-4 text-sm">
                        <p className="font-semibold">Posted by</p>
                        <p className="flex items-center gap-2">
                            <User className="size-4 text-neutral-400" /> {owner.name}
                        </p>
                        <p className="flex items-center gap-2">
                            <Mail className="size-4 text-neutral-400" />
                            <a href={`mailto:${owner.email}`} className="hover:text-red-700">
                                {owner.email}
                            </a>
                        </p>
                        <p className="flex items-center gap-2">
                            <Phone className="size-4 text-neutral-400" />
                            <a href={`tel:${owner.phone}`} className="hover:text-red-700">
                                {owner.phone}
                            </a>
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t bg-neutral-50 px-5 py-4">
                <p className="text-xs text-neutral-500">
                    Submitted {formatDate(listing.updatedAt)}
                </p>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        className="text-red-700 hover:text-red-800"
                        onClick={() => setRejectOpen(true)}
                        disabled={approve.isPending}
                    >
                        Reject
                    </Button>
                    <Button onClick={() => approve.mutate()} disabled={approve.isPending}>
                        {approve.isPending ? "Approving..." : "Approve"}
                    </Button>
                </div>
            </div>

            <RejectDialog
                listingId={listing._id}
                title={listing.title}
                open={rejectOpen}
                onClose={() => setRejectOpen(false)}
            />
        </article>
    );
}