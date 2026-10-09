"use client";

import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import type { MeResponse } from "@/types/user";
import { useApi } from "./use-api";

export function useMe() {
    const api = useApi();
    const { isLoaded, isSignedIn, userId } = useAuth();

    return useQuery({
        queryKey: ["me", userId],
        queryFn: () => api<MeResponse>("/api/users/me"),
        enabled: isLoaded && !!isSignedIn,
    });
}