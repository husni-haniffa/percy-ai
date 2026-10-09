import Link from "next/link";
import { site } from "@/lib/site";
import { Container } from "./container";
import { Logo } from "./logo";

const columns = [
    {
        title: "Explore",
        links: [
            { href: "/properties", label: "Properties" },
            { href: "/vehicles", label: "Vehicles" },
            { href: "/dashboard", label: "Post a listing" },
        ],
    },
    {
        title: "Company",
        links: [
            { href: "/about", label: "About" },
            { href: "/contact", label: "Contact" },
        ],
    },
    {
        title: "Legal",
        links: [
            { href: "/privacy", label: "Privacy Policy" },
            { href: "/terms", label: "Terms of Service" },
        ],
    },
];

export function Footer() {
    return (
        <footer className="mt-20 border-t bg-neutral-950 text-neutral-300">
            <Container className="grid gap-10 py-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
                <div className="space-y-3">
                    <div className="inline-block rounded bg-white px-3 py-2">
                        <Logo />
                    </div>
                    <p className="max-w-xs text-sm text-neutral-400">
                        Properties and vehicles across Sri Lanka. Search in your own words and
                        contact owners directly.
                    </p>
                    <a
                        href={`mailto:${site.contactEmail}`}
                        className="text-sm text-red-400 hover:text-red-300"
                    >
                        {site.contactEmail}
                    </a>
                </div>

                {columns.map((column) => (
                    <div key={column.title} className="space-y-3">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                            {column.title}
                        </h3>
                        <ul className="space-y-2 text-sm">
                            {column.links.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="hover:text-white">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </Container>

            <div className="border-t border-neutral-800 py-4 text-center text-xs text-neutral-500">
                © {new Date().getFullYear()} {site.name}. Percy is not a party to any transaction
                between buyers and sellers.
            </div>
        </footer>
    );
}