"use client";

import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { daysLeft, formatDate } from "@/lib/format";
import { useCanCreate } from "@/lib/use-listings";
import { useMe } from "@/lib/use-me";
import { cn } from "@/lib/utils";

export function PlanBanner() {
    const { data: me } = useMe();
    const { data: limits } = useCanCreate();

    if (!me?.onboarded || !me.subscription) return null;

    const { plan, expiresAt } = me.subscription;
    const expired = new Date(expiresAt) <= new Date();

    const used = limits?.used ?? 0;
    const max = limits?.maxListings ?? plan.maxListings;
    const percent = Math.min(100, (used / max) * 100);

    return (
        <Card>
            <CardContent className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold">{plan.name} plan</span>
                        <Badge
                            className={cn(
                                expired ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                            )}
                        >
                            {expired ? "Expired" : "Active"}
                        </Badge>
                    </div>
                    <p className="text-sm text-neutral-600">
                        {expired
                            ? `Expired on ${formatDate(expiresAt)}`
                            : `Active until ${formatDate(expiresAt)} (${daysLeft(expiresAt)} days left)`}
                    </p>
                </div>

                <div>
                    <div className="mb-1.5 flex justify-between text-sm">
                        <span>Listings used</span>
                        <span className="font-medium">
                            {used} of {max}
                        </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-neutral-200">
                        <div
                            className="h-full rounded-full bg-red-700 transition-all"
                            style={{ width: `${percent}%` }}
                        />
                    </div>
                </div>

                {limits && !limits.canCreate && limits.reason && (
                    <div className="flex gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-900">
                        <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                        <p>
                            {limits.reason}.{" "}
                            {expired
                                ? "You can still sign in and see your listings, but you can't create or edit them."
                                : "Delete a listing to free up a slot."}
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}