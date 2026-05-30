import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getActiveBranch } from "@/lib/branch-context";
import DashboardShell from "@/components/dashboard/DashboardShell";
import BranchSwitcher from "@/components/dashboard/BranchSwitcher";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const business = session.user.businessId
    ? await prisma.business.findUnique({
        where: { id: session.user.businessId },
        select: { name: true, type: true },
      })
    : null;

  let switcher = null;
  if (business?.type === "CHAIN" && session.user.businessId) {
    const { branches, active } = await getActiveBranch(session.user.businessId);
    if (branches.length > 0) {
      switcher = (
        <BranchSwitcher
          branches={branches.map((b) => ({ id: b.id, name: b.name }))}
          activeId={active?.id ?? null}
        />
      );
    }
  }

  async function signOutAction() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  return (
    <DashboardShell
      businessName={business?.name ?? session.user.email ?? "İşletme"}
      signOutAction={signOutAction}
      branchSwitcher={switcher}
    >
      {children}
    </DashboardShell>
  );
}
