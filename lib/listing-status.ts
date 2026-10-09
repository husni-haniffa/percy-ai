import type { Listing } from "@/types/listing";

export type DisplayStatus = "live" | "pending" | "rejected" | "expired" | "removed";

// "approved" is split into live or expired, using the same rule as the backend
export function getDisplayStatus(listing: Listing): DisplayStatus {
    if (listing.status === "approved") {
        const expired = listing.expiresAt && new Date(listing.expiresAt) <= new Date();
        return expired ? "expired" : "live";
    }
    return listing.status;
}

export const statusStyles: Record<DisplayStatus, { label: string; className: string }> = {
    live: { label: "Live", className: "bg-green-100 text-green-800" },
    pending: { label: "Pending review", className: "bg-amber-100 text-amber-800" },
    rejected: { label: "Rejected", className: "bg-red-100 text-red-800" },
    expired: { label: "Expired", className: "bg-neutral-200 text-neutral-700" },
    removed: { label: "Removed", className: "bg-neutral-900 text-white" },
};