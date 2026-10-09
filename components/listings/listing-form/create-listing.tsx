"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/layout/container";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCanCreate } from "@/lib/use-listings";
import { ListingForm } from "./listing-form";


export function BackToDashboard() {
    return (
        <Link
            href="/dashboard"
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 hover:text-red-700"
        >
            <ArrowLeft className="size-4" /> Back to dashboard
        </Link>
    );
}

export function CreateListing() {
    const { data: limits, isPending } = useCanCreate();

    return (
        <Container className="max-w-3xl py-10">
            <BackToDashboard />
            <h1 className="mb-8 text-3xl font-bold text-red-700 sm:text-4xl">Create a listing</h1>

            {isPending ? (
                <Skeleton className="h-96 w-full rounded-xl" />
            ) : limits && !limits.canCreate ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-900">
                    <p className="font-semibold">You can&apos;t create a listing right now</p>
                    <p className="mt-1 text-sm">{limits.reason}.</p>
                    <Link href="/dashboard" className={buttonVariants({ className: "mt-4" })}>
                        Back to dashboard
                    </Link>
                </div>
            ) : (
                <ListingForm mode="create" />
            )}
        </Container>
    );
}