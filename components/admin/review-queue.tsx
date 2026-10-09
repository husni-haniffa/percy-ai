"use client";

import { CheckCircle2, RefreshCw } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminPending } from "@/lib/use-admin";
import { cn } from "@/lib/utils";
import { ReviewCard } from "./review-card";

export function ReviewQueue() {
    const { data, isPending, error, refetch, isFetching } = useAdminPending();

    return (
        <Container className="space-y-6 py-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-red-700 sm:text-4xl">Review queue</h1>
                    <p className="mt-1 text-neutral-600">
                        {data
                            ? `${data.length} listing${data.length === 1 ? "" : "s"} waiting, oldest first`
                            : "Checking for new listings..."}
                    </p>
                </div>
                <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
                    <RefreshCw className={cn("size-4", isFetching && "animate-spin")} /> Refresh
                </Button>
            </div>

            {isPending ? (
                <div className="space-y-6">
                    <Skeleton className="h-96 w-full rounded-xl" />
                    <Skeleton className="h-96 w-full rounded-xl" />
                </div>
            ) : error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-800">
                    <p>{error.message}</p>
                    <Button className="mt-4" onClick={() => refetch()}>
                        Try again
                    </Button>
                </div>
            ) : data.length === 0 ? (
                <div className="flex flex-col items-center rounded-xl border border-dashed bg-white py-20 text-center">
                    <CheckCircle2 className="mb-3 size-12 text-green-600" />
                    <p className="text-lg font-semibold">All caught up</p>
                    <p className="mt-1 text-sm text-neutral-500">No listings are waiting for review.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {data.map((listing) => (
                        <ReviewCard key={listing._id} listing={listing} />
                    ))}
                </div>
            )}
        </Container>
    );
}