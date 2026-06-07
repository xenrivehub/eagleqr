import { prisma } from "@/lib/prisma";

// Public navbar için çözümlenmiş ağaç
export type NavChild = { label: string; href: string; description: string | null; icon: string | null };
export type NavLink = {
  label: string;
  href: string | null; // null = sadece grup başlığı (dropdown)
  description: string | null;
  icon: string | null;
  children: NavChild[];
};

// Admin editörü için ham ağaç
type RawItem = { id: string; label: string; description: string | null; icon: string | null; url: string | null; pageId: string | null };
export type AdminNavItem = RawItem & { children: RawItem[] };

const itemInclude = {
  page: { select: { slug: true, status: true } },
  children: {
    orderBy: { order: "asc" as const },
    include: { page: { select: { slug: true, status: true } } },
  },
} as const;

function resolveHref(item: {
  url: string | null;
  page: { slug: string; status: "DRAFT" | "PUBLISHED" } | null;
}): string | null {
  if (item.page) return item.page.status === "PUBLISHED" ? `/${item.page.slug}` : null;
  if (item.url && item.url.trim()) return item.url.trim();
  return null;
}

/** Public navbar ağacı (yayınlanmamış sayfalara/boş linklere giden öğeler elenir). */
export async function getNavTree(): Promise<NavLink[]> {
  const tops = await prisma.navItem.findMany({
    where: { parentId: null },
    orderBy: { order: "asc" },
    include: itemInclude,
  });

  const out: NavLink[] = [];
  for (const top of tops) {
    const children = top.children
      .map((ch) => ({ label: ch.label, href: resolveHref(ch), description: ch.description, icon: ch.icon }))
      .filter((ch): ch is NavChild => !!ch.href);
    const href = resolveHref(top);
    if (!href && children.length === 0) continue; // boş öğe → atla
    out.push({ label: top.label, href, description: top.description, icon: top.icon, children });
  }
  return out;
}

/** Admin editörü için ham ağaç. */
export async function getNavForAdmin(): Promise<AdminNavItem[]> {
  const tops = await prisma.navItem.findMany({
    where: { parentId: null },
    orderBy: { order: "asc" },
    include: { children: { orderBy: { order: "asc" } } },
  });
  return tops.map((t) => ({
    id: t.id,
    label: t.label,
    description: t.description,
    icon: t.icon,
    url: t.url,
    pageId: t.pageId,
    children: t.children.map((c) => ({ id: c.id, label: c.label, description: c.description, icon: c.icon, url: c.url, pageId: c.pageId })),
  }));
}
