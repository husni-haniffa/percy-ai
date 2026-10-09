"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/layout/container";
import { DeleteListingDialog } from "@/components/dashboard/delete-listing-dialog";
import { MyListingRow } from "@/components/dashboard/my-listing-row";
import { PlanBanner } from "@/components/dashboard/plan-banner";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { useCanCreate, useMyListings } from "@/lib/use-listings";
import { useMe } from "@/lib/use-me";
import type { Listing } from "@/types/listing";
import { StatusTabs } from "@/components/shared/status-tabs";
import { getDisplayStatus, type DisplayStatus } from "@/lib/listing-status";

function CreateListingButton() {
    const { data } = useCanCreate();

    if (data?.canCreate) {
        return (
            <Link href="/dashboard/listings/new" className={buttonVariants({ size: "lg" })}>
                <Plus className="size-4" /> Create listing
            </Link>
        );
    }

    return (
        <Button size="lg" disabled>
            <Plus className="size-4" /> Create listing
        </Button>
    );
}

export default function DashboardPage() {
    const { data: me } = useMe();
    const listingsQuery = useMyListings();
    const [toDelete, setToDelete] = useState<Listing | null>(null);
    const [filter, setFilter] = useState<DisplayStatus | "all">("all");
    if (!me?.onboarded) return null; // the gate handles every other case
    

    const planExpired = me.subscription
        ? new Date(me.subscription.expiresAt) <= new Date()
        : true;

    const listings = listingsQuery.data ?? [];

    const countOf = (status: DisplayStatus) =>
        listings.filter((listing) => getDisplayStatus(listing) === status).length;

    const tabs = [
        { value: "all" as const, label: "All", count: listings.length },
        { value: "live" as const, label: "Live", count: countOf("live") },
        { value: "pending" as const, label: "Pending", count: countOf("pending") },
        { value: "rejected" as const, label: "Rejected", count: countOf("rejected") },
        { value: "expired" as const, label: "Expired", count: countOf("expired") },
        { value: "removed" as const, label: "Removed", count: countOf("removed") },
    ];

    const visible =
        filter === "all"
            ? listings
            : listings.filter((listing) => getDisplayStatus(listing) === filter);

    return (
        <Container className="space-y-8 py-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-red-700 sm:text-4xl">
                        Welcome, {me.user.name.split(" ")[0]}
                    </h1>
                    <p className="mt-1 text-neutral-600">Manage your listings and see how they perform.</p>
                </div>
                <CreateListingButton />
            </div>

            <PlanBanner />

            {listings.length > 0 && <StatsCards listings={listings} />}

            <section>
                <h2 className="mb-4 text-2xl font-bold">Your listings</h2>

                {listingsQuery.isPending ? (
                    <div className="space-y-4">
                        <Skeleton className="h-44 w-full rounded-xl" />
                        <Skeleton className="h-44 w-full rounded-xl" />
                    </div>
                ) : listingsQuery.error ? (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-800">
                        <p>{listingsQuery.error.message}</p>
                        <Button className="mt-4" onClick={() => listingsQuery.refetch()}>
                            Try again
                        </Button>
                    </div>
                ) : listings.length === 0 ? (
                    <div className="flex flex-col items-center rounded-xl border border-dashed bg-white py-16 text-center">
                        <p className="font-semibold text-neutral-900">You haven&apos;t posted anything yet</p>
                        <p className="mt-1 mb-5 text-sm text-neutral-500">
                            Your first listing is free. An admin reviews it before it goes live.
                        </p>
                        <CreateListingButton />
                    </div>
                ) : (
                                <div className="space-y-4">
                                    <StatusTabs options={tabs} value={filter} onChange={setFilter} />

                                    {visible.length === 0 ? (
                                        <div className="rounded-xl border border-dashed bg-white py-12 text-center text-sm text-neutral-500">
                                            No {filter} listings.{" "}
                                            <button
                                                className="font-medium text-red-700 hover:underline"
                                                onClick={() => setFilter("all")}
                                            >
                                                Show all
                                            </button>
                                        </div>
                                    ) : (
                                        visible.map((listing) => (
                                            <MyListingRow
                                                key={listing._id}
                                                listing={listing}
                                                planExpired={planExpired}
                                                onDelete={setToDelete}
                                            />
                                        ))
                                    )}
                                </div>
                )}
            </section>

            <DeleteListingDialog listing={toDelete} onClose={() => setToDelete(null)} />
        </Container>
    );
}