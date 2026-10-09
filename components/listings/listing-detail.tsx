"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar, Flag, MapPin, SearchX, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/layout/container";
import { fetchListing } from "@/lib/browse-api";
import { capitalize, formatDate, formatNumber, formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Listing } from "@/types/listing";
import { ContactCard } from "./contact-card";
import { ImageGallery } from "./image-gallery";
import { ShareButton } from "./share-button";
import { site } from "@/lib/site";


type Row = { label: string; value: string };

export function getDetails(listing: Listing): Row[] {
    const common: Row[] = [
        { label: "Listing type", value: listing.purpose === "sale" ? "For sale" : "For rent" },
        { label: "City", value: listing.city },
    ];

    if (listing.category === "property") {
        const rows: Row[] = [{ label: "Property type", value: capitalize(listing.propertyType) }];
        if (listing.bedrooms !== undefined)
            rows.push({ label: "Bedrooms", value: String(listing.bedrooms) });
        if (listing.bathrooms !== undefined)
            rows.push({ label: "Bathrooms", value: String(listing.bathrooms) });
        if (listing.perches !== undefined)
            rows.push({ label: "Land size", value: `${listing.perches} perches` });
        return [...rows, ...common];
    }

    return [
        { label: "Vehicle type", value: capitalize(listing.vehicleType) },
        { label: "Brand", value: listing.brand },
        { label: "Model", value: listing.code },
        { label: "Year", value: String(listing.year) },
        { label: "Mileage", value: `${formatNumber(listing.mileage)} km` },
        { label: "Transmission", value: capitalize(listing.transmission) },
        { label: "Fuel", value: capitalize(listing.fuel) },
        ...common,
    ];
}

function DetailSkeleton() {
    return (
        <Container className="py-8">
            <Skeleton className="mb-6 h-5 w-40" />
            <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
                <div className="space-y-6">
                    <Skeleton className="aspect-[16/10] w-full rounded-xl" />
                    <Skeleton className="h-10 w-3/4" />
                    <Skeleton className="h-24 w-full" />
                </div>
                <Skeleton className="h-64 w-full rounded-xl" />
            </div>
        </Container>
    );
}

function NotAvailable() {
    return (
        <Container className="flex flex-col items-center py-24 text-center">
            <SearchX className="mb-4 size-12 text-neutral-300" />
            <h1 className="text-2xl font-bold text-red-700">This listing isn&apos;t available</h1>
            <p className="mt-2 max-w-sm text-neutral-600">
                It may have expired or been removed by its owner.
            </p>
            <Link href="/properties" className={cn(buttonVariants(), "mt-6")}>
                Browse listings
            </Link>
        </Container>
    );
}

export function ListingDetail({ id }: { id: string }) {
    const { data: listing, isLoading, error } = useQuery({
        queryKey: ["listing", id],
        queryFn: () => fetchListing(id),
        staleTime: Infinity, // every fetch counts as a view, so never refetch on its own
        refetchOnWindowFocus: false,
    });

    if (isLoading) return <DetailSkeleton />;
    if (error || !listing) return <NotAvailable />;

    const isProperty = listing.category === "property";

    return (
        <Container className="pb-28 pt-8 lg:pb-12">
            <Link
                href={isProperty ? "/properties" : "/vehicles"}
                className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 hover:text-red-700"
            >
                <ArrowLeft className="size-4" />
                Back to {isProperty ? "properties" : "vehicles"}
            </Link>

            <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
                <div className="space-y-8">
                    <ImageGallery images={listing.images} title={listing.title} />

                    <div>
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                            <Badge
                                className={cn(
                                    "text-white",
                                    listing.purpose === "sale" ? "bg-red-700" : "bg-black"
                                )}
                            >
                                {listing.purpose === "sale" ? "For sale" : "For rent"}
                            </Badge>
                            <Badge variant="outline">{isProperty ? "Property" : "Vehicle"}</Badge>
                        </div>
                        <h1 className="text-3xl font-bold text-red-700 sm:text-4xl">{listing.title}</h1>
                        <p className="mt-2 flex items-center gap-1.5 text-neutral-600">
                            <MapPin className="size-4" />
                            {listing.city}
                        </p>
                    </div>

                    <section>
                        <h2 className="mb-3 text-xl font-bold">Description</h2>
                        <p className="whitespace-pre-line leading-relaxed text-neutral-700">
                            {listing.description}
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-3 text-xl font-bold">Details</h2>
                        <dl className="rounded-xl border bg-white px-5">
                            {getDetails(listing).map((row) => (
                                <div
                                    key={row.label}
                                    className="flex justify-between gap-4 border-b py-2.5 text-sm last:border-0"
                                >
                                    <dt className="text-neutral-500">{row.label}</dt>
                                    <dd className="font-medium text-neutral-900">{row.value}</dd>
                                </div>
                            ))}
                        </dl>
                    </section>
                </div>

                <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
                    <div className="rounded-xl border bg-white p-5">
                        <p className="text-sm text-neutral-500">Price</p>
                        <p className="text-3xl font-bold text-red-700">{formatPrice(listing.price)}</p>
                        {listing.approvedAt && (
                            <p className="mt-2 flex items-center gap-1.5 text-xs text-neutral-500">
                                <Calendar className="size-3.5" />
                                Listed on {formatDate(listing.approvedAt)}
                            </p>
                        )}
                        <div className="mt-4">
                            <ShareButton />
                        </div>
                    </div>

                    <ContactCard listingId={listing._id} />

                    <div className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">
                        <ShieldAlert className="mt-0.5 size-4 shrink-0" />
                        <p>
                            Never pay in advance before seeing the property or vehicle in person.
                            Percy AI connects buyers and owners but is not part of any deal.
                        </p>
                    </div>
                    <a
                        href={`mailto:${site.contactEmail}?subject=${encodeURIComponent(
                            `Report listing: ${listing.title}`
                        )}&body=${encodeURIComponent(
                            `Listing link: ${window.location.origin}/listings/${listing._id}\n\nWhat is wrong with this listing?\n`
                        )}`}
                        className="flex items-center justify-center gap-1.5 text-xs text-neutral-500 hover:text-red-700"
                    >
                        <Flag className="size-3.5" /> Report this listing
                    </a>
                </aside>
            </div>

            {/* Phones only: always-visible price and contact shortcut */}
            <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between border-t bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
                <p className="text-lg font-bold text-red-700">{formatPrice(listing.price)}</p>
                <a href="#contact" className={buttonVariants()}>
                    Contact owner
                </a>
            </div>
        </Container>
    );
}