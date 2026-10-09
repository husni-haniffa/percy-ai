import { AdminNav } from "@/components/admin/admin-nav";
import { Navbar } from "@/components/layout/navbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col bg-neutral-50">
            <Navbar />
            <AdminNav/>
            <main className="flex-1">{children}</main>
        </div>
    );
}