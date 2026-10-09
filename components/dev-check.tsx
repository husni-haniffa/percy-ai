"use client";

import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiFetch } from "@/lib/api";
import { useApi } from "@/lib/use-api";

export function DevCheck() {
    const { isSignedIn } = useAuth();
    const api = useApi();

    const health = useQuery({
        queryKey: ["health"],
        queryFn: () => apiFetch<{ status: string }>("/health"),
    });

    const me = useQuery({
        queryKey: ["me"],
        queryFn: () => api("/api/users/me"),
        enabled: !!isSignedIn,
    });

    return (
        <Card className="mx-auto max-w-xl">
            <CardHeader>
                <CardTitle className="text-red-700">Setup check (temporary)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
                <p>
                    Backend:{" "}
                    <strong>
                        {health.isLoading
                            ? "checking..."
                            : health.error
                                ? `error: ${health.error.message}`
                                : health.data?.status}
                    </strong>
                </p>
                {isSignedIn && (
                    <pre className="overflow-x-auto rounded bg-neutral-100 p-3 text-xs">
                        {me.isLoading
                            ? "loading..."
                            : JSON.stringify(me.data ?? me.error?.message, null, 2)}
                    </pre>
                )}
            </CardContent>
        </Card>
    );
}