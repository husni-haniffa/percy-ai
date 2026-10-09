"use client";

import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import type { Listing } from "@/types/listing";
import { useApi } from "./use-api";

export type CanCreate = {
    canCreate: boolean;
    reason: string | null;
    used: number;
    maxListings: number;
};

export function useMyListings() {
    const api = useApi();
    const { isLoaded, isSignedIn, userId } = useAuth();

    return useQuery({
        queryKey: ["my-listings", userId],
        queryFn: () => api<Listing[]>("/api/listings/mine"),
        enabled: isLoaded && !!isSignedIn,
    });
}

export function useCanCreate() {
    const api = useApi();
    const { isLoaded, isSignedIn, userId } = useAuth();

    return useQuery({
        queryKey: ["can-create", userId],
        queryFn: () => api<CanCreate>("/api/listings/can-create"),
        enabled: isLoaded && !!isSignedIn,
    });
}