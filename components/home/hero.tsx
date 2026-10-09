import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";
import { AiSearchBar } from "./ai-search-bar";

// Save hero-bg-wide.png as /public/images/hero-bg-wide.png
const HERO_BG = "/hero-bg-wide.png";

export function Hero({ query }: { query: string }) {
    const searching = query.length > 0;

    return (
        <section className="relative isolate overflow-hidden border-b border-red-950 bg-black">
            {/* Wide 3:1 version of the artwork: fills the hero with no stretching.
                Only a sliver of the empty centre/edges is lost on very wide or narrow screens. */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${HERO_BG})` }}
            />
            {/* Soft red glow behind the content */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-72 w-[42rem] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/10 blur-3xl"
            />

            <Container className={cn("text-center", searching ? "py-8" : "py-20 sm:py-28")}>
                {searching ? (
                    <h1 className="sr-only">Find your next home or ride</h1>
                ) : (
                    <>
                        <p className="mb-4 text-sm font-medium tracking-wide text-red-400">
                            Properties and vehicles in Sri Lanka
                        </p>
                        <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-white drop-shadow-[0_0_24px_rgba(239,68,68,0.35)] sm:text-6xl">
                            Find your next home or ride
                        </h1>
                        <p className="mx-auto mt-5 max-w-xl text-lg text-neutral-300">
                            Just describe what you want in your own words, and Percy finds the best
                            matches.
                        </p>
                    </>
                )}

                <div className={cn(!searching && "mt-9")}>
                    {/* key: the box resets itself when the URL changes, for example with the Back button */}
                    <AiSearchBar key={query} initial={query} />
                </div>

                {!searching && (
                    <div className="mt-8 flex flex-wrap justify-center gap-3">
                        <Link
                            href="/properties"
                            className={cn(
                                buttonVariants({ variant: "outline" }),
                                "border-red-500/60 bg-black/40 text-white backdrop-blur-sm hover:border-red-400 hover:bg-red-600/20 hover:text-white focus-visible:ring-red-400"
                            )}
                        >
                            Browse properties
                        </Link>
                        <Link
                            href="/vehicles"
                            className={cn(
                                buttonVariants({ variant: "outline" }),
                                "border-red-500/60 bg-black/40 text-white backdrop-blur-sm hover:border-red-400 hover:bg-red-600/20 hover:text-white focus-visible:ring-red-400"
                            )}
                        >
                            Browse vehicles
                        </Link>
                    </div>
                )}
            </Container>
        </section>
    );
}