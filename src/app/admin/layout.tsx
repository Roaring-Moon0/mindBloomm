
import { AdminAuthProvider } from "@/hooks/use-admin-auth";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthProvider>
        <div className="relative flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-1 flex flex-col">{children}</main>
            <Footer />
        </div>
    </AdminAuthProvider>
  );
}
