"use client";

import { Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function ShareButton() {
    async function copyLink() {
        try {
            await navigator.clipboard.writeText(window.location.href);
            toast.success("Link copied");
        } catch {
            toast.error("Could not copy the link");
        }
    }

    return (
        <Button variant="outline" size="sm" onClick={copyLink}>
            <Share2 className="size-4" /> Share
        </Button>
    );
}