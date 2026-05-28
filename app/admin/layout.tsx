import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import AdminShell from "@/components/admin/AdminShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "SUPER_ADMIN") redirect("/dashboard");

  async function signOutAction() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  return (
    <AdminShell email={session.user.email ?? ""} signOutAction={signOutAction}>
      {children}
    </AdminShell>
  );
}
