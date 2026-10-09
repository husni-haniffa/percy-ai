import { Eye, MessageSquare, Phone, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatNumber } from "@/lib/format";
import type { Listing } from "@/types/listing";

type StatKey = "views" | "contactInfoViews" | "inquiries";

const stats: { key: StatKey; label: string; hint: string; icon: LucideIcon }[] = [
    { key: "views", label: "Views", hint: "Times your listings were opened", icon: Eye },
    {
        key: "contactInfoViews",
        label: "Contact views",
        hint: "Times your contact details were revealed",
        icon: Phone,
    },
    {
        key: "inquiries",
        label: "Inquiries",
        hint: "People who tapped Call, WhatsApp or Email",
        icon: MessageSquare,
    },
];

export function StatsCards({ listings }: { listings: Listing[] }) {
    return (
        <div className="grid gap-4 sm:grid-cols-3">
            {stats.map(({ key, label, hint, icon: Icon }) => {
                const total = listings.reduce((sum, listing) => sum + (listing[key] ?? 0), 0);

                return (
                    <Card key={key}>
                        <CardContent className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-neutral-500">
                                <Icon className="size-4" />
                                {label}
                            </div>
                            <p className="text-3xl font-bold">{formatNumber(total)}</p>
                            <p className="text-xs text-neutral-500">{hint}</p>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}