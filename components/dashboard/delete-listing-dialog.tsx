"use client";

import { useAuth } from "@clerk/nextjs";
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
import { useApi } from "@/lib/use-api";
import type { Listing } from "@/types/listing";

export function DeleteListingDialog({
    listing,
    onClose,
}: {
    listing: Listing | null;
    onClose: () => void;
}) {
    const api = useApi();
    const queryClient = useQueryClient();
    const { userId } = useAuth();

    const remove = useMutation({
        mutationFn: (id: string) => api(`/api/listings/${id}`, { method: "DELETE" }),
        onSuccess: async () => {
            toast.success("Listing deleted");
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ["my-listings", userId] }),
                queryClient.invalidateQueries({ queryKey: ["can-create", userId] }),
                queryClient.invalidateQueries({ queryKey: ["browse"] }),
            ]);
            onClose();
        },
        onError: (error) => toast.error(error.message),
    });

    return (
        <Dialog
            open={!!listing}
            onOpenChange={(open) => {
                if (!open && !remove.isPending) onClose();
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete this listing?</DialogTitle>
                    <DialogDescription>
                        &ldquo;{listing?.title}&rdquo; will be removed and buyers will no longer see
                        it. This frees up one of your listing slots.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={remove.isPending}>
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        disabled={remove.isPending}
                        onClick={() => listing && remove.mutate(listing._id)}
                    >
                        {remove.isPending ? "Deleting..." : "Delete listing"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}