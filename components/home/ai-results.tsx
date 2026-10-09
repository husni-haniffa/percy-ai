"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { SearchX } from "lucide-react";
import { Container } from "@/components/layout/container";
import { ListingGrid } from "@/components/listings/listing-grid";
import { buttonVariants } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import type { Listing } from "@/types/listing";

type AiSearchResponse = { query: string; items: Listing[] };

export function AiResults({ query }: { query: string }) {
    const { data, isLoading, error } = useQuery({
        queryKey: ["ai-search", query],
        queryFn: () =>
            apiFetch<AiSearchResponse>("/api/ai-search", {
                method: "POST",
                body: JSON.stringify({ query }),
            }),
        staleTime: 5 * 60 * 1000, // pressing Back must not spend another search
    });

    const nothingFound = data && data.items.length === 0;

    return (
        <section className="py-10">
            <Container>
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-red-700 sm:text-3xl">
                        {isLoading ? "Percy is searching..." : `Best matches for \u201C${query}\u201D`}
                    </h2>
                    {data && !nothingFound && (
                        <p className="mt-1 text-sm text-neutral-600">
                            The match score shows how closely each listing fits your description.
                        </p>
                    )}
                </div>

                {nothingFound ? (
                    <div className="flex flex-col items-center rounded-xl border border-dashed py-16 text-center">
                        <SearchX className="mb-3 size-10 text-neutral-300" />
                        <p className="font-semibold text-neutral-900">No close matches found</p>
                        <p className="mt-1 max-w-sm text-sm text-neutral-500">
                            Try describing it differently, for example with a city, a type, or a
                            budget. Or browse everything.
                        </p>
                        <div className="mt-5 flex gap-3">
                            <Link href="/properties" className={buttonVariants({ variant: "outline" })}>
                                Browse properties
                            </Link>
                            <Link href="/vehicles" className={buttonVariants({ variant: "outline" })}>
                                Browse vehicles
                            </Link>
                        </div>
                    </div>
                ) : (
                    <ListingGrid
                        items={data?.items}
                        isLoading={isLoading}
                        error={error}
                        className="lg:grid-cols-3"
                    />
                )}
            </Container>
        </section>
    );
}