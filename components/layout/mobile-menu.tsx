"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { NavLink } from "./nav-link";
import { navLinks } from "./nav-links";

export function MobileMenu({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open menu"
                onClick={() => setOpen(true)}
            >
                <Menu className="size-5" />
            </Button>

            <Sheet open={open} onOpenChange={setOpen}>
                <SheetContent side="right" className="w-72">
                    <SheetHeader>
                        <SheetTitle className="text-red-700">Menu</SheetTitle>
                    </SheetHeader>

                    {/* Any click inside closes the menu */}
                    <nav className="flex flex-col gap-1 px-4" onClick={() => setOpen(false)}>
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.href}
                                href={link.href}
                                className="rounded-md px-3 py-2 text-base hover:bg-red-50"
                            >
                                {link.label}
                            </NavLink>
                        ))}
                        <div className="mt-4 flex flex-col gap-2 border-t pt-4">{children}</div>
                    </nav>
                </SheetContent>
            </Sheet>
        </>
    );
}