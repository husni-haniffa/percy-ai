import { Container } from "@/components/layout/container";
import { site } from "@/lib/site";

export function LegalPage({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <Container className="max-w-3xl py-12">
            <h1 className="text-3xl font-bold text-red-700 sm:text-4xl">{title}</h1>
            <p className="mt-2 text-sm text-neutral-500">Last updated: {site.lastUpdated}</p>
            <div className="mt-8 space-y-8">{children}</div>
        </Container>
    );
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="space-y-3">
            <h2 className="text-xl font-bold">{title}</h2>
            {children}
        </section>
    );
}

export function P({ children }: { children: React.ReactNode }) {
    return <p className="leading-relaxed text-neutral-700">{children}</p>;
}

export function List({ items }: { items: React.ReactNode[] }) {
    return (
        <ul className="list-disc space-y-1.5 pl-6 leading-relaxed text-neutral-700">
            {items.map((item, index) => (
                <li key={index}>{item}</li>
            ))}
        </ul>
    );
}