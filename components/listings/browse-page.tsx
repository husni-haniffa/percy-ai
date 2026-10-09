"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { Pagination } from "@/components/shared/pagination";
import { buildQuery, type Filters } from "@/lib/browse-api";
import { cn } from "@/lib/utils";
import type { Listing, Paginated } from "@/types/listing";
import { FilterForm, type FilterField } from "./filter-form";
import { ListingGrid } from "./listing-grid";


// On phones the filters hide behind a button so results come first
function FilterPanel({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);

    return (
        <div>
            <Button
                variant="outline"
                className="mb-3 w-full lg:hidden"
                onClick={() => setOpen(!open)}
            >
                <SlidersHorizontal className="size-4" />
                {open ? "Hide filters" : "Show filters"}
            </Button>

            <div
                className={cn(
                    "rounded-xl border bg-white p-5 lg:sticky lg:top-24 lg:block",
                    open ? "block" : "hidden"
                )}
            >
                {children}
            </div>
        </div>
    );
}

type Props = {
    title: string;
    subtitle: string;
    queryKey: "properties" | "vehicles";
    fields: FilterField[];
    fetcher: (filters: Filters) => Promise<Paginated<Listing>>;
};

export function BrowsePage({ title, subtitle, queryKey, fields, fetcher }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // The URL is the single source of truth for filters
    const filters = Object.fromEntries(searchParams.entries());

    const { data, isLoading, isFetching, error } = useQuery({
        queryKey: ["browse", queryKey, filters],
        queryFn: () => fetcher({ ...filters, limit: "12" }),
        placeholderData: keepPreviousData, // keep old results visible while loading new ones
    });

    function goTo(next: Filters) {
        const query = buildQuery(next);
        router.push(query ? `${pathname}?${query}` : pathname);
    }

    return (
        <Container className="py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-red-700 sm:text-4xl">{title}</h1>
                <p className="mt-2 text-neutral-600">{subtitle}</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
                <FilterPanel>
                    <FilterForm
                        key={searchParams.toString()}
                        fields={fields}
                        values={filters}
                        onApply={(values) => goTo({ ...values, page: undefined })}
                        onReset={() => goTo({})}
                    />
                </FilterPanel>

                <section>
                    <p className="mb-4 min-h-5 text-sm text-neutral-600">
                        {data && `${data.total} ${data.total === 1 ? "listing" : "listings"} found`}
                    </p>

                    <div className={cn(isFetching && !isLoading && "opacity-60 transition-opacity")}>
                        <ListingGrid items={data?.items} isLoading={isLoading} error={error} />
                    </div>

                    {data && (
                        <Pagination
                            page={data.page}
                            totalPages={data.totalPages}
                            onChange={(page) => {
                                goTo({ ...filters, page: String(page) });
                                window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                        />
                    )}
                </section>
            </div>
        </Container>
    );
}