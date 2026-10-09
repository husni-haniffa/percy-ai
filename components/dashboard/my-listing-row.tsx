import Link from "next/link";
import { Eye, ImageOff, MessageSquare, Phone, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { capitalize, daysLeft, formatDate, formatPrice } from "@/lib/format";
import { getDisplayStatus, statusStyles, type DisplayStatus } from "@/lib/listing-status";
import { cn } from "@/lib/utils";
import type { Listing } from "@/types/listing";

function Stat({ icon: Icon, value, label }: { icon: LucideIcon; value: number; label: string }) {
    return (
        <span className="flex items-center gap-1.5">
            <Icon className="size-4 text-neutral-400" />
            <strong className="text-neutral-900">{value}</strong> {label}
        </span>
    );
}

function StatusMessage({ listing, status }: { listing: Listing; status: DisplayStatus }) {
    if (status === "pending") {
        return (
            <p className="text-sm text-amber-800">
                Waiting for review. It goes live once the admin approves it.
            </p>
        );
    }

    if (status === "rejected") {
        return (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-900">
                <strong>Rejected:</strong> {listing.rejectionReason ?? "No reason was given."} Edit
                the listing to fix this and send it for review again.
            </p>
        );
    }

    if (status === "live" && listing.expiresAt) {
        return (
            <p className="text-sm text-neutral-600">
                Visible to everyone until {formatDate(listing.expiresAt)} (
                {daysLeft(listing.expiresAt)} days left). Editing it sends it back for review and
                hides it until it is approved again.
            </p>
        );
    }

    if (status === "expired" && listing.expiresAt) {
        return (
            <p className="text-sm text-neutral-600">
                Expired on {formatDate(listing.expiresAt)}. It is no longer visible and cannot be
                edited.
            </p>
        );
    }

    if (status === "removed") {
        return (
            <p className="rounded-lg bg-neutral-100 p-3 text-sm text-neutral-800">
                <strong>Removed by an admin:</strong>{" "}
                {listing.removalReason ?? "No reason was given."} If you think this is a
                mistake, please contact us.
            </p>
        );
    }

    return null;
}

export function MyListingRow({
    listing,
    planExpired,
    onDelete,
}: {
    listing: Listing;
    planExpired: boolean;
    onDelete: (listing: Listing) => void;
}) {
    const status = getDisplayStatus(listing);
    const style = statusStyles[status];
    const image = listing.images[0];
    const canEdit = status !== "expired" && status !== "removed" && !planExpired;

    return (
        <div className="flex flex-col overflow-hidden rounded-xl border bg-white sm:flex-row">
            <div className="h-44 shrink-0 bg-neutral-100 sm:h-auto sm:w-48">
                {image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={image} alt={listing.title} className="size-full object-cover" />
                ) : (
                    <div className="flex size-full items-center justify-center text-neutral-300">
                        <ImageOff className="size-8" />
                    </div>
                )}
            </div>

            <div className="flex flex-1 flex-col gap-3 p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                        <h3 className="text-lg font-semibold text-neutral-900">{listing.title}</h3>
                        <p className="text-sm text-neutral-500">
                            {capitalize(listing.category)} · {listing.city} ·{" "}
                            {listing.purpose === "sale" ? "For sale" : "For rent"}
                        </p>
                    </div>
                    <Badge className={style.className}>{style.label}</Badge>
                </div>

                <p className="text-xl font-bold text-red-700">{formatPrice(listing.price)}</p>

                <StatusMessage listing={listing} status={status} />

                <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-neutral-600">
                    <Stat icon={Eye} value={listing.views ?? 0} label="views" />
                    <Stat icon={Phone} value={listing.contactInfoViews ?? 0} label="contact views" />
                    <Stat icon={MessageSquare} value={listing.inquiries ?? 0} label="inquiries" />
                </div>

                <div className="mt-auto flex flex-wrap gap-2 pt-2">
                    {status === "live" && (
                        <Link
                            href={`/listings/${listing._id}`}
                            className={buttonVariants({ variant: "outline", size: "sm" })}
                        >
                            View
                        </Link>
                    )}

                    {canEdit ? (
                        <Link
                            href={`/dashboard/listings/${listing._id}/edit`}
                            className={buttonVariants({ variant: "outline", size: "sm" })}
                        >
                            Edit
                        </Link>
                    ) : (
                        <Button variant="outline" size="sm" disabled>
                            Edit
                        </Button>
                    )}

                    <Button
                        variant="outline"
                        size="sm"
                        className={cn("text-red-700 hover:text-red-800")}
                        onClick={() => onDelete(listing)}
                    >
                        Delete
                    </Button>
                </div>
            </div>
        </div>
    );
}