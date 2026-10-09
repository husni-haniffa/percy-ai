"use client";

import { useSearchParams } from "next/navigation";
import { LatestListings } from "@/components/listings/latest-listings";
import { AiResults } from "./ai-results";
import { Hero } from "./hero";
import { HowItWorks } from "./how-it-works";

export function HomePage() {
    const searchParams = useSearchParams();
    const query = (searchParams.get("q") ?? "").trim();

    return (
        <>
            <Hero query={query} />

            {query ? (
                <AiResults query={query} />
            ) : (
                <>
                    <LatestListings category="properties" />
                    <LatestListings category="vehicles" />
                    <HowItWorks />
                </>
            )}
        </>
    );
}