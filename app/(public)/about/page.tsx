import Link from "next/link";
import { Bot, Handshake, ShieldCheck, type LucideIcon } from "lucide-react";
import { Container } from "@/components/layout/container";
import { buttonVariants } from "@/components/ui/button";
import { site } from "@/lib/site";

export const metadata = { title: "About | Percy AI" };

const points: { icon: LucideIcon; title: string; text: string }[] = [
    {
        icon: Bot,
        title: "Search in your own words",
        text: "Instead of ticking filters one by one, describe what you want, like \u201C3 bedroom house near Negombo\u201D, and Percy finds the closest matches.",
    },
    {
        icon: Handshake,
        title: "Talk to owners directly",
        text: "You get the owner's contact details straight from the listing. No middleman, no commission.",
    },
    {
        icon: ShieldCheck,
        title: "Every listing is reviewed",
        text: "Nothing goes live until it has been checked, and we remove listings that are reported as scams.",
    },
];

export default function AboutPage() {
    return (
        <>
            <section className="border-b bg-gradient-to-b from-red-50 to-white">
                <Container className="max-w-3xl py-16 text-center sm:py-20">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-red-700">
                        About {site.name}
                    </p>
                    <h1 className="text-4xl font-bold tracking-tight text-red-700 sm:text-5xl">
                        A simpler way to find a home or a ride in Sri Lanka
                    </h1>
                    <p className="mt-5 text-lg text-neutral-600">
                        Buying or renting a property or a vehicle often means scrolling through
                        scattered posts and groups. {site.name} puts it all in one place, with
                        search that understands what you mean.
                    </p>
                </Container>
            </section>

            <Container className="max-w-5xl py-14">
                <div className="grid gap-6 md:grid-cols-3">
                    {points.map(({ icon: Icon, title, text }) => (
                        <div key={title} className="rounded-xl border bg-white p-6">
                            <Icon className="size-7 text-red-700" />
                            <h2 className="mt-4 text-lg font-bold">{title}</h2>
                            <p className="mt-1 text-sm text-neutral-600">{text}</p>
                        </div>
                    ))}
                </div>

                <div className="mx-auto mt-14 max-w-2xl space-y-4 text-neutral-700">
                    <h2 className="text-2xl font-bold text-red-700">Our promise</h2>
                    <p className="leading-relaxed">
                        {site.name} is free to use while we are starting out. We do not sell your
                        personal information, and we are clear about what is shown publicly: your
                        contact details appear only when someone taps to see them. We are a brand
                        new product, so we are still learning. If something is not right, tell us
                        and we will fix it.
                    </p>
                    <p className="leading-relaxed">
                        {site.name} is built and run by {site.operatorName} in {site.location}.
                    </p>
                </div>

                <div className="mt-10 flex flex-wrap justify-center gap-3">
                    <Link href="/properties" className={buttonVariants({ size: "lg" })}>
                        Browse properties
                    </Link>
                    <Link href="/vehicles" className={buttonVariants({ size: "lg", variant: "outline" })}>
                        Browse vehicles
                    </Link>
                    <Link href="/contact" className={buttonVariants({ size: "lg", variant: "outline" })}>
                        Contact us
                    </Link>
                </div>
            </Container>
        </>
    );
}