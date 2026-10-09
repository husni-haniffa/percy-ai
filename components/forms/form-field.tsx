import { Label } from "@/components/ui/label";

export function getErrorMessage(errors: unknown[]) {
    const first = errors[0];
    if (!first) return undefined;

    const raw =
        typeof first === "string" ? first : (first as { message?: string }).message;
    if (!raw) return undefined;

    const text = raw.replace(/\s*\(was .*\)$/, "");
    return text.charAt(0).toUpperCase() + text.slice(1);
}

export function FormField({
    label,
    htmlFor,
    hint,
    error,
    children,
}: {
    label: string;
    htmlFor: string;
    hint?: string;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-1.5">
            <Label htmlFor={htmlFor}>{label}</Label>
            {children}
            {error ? (
                <p className="text-sm text-red-700">{error}</p>
            ) : hint ? (
                <p className="text-xs text-neutral-500">{hint}</p>
            ) : null}
        </div>
    );
}