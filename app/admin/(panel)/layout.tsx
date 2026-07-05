import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import AdminShell from "@/components/admin/AdminShell";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (session.user.role !== "SUPER_ADMIN") redirect("/dashboard");

  // Admin oturumu en fazla 1 gün geçerli — süresi dolduysa yeniden giriş iste.
  // (Admin login sayfası authed kullanıcıyı geri yönlendirmez, döngü olmaz.)
  const ADMIN_SESSION_MS = 24 * 60 * 60 * 1000;
  if (session.loginAt && Date.now() - session.loginAt > ADMIN_SESSION_MS) {
    redirect("/admin/login?expired=1");
  }

  async function signOutAction() {
    "use server";
    await signOut({ redirectTo: "/admin/login" });
  }

  return (
    <AdminShell email={session.user.email ?? ""} signOutAction={signOutAction}>
      {children}
    </AdminShell>
  );
}
