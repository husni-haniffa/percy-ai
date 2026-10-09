import { Logo } from "@/components/layout/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-red-50 to-white px-4 py-10">
            <div className="mb-6">
                <Logo />
            </div>
            {children}
        </div>
    );
}