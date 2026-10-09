"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/layout/container";
import { useMe } from "@/lib/use-me";

function GateSkeleton() {
    return (
        <Container className="space-y-6 py-10">
            <Skeleton className="h-10 w-72" />
            <Skeleton className="h-32 w-full max-w-md rounded-xl" />
        </Container>
    );
}

export function OnboardingGate({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { data, isPending, error, refetch } = useMe();

    const needsOnboarding = data?.onboarded === false;

    useEffect(() => {
        if (needsOnboarding) router.replace("/onboarding");
    }, [needsOnboarding, router]);

    if (error) {
        return (
            <Container className="py-24 text-center">
                <p className="font-semibold text-neutral-900">We couldn&apos;t load your account</p>
                <p className="mt-1 text-sm text-neutral-600">{error.message}</p>
                <Button className="mt-5" onClick={() => refetch()}>
                    Try again
                </Button>
            </Container>
        );
    }

    if (isPending || needsOnboarding) return <GateSkeleton />;

    return <>{children}</>;
}