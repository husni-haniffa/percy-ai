"use client";

import { useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { revealContact, sendInquiry } from "@/lib/browse-api";
import { cn } from "@/lib/utils";

export function ContactCard({ listingId }: { listingId: string }) {
    const inquirySent = useRef(false);

    const contact = useMutation({ mutationFn: () => revealContact(listingId) });

    // The first Call / WhatsApp / Email click counts as one inquiry
    function recordInquiry() {
        if (inquirySent.current) return;
        inquirySent.current = true;
        sendInquiry(listingId).catch(() => { }); // a failed count should never bother the visitor
    }

    const info = contact.data;
    const whatsappNumber = info?.phone.replace(/\D/g, "");

    return (
        <Card id="contact" className="scroll-mt-24">
            <CardHeader>
                <CardTitle className="text-lg">Contact the owner</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {!info ? (
                    <>
                        <Button
                            size="lg"
                            className="w-full"
                            disabled={contact.isPending}
                            onClick={() => contact.mutate()}
                        >
                            <Phone className="size-4" />
                            {contact.isPending ? "Loading..." : "Show contact details"}
                        </Button>
                        {contact.error && (
                            <p className="text-sm text-red-700">{contact.error.message}</p>
                        )}
                    </>
                ) : (
                    <>
                        <div>
                            <p className="font-semibold text-neutral-900">{info.name}</p>
                            <p className="text-2xl font-bold tracking-tight">{info.phone}</p>
                            <p className="text-sm text-neutral-500">{info.email}</p>
                        </div>

                        <div className="grid gap-2">
                            <a
                                href={`tel:${info.phone}`}
                                onClick={recordInquiry}
                                className={cn(buttonVariants({ size: "lg" }), "w-full")}
                            >
                                <Phone className="size-4" /> Call
                            </a>
                            <a
                                href={`https://wa.me/${whatsappNumber}`}
                                target="_blank"
                                rel="noreferrer"
                                onClick={recordInquiry}
                                className={cn(buttonVariants({ size: "lg", variant: "outline" }), "w-full")}
                            >
                                <MessageCircle className="size-4" /> WhatsApp
                            </a>
                            <a
                                href={`mailto:${info.email}`}
                                onClick={recordInquiry}
                                className={cn(buttonVariants({ size: "lg", variant: "outline" }), "w-full")}
                            >
                                <Mail className="size-4" /> Email
                            </a>
                        </div>

                        <p className="text-xs text-neutral-500">
                            Tell the owner you found this listing on Percy AI.
                        </p>
                    </>
                )}
            </CardContent>
        </Card>
    );
}