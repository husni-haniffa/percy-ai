"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { refreshAfterAdminChange, type PendingListing } from "@/lib/use-admin";
import { useApi } from "@/lib/use-api";

const presets = [
    "Reported as a scam or fraud.",
    "Contains prohibited or inappropriate content.",
    "Duplicate of another listing.",
    "Removed at the owner's request.",
];

export function RemoveDialog({
    listing,
    onClose,
}: {
    listing: PendingListing | null;
    onClose: () => void;
}) {
    const api = useApi();
    const queryClient = useQueryClient();
    const [reason, setReason] = useState("");
    const [showError, setShowError] = useState(false);

    const trimmed = reason.trim();
    const tooShort = trimmed.length < 5;

    const remove = useMutation({
        mutationFn: () =>
            api(`/api/admin/listings/${listing?._id}/remove`, {
                method: "POST",
                body: JSON.stringify({ reason: trimmed }),
            }),
        onSuccess: async () => {
            toast.success("Listing removed. The owner will see your reason.");
            setReason("");
            setShowError(false);
            await refreshAfterAdminChange(queryClient);
            onClose();
        },
        onError: (error) => toast.error(error.message),
    });

    function submit() {
        if (tooShort) {
            setShowError(true);
            return;
        }
        remove.mutate();
    }

    return (
        <Dialog open={!!listing} onOpenChange={(open) => !open && !remove.isPending && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Remove this listing?</DialogTitle>
                    <DialogDescription>
                        &ldquo;{listing?.title}&rdquo; disappears from the site and from AI search
                        straight away. The owner sees your reason. You can restore it later.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                        {presets.map((preset) => (
                            <button
                                key={preset}
                                type="button"
                                onClick={() => setReason(preset)}
                                className="rounded-full border px-3 py-1 text-xs text-neutral-700 transition hover:border-red-700 hover:text-red-700"
                            >
                                {preset}
                            </button>
                        ))}
                    </div>

                    <Textarea
                        rows={4}
                        maxLength={500}
                        placeholder="Reason for removal"
                        value={reason}
                        onChange={(event) => setReason(event.target.value)}
                        aria-invalid={showError && tooShort}
                    />
                    <p className="min-h-4 text-xs text-red-700">
                        {showError && tooShort ? "Please explain why (at least 5 characters)" : ""}
                    </p>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={remove.isPending}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={submit} disabled={remove.isPending}>
                        {remove.isPending ? "Removing..." : "Remove listing"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}