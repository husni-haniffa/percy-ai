import Link from "next/link";

export function Logo() {
    return (
        <Link href="/" className="flex items-center gap-1.5">
            <span className="font-heading text-2xl font-bold tracking-tight text-red-700">
                Percy
            </span>
            <span className="rounded bg-black px-1.5 py-0.5 text-xs font-semibold text-white">
                AI
            </span>
        </Link>
    );
}