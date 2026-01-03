import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";

export default async function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    return (
        <div className="flex min-h-screen" style={{ background: "linear-gradient(180deg, #FFFBF7 0%, #F5E6D3 100%)" }}>
            <Sidebar />
            <main className="flex-1 lg:ml-0">
                <div className="p-6 lg:p-8">{children}</div>
            </main>
        </div>
    );
}
