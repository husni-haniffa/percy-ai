import Link from "next/link";
import {
    Bath,
    BedDouble,
    Building2,
    Calendar,
    Cog,
    Fuel,
    Gauge,
    ImageOff,
    MapPin,
    Ruler,
    Sparkles,
    type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { capitalize, formatNumber, formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Listing } from "@/types/listing";

function Meta({ icon: Icon, children }: { icon: LucideIcon; children: React.ReactNode }) {
    return (
        <span className="flex items-center gap-1.5">
            <Icon className="size-4 text-neutral-400" />
            {children}
        </span>
    );
}

function ListingMeta({ listing }: { listing: Listing }) {
    return (
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 border-t pt-3 text-sm text-neutral-600">
            {listing.category === "property" ? (
                <>
                    <Meta icon={Building2}>{capitalize(listing.propertyType)}</Meta>
                    {listing.bedrooms !== undefined && (
                        <Meta icon={BedDouble}>{listing.bedrooms} bed</Meta>
                    )}
                    {listing.bathrooms !== undefined && (
                        <Meta icon={Bath}>{listing.bathrooms} bath</Meta>
                    )}
                    {listing.perches !== undefined && (
                        <Meta icon={Ruler}>{listing.perches} perches</Meta>
                    )}
                </>
            ) : (
                <>
                    <Meta icon={Calendar}>{listing.year}</Meta>
                    <Meta icon={Gauge}>{formatNumber(listing.mileage)} km</Meta>
                    <Meta icon={Fuel}>{capitalize(listing.fuel)}</Meta>
                    <Meta icon={Cog}>{capitalize(listing.transmission)}</Meta>
                </>
            )}
        </div>
    );
}

export function ListingCard({ listing }: { listing: Listing }) {
    const image = listing.images[0];

    return (
        <Link
            href={`/listings/${listing._id}`}
            className="group block overflow-hidden rounded-xl border bg-white transition duration-200 hover:-translate-y-0.5 hover:shadow-lg"
        >
            <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                {image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={image}
                        alt={listing.title}
                        loading="lazy"
                        className="size-full object-cover transition duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex size-full items-center justify-center text-neutral-300">
                        <ImageOff className="size-10" />
                    </div>
                )}
                <Badge
                    className={cn(
                        "absolute left-3 top-3 text-white",
                        listing.purpose === "sale" ? "bg-red-700" : "bg-black"
                    )}
                >
                    {listing.purpose === "sale" ? "For sale" : "For rent"}
                </Badge>
                {listing.matchScore !== undefined && (
                    <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/80 px-2.5 py-1 text-xs font-semibold text-white">
                        <Sparkles className="size-3 text-red-400" />
                        {listing.matchScore}% match
                    </span>
                )}
            </div>

            <div className="space-y-2 p-4">
                <p className="text-xl font-bold text-red-700">{formatPrice(listing.price)}</p>
                <h3 className="line-clamp-1 text-base font-semibold text-neutral-900">
                    {listing.title}
                </h3>
                <p className="flex items-center gap-1 text-sm text-neutral-500">
                    <MapPin className="size-3.5" />
                    {listing.city}
                </p>
                <ListingMeta listing={listing} />
            </div>
        </Link>
    );
}