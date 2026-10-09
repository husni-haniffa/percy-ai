"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { fetchProperties, fetchVehicles, type Filters } from "@/lib/browse-api";
import type { Listing, Paginated } from "@/types/listing";
import { ListingGrid } from "./listing-grid";

const config: Record<
    "properties" | "vehicles",
    {
        title: string;
        href: string;
        fetcher: (filters: Filters) => Promise<Paginated<Listing>>;
    }
> = {
    properties: { title: "Latest properties", href: "/properties", fetcher: fetchProperties },
    vehicles: { title: "Latest vehicles", href: "/vehicles", fetcher: fetchVehicles },
};

export function LatestListings({ category }: { category: "properties" | "vehicles" }) {
    const { title, href, fetcher } = config[category];

    const { data, isLoading, error } = useQuery({
        queryKey: ["browse", category, { limit: "4" }],
        queryFn: () => fetcher({ limit: "4" }),
    });

    return (
        <section className="py-12">
            <Container>
                <div className="mb-6 flex items-end justify-between">
                    <h2 className="text-2xl font-bold text-red-700 sm:text-3xl">{title}</h2>
                    <Link
                        href={href}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-neutral-900 hover:text-red-700"
                    >
                        Explore more <ArrowRight className="size-4" />
                    </Link>
                </div>

                <ListingGrid
                    items={data?.items}
                    isLoading={isLoading}
                    error={error}
                    skeletonCount={4}
                    className="lg:grid-cols-4"
                />
            </Container>
        </section>
    );
}