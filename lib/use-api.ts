"use client";

import { useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { apiFetch } from "./api";

export function useApi() {
    const { getToken } = useAuth();

    return useCallback(
        async <T,>(path: string, options: RequestInit = {}) => {
            const token = await getToken();
            return apiFetch<T>(path, { ...options, token });
        },
        [getToken]
    );
}