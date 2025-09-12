
import { AdminAuthProvider } from "@/hooks/use-admin-auth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthProvider>
        <div className="relative flex min-h-screen flex-col bg-background">
            <main className="flex-1 flex flex-col items-center justify-center">{children}</main>
        </div>
    </AdminAuthProvider>
  );
}
