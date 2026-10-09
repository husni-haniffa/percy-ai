import Link from "next/link";
import { Show, UserButton } from "@clerk/nextjs";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Container } from "./container";
import { Logo } from "./logo";
import { NavLink } from "./nav-link";
import { MobileMenu } from "./mobile-menu";
import { AdminLink } from "./admin-link";
import { navLinks } from "./nav-links";

export function Navbar() {
    return (
        <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur">
            <Container className="flex h-16 items-center justify-between">
                <div className="flex items-center gap-10">
                    <Logo />
                    <nav className="hidden items-center gap-6 md:flex">
                        {navLinks.map((link) => (
                            <NavLink key={link.href} href={link.href}>
                                {link.label}
                            </NavLink>
                        ))}
                    </nav>
                </div>

                <div className="flex items-center gap-2">
                    <Show when="signed-out">
                        <div className="hidden items-center gap-2 md:flex">
                            <Link href="/sign-in" className={buttonVariants({ variant: "ghost" })}>
                                Sign in
                            </Link>
                            <Link href="/sign-up" className={buttonVariants()}>
                                Sign up
                            </Link>
                        </div>
                    </Show>

                    <Show when="signed-in">
                        <Link
                            href="/dashboard"
                            className={cn(buttonVariants({ variant: "outline" }), "hidden sm:inline-flex")}
                        >
                            Dashboard
                        </Link>
                        <AdminLink className="hidden sm:inline-flex" />
                        <UserButton />
                    </Show>

                    <MobileMenu>
                        <Show when="signed-out">
                            <Link href="/sign-in" className={buttonVariants({ variant: "outline" })}>
                                Sign in
                            </Link>
                            <Link href="/sign-up" className={buttonVariants()}>
                                Sign up
                            </Link>
                        </Show>
                        <Show when="signed-in">
                            <Link href="/dashboard" className={buttonVariants()}>
                                Dashboard
                            </Link>
                            <AdminLink />
                        </Show>
                    </MobileMenu>
                </div>
            </Container>
        </header>
    );
}