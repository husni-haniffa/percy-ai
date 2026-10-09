import { Navbar } from "@/components/layout/navbar";
import { OnboardingGate } from "@/components/dashboard/onboarding-gate";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col bg-neutral-50">
            <Navbar />
            <main className="flex-1">
                <OnboardingGate>{children}</OnboardingGate>
            </main>
        </div>
    );
}