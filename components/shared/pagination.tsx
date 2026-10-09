import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Pagination({
    page,
    totalPages,
    onChange,
}: {
    page: number;
    totalPages: number;
    onChange: (page: number) => void;
}) {
    if (totalPages <= 1) return null;

    return (
        <div className="mt-10 flex items-center justify-center gap-4">
            <Button variant="outline" disabled={page <= 1} onClick={() => onChange(page - 1)}>
                <ChevronLeft className="size-4" /> Previous
            </Button>
            <span className="text-sm text-neutral-600">
                Page {page} of {totalPages}
            </span>
            <Button
                variant="outline"
                disabled={page >= totalPages}
                onClick={() => onChange(page + 1)}
            >
                Next <ChevronRight className="size-4" />
            </Button>
        </div>
    );
}