"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { buttonVariants } from "@/components/ui/button";
import { useAdminPending } from "@/lib/use-admin";
import { cn } from "@/lib/utils";

export function AdminLink({ className }: { className?: string }) {
    const { sessionClaims } = useAuth();
    const isAdmin = sessionClaims?.metadata?.role === "admin";

    // The count is only fetched for the admin
    const { data } = useAdminPending(isAdmin);

    if (!isAdmin) return null;

    const count = data?.length ?? 0;

    return (
        <Link
            href="/admin"
            className={cn(
                buttonVariants({ variant: "outline" }),
                "border-red-700 text-red-700",
                className
            )}
        >
            Admin
            {count > 0 && (
                <span className="ml-2 rounded-full bg-red-700 px-1.5 py-0.5 text-xs font-semibold leading-none text-white">
                    {count}
                </span>
            )}
        </Link>
    );
}