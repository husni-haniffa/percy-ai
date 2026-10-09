import { Flag, Mail, ShieldCheck, type LucideIcon } from "lucide-react";
import { Container } from "@/components/layout/container";
import { buttonVariants } from "@/components/ui/button";
import { site } from "@/lib/site";

export const metadata = { title: "Contact | Percy AI" };

const topics: {
    icon: LucideIcon;
    title: string;
    text: string;
    subject: string;
    action: string;
}[] = [
        {
            icon: Mail,
            title: "General questions",
            text: "Ask us anything about using Percy, your account, or how listings work.",
            subject: "Question about Percy AI",
            action: "Email us",
        },
        {
            icon: Flag,
            title: "Report a listing",
            text: "Seen a scam, fake photos or something against the rules? Tell us which listing (a link helps) and what is wrong.",
            subject: "Report a listing",
            action: "Report a listing",
        },
        {
            icon: ShieldCheck,
            title: "Privacy requests",
            text: "Ask to see, correct or delete the information we hold about you.",
            subject: "Privacy request",
            action: "Make a request",
        },
    ];

export default function ContactPage() {
    return (
        <Container className="max-w-4xl py-12">
            <h1 className="text-3xl font-bold text-red-700 sm:text-4xl">Contact us</h1>
            <p className="mt-3 max-w-xl text-neutral-600">
                We are a small team and read every message. Email us at{" "}
                <a href={`mailto:${site.contactEmail}`} className="font-medium text-red-700 underline">
                    {site.contactEmail}
                </a>{" "}
                and we usually reply within {site.replyTime}.
            </p>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
                {topics.map(({ icon: Icon, title, text, subject, action }) => (
                    <div key={title} className="flex flex-col rounded-xl border bg-white p-6">
                        <Icon className="size-7 text-red-700" />
                        <h2 className="mt-4 text-lg font-bold">{title}</h2>
                        <p className="mt-1 flex-1 text-sm text-neutral-600">{text}</p>
                        <a
                            href={`mailto:${site.contactEmail}?subject=${encodeURIComponent(subject)}`}
                            className={buttonVariants({ variant: "outline", className: "mt-5" })}
                        >
                            {action}
                        </a>
                    </div>
                ))}
            </div>
        </Container>
    );
}