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
import { useApi } from "@/lib/use-api";

const presets = [
    "The photos are unclear or do not match the listing.",
    "Important details are missing or incorrect.",
    "The price looks wrong.",
    "This looks like a duplicate or suspicious listing.",
];

export function RejectDialog({
    listingId,
    title,
    open,
    onClose,
}: {
    listingId: string;
    title: string;
    open: boolean;
    onClose: () => void;
}) {
    const api = useApi();
    const queryClient = useQueryClient();
    const [reason, setReason] = useState("");
    const [showError, setShowError] = useState(false);

    const trimmed = reason.trim();
    const error = trimmed.length < 5 ? "Please explain why (at least 5 characters)" : undefined;

    const reject = useMutation({
        mutationFn: () =>
            api(`/api/admin/listings/${listingId}/reject`, {
                method: "POST",
                body: JSON.stringify({ reason: trimmed }),
            }),
        onSuccess: () => {
            toast.success("Listing rejected. The owner will see your reason.");
            setReason("");
            setShowError(false);
            onClose();
        },
        onError: (e) => toast.error(e.message),
        onSettled: () => queryClient.invalidateQueries({ queryKey: ["admin", "pending"] }),
    });

    function submit() {
        if (error) {
            setShowError(true);
            return;
        }
        reject.mutate();
    }

    return (
        <Dialog open={open} onOpenChange={(next) => !next && !reject.isPending && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Reject this listing?</DialogTitle>
                    <DialogDescription>
                        &ldquo;{title}&rdquo; stays hidden. The owner sees your reason and can edit
                        and resubmit.
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
                        placeholder="Reason for rejection"
                        value={reason}
                        onChange={(event) => setReason(event.target.value)}
                        aria-invalid={showError && !!error}
                    />
                    <div className="flex justify-between text-xs">
                        <span className="text-red-700">{showError ? error : ""}</span>
                        <span className="text-neutral-500">{reason.length}/500</span>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={reject.isPending}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={submit} disabled={reject.isPending}>
                        {reject.isPending ? "Rejecting..." : "Reject listing"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}