"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

const links = [
    { href: "/admin", label: "Review queue" },
    { href: "/admin/listings", label: "All listings" },
    { href: "/admin/plans", label: "Plans" },
];

export function AdminNav() {
    const pathname = usePathname();

    return (
        <div className="border-b bg-white">
            <Container>
                <nav className="flex gap-6">
                    {links.map((link) => {
                        const active =
                            link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "border-b-2 py-3 text-sm font-medium transition-colors",
                                    active
                                        ? "border-red-700 text-red-700"
                                        : "border-transparent text-neutral-600 hover:text-neutral-900"
                                )}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>
            </Container>
        </div>
    );
}