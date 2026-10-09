"use client";

import { useAuth } from "@clerk/nextjs";
import { keepPreviousData, QueryClient, useQuery } from "@tanstack/react-query";
import type { Listing, Paginated } from "@/types/listing";
import { useApi } from "./use-api";

export type Owner = { _id: string; name: string; email: string; phone: string };
export type PendingListing = Listing & { owner: Owner };

export function useAdminPending(enabled = true) {
    const api = useApi();
    const { isLoaded, isSignedIn, userId } = useAuth();

    return useQuery({
        queryKey: ["admin", "pending", userId],
        queryFn: () => api<PendingListing[]>("/api/admin/listings/pending"),
        enabled: enabled && isLoaded && !!isSignedIn,
        refetchInterval: 60_000, // check for new listings every minute
    });
}

export type AdminStatus =
    | "all"
    | "live"
    | "pending"
    | "rejected"
    | "expired"
    | "removed";

export type AdminListingsResponse = Paginated<PendingListing> & {
    counts: Record<AdminStatus, number>;
};

export function useAdminListings(status: AdminStatus, page: number) {
    const api = useApi();
    const { isLoaded, isSignedIn, userId } = useAuth();

    return useQuery({
        queryKey: ["admin", "listings", userId, status, page],
        queryFn: () =>
            api<AdminListingsResponse>(`/api/admin/listings?status=${status}&page=${page}`),
        enabled: isLoaded && !!isSignedIn,
        placeholderData: keepPreviousData,
    });
}

// After removing or restoring, refresh everything that could show the listing
export function refreshAfterAdminChange(queryClient: QueryClient) {
    return Promise.all(
        ["admin", "browse", "listing", "ai-search"].map((key) =>
            queryClient.invalidateQueries({ queryKey: [key] })
        )
    );
}

export type AdminPlan = {
    _id: string;
    name: string;
    durationDays: number;
    maxListings: number;
    isDefault: boolean;
};

export function useAdminPlans() {
    const api = useApi();
    const { isLoaded, isSignedIn, userId } = useAuth();

    return useQuery({
        queryKey: ["admin", "plans", userId],
        queryFn: () => api<AdminPlan[]>("/api/plans"),
        enabled: isLoaded && !!isSignedIn,
    });
}