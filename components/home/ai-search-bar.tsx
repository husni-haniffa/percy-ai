"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const examples = [
    "3 bedroom house near Negombo",
    "Hybrid car under 7 million",
    "Land by the sea for a guest house",
    "Apartment for rent in Colombo",
];

export function AiSearchBar({ initial }: { initial: string }) {
    const router = useRouter();
    const [value, setValue] = useState(initial);
    const [error, setError] = useState("");

    function search(text: string) {
        const query = text.trim();
        if (query.length < 3) {
            setError("Describe what you are looking for (at least 3 characters)");
            return;
        }
        setError("");
        setValue(query);
        router.push(`/?q=${encodeURIComponent(query)}`);
    }

    function clear() {
        setValue("");
        setError("");
        router.push("/");
    }

    return (
        <div className="mx-auto max-w-2xl">
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    search(value);
                }}
                className="flex items-center gap-2 rounded-full border bg-white p-2 pl-5 shadow-lg focus-within:border-red-700 focus-within:ring-4 focus-within:ring-red-700/10"
            >
                <Sparkles className="size-5 shrink-0 text-red-700" />

                <Input
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                    maxLength={300}
                    placeholder='Try "3 bedroom house near Negombo"'
                    aria-label="Search listings with AI"
                    className="h-11 flex-1 border-0 bg-transparent px-1 text-base shadow-none focus-visible:ring-0"
                />

                {value && (
                    <button
                        type="button"
                        onClick={clear}
                        aria-label="Clear search"
                        className="rounded-full p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                    >
                        <X className="size-4" />
                    </button>
                )}

                <Button type="submit" size="lg" className="rounded-full">
                    <Search className="size-4" />
                    <span className="hidden sm:inline">Search</span>
                </Button>
            </form>

            {error && <p className="mt-2 text-sm text-red-700">{error}</p>}

            {!initial && (
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {examples.map((example) => (
                        <button
                            key={example}
                            type="button"
                            onClick={() => search(example)}
                            className="rounded-full border bg-white px-3 py-1.5 text-xs text-neutral-700 transition hover:border-red-700 hover:text-red-700"
                        >
                            {example}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}