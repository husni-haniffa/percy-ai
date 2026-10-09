"use client";

import Link from "next/link";
import { Container } from "@/components/layout/container";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getDisplayStatus } from "@/lib/listing-status";
import { useMyListings } from "@/lib/use-listings";
import { useMe } from "@/lib/use-me";
import { BackToDashboard } from "./create-listing";
import { ListingForm } from "./listing-form";


function Message({ title, text }: { title: string; text: string }) {
    return (
        <div className="rounded-xl border bg-white p-6">
            <p className="font-semibold">{title}</p>
            <p className="mt-1 text-sm text-neutral-600">{text}</p>
            <Link href="/dashboard" className={buttonVariants({ className: "mt-4" })}>
                Back to dashboard
            </Link>
        </div>
    );
}

export function EditListing({ id }: { id: string }) {
    const { data: me } = useMe();
    const { data: listings, isPending, error } = useMyListings();

    const listing = listings?.find((item) => item._id === id);

    const planExpired =
        me?.onboarded && me.subscription
            ? new Date(me.subscription.expiresAt) <= new Date()
            : false;

    return (
        <Container className="max-w-3xl py-10">
            <BackToDashboard />
            <h1 className="mb-8 text-3xl font-bold text-red-700 sm:text-4xl">Edit listing</h1>

            {isPending ? (
                <Skeleton className="h-96 w-full rounded-xl" />
            ) : error ? (
                <Message title="We couldn't load your listing" text={error.message} />
            ) : !listing ? (
                <Message
                    title="Listing not found"
                    text="It may have been deleted, or it isn't yours."
                />
            ) : getDisplayStatus(listing) === "expired" ? (
                <Message
                    title="This listing has expired"
                    text="Expired listings can't be edited."
                />
                        ) : getDisplayStatus(listing) === "removed" ? (
                            <Message
                                title="This listing was removed"
                                text="An admin removed this listing, so it can't be edited."
                            />
            ) : planExpired ? (
                <Message
                    title="Your plan has expired"
                    text="You can't edit listings while your plan is expired."
                />
            ) : (
                <ListingForm key={listing._id} mode="edit" listing={listing} />
            )}
        </Container>
    );
}