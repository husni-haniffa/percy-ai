import { Container } from "@/components/layout/container";

const steps = [
    {
        title: "Search or filter",
        text: "Describe what you want in your own words, or narrow down by price, location and type.",
    },
    {
        title: "Contact the owner",
        text: "Get the phone number straight from the listing. No middleman.",
    },
    {
        title: "Post for free",
        text: "Sign up and list your property or vehicle at no cost.",
    },
];

export function HowItWorks() {
    return (
        <section className="mt-8 border-t bg-neutral-50 py-16">
            <Container>
                <h2 className="mb-10 text-center text-2xl font-bold text-red-700 sm:text-3xl">
                    How Percy works
                </h2>
                <div className="grid gap-6 md:grid-cols-3">
                    {steps.map((step, index) => (
                        <div key={step.title} className="rounded-xl border bg-white p-6">
                            <span className="font-heading text-4xl font-bold text-red-700">
                                {index + 1}
                            </span>
                            <h3 className="mt-3 text-lg font-semibold">{step.title}</h3>
                            <p className="mt-1 text-sm text-neutral-600">{step.text}</p>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}