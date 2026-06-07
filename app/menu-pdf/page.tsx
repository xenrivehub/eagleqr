import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getOrCreateDefaultMenu } from "@/lib/actions/menu";
import { getActiveBranch } from "@/lib/branch-context";
import { loadMenuProducts } from "@/lib/queries/customer-menu";
import { getCurrencySpec } from "@/lib/queries/currencies";
import { getBusinessFeatures } from "@/lib/queries/plan-features";
import { formatPrice } from "@/lib/currency";
import { getTheme } from "@/lib/themes";
import PrintButton from "@/components/dashboard/PrintButton";

export const metadata = { title: "Menü — PDF" };

export default async function MenuPdfPage() {
  const session = await auth();
  if (!session?.user?.businessId) redirect("/login");
  const businessId = session.user.businessId;

  const business = await prisma.business.findUnique({
    where: { id: businessId },
    select: { name: true, logoUrl: true, currency: true, themeKey: true, type: true, address: true, phone: true },
  });
  if (!business) redirect("/login");

  // PDF menü çıktısı plan özelliğine bağlı (kapalıysa kilitli)
  if (!(await getBusinessFeatures(businessId)).pdfMenu) {
    return (
      <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "system-ui", background: "#f3f3f0" }}>
        <div style={{ textAlign: "center", maxWidth: 420 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔒</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 8px", color: "#1a1a1a" }}>PDF menü kilitli</h1>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: "#6b6b6b", margin: "0 0 20px" }}>
            Baskıya hazır PDF menü çıktısı Max planında. Açtırmak için iletişime geçin.
          </p>
          <a href="/dashboard/menu" style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>← Menüye dön</a>
        </div>
      </div>
    );
  }

  let menuId: string;
  let branchName: string | null = null;
  if (business.type === "CHAIN") {
    const { active } = await getActiveBranch(businessId);
    if (!active) {
      return (
        <div style={{ padding: 40, textAlign: "center", fontFamily: "system-ui" }}>
          Önce bir şube seçin. <a href="/dashboard/branches">Şubeler</a>
        </div>
      );
    }
    menuId = active.id;
    branchName = active.name;
  } else {
    const menu = await getOrCreateDefaultMenu(businessId);
    menuId = menu.id;
  }

  const [{ products, categoryList }, currency] = await Promise.all([
    loadMenuProducts(menuId),
    getCurrencySpec(business.currency),
  ]);
  const theme = getTheme(business.themeKey);
  const accent = theme.colors.accent;

  const grouped = categoryList
    .map((c) => ({ name: c.name, items: products.filter((p) => p.categoryId === c.id) }))
    .filter((g) => g.items.length > 0);

  return (
    <div style={{ background: "#f3f3f0", minHeight: "100dvh" }}>
      <PrintButton />

      <style>{`
        @page { size: A4; margin: 16mm 14mm; }
        @media print {
          .no-print { display: none !important; }
          html, body { background: #fff !important; }
          .sheet { box-shadow: none !important; margin: 0 !important; }
        }
        .sheet { color: #1a1a1a; }
        .pdf-cat { break-inside: avoid; }
        .pdf-item { break-inside: avoid; }
      `}</style>

      <div
        className="sheet"
        style={{
          maxWidth: 820,
          margin: "0 auto",
          background: "#fff",
          padding: "48px 56px 64px",
          boxShadow: "0 4px 30px rgba(0,0,0,0.08)",
          fontFamily: "'Playfair Display', Georgia, serif",
        }}
      >
        {/* Başlık */}
        <header style={{ textAlign: "center", borderBottom: `2px solid ${accent}`, paddingBottom: 22, marginBottom: 30 }}>
          {business.logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={business.logoUrl} alt="" style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 999, margin: "0 auto 14px", display: "block" }} />
          )}
          <div style={{ fontSize: 11, letterSpacing: "0.4em", color: accent, fontFamily: "system-ui", fontWeight: 600 }}>MENÜ</div>
          <h1 style={{ margin: "8px 0 0", fontSize: 38, fontWeight: 800, letterSpacing: "0.02em" }}>{business.name}</h1>
          {branchName && <div style={{ marginTop: 4, fontSize: 15, color: "#777", fontFamily: "system-ui" }}>{branchName}</div>}
        </header>

        {grouped.length === 0 ? (
          <p style={{ textAlign: "center", color: "#999", fontFamily: "system-ui" }}>Menüde ürün yok.</p>
        ) : (
          grouped.map((g) => (
            <section key={g.name} className="pdf-cat" style={{ marginBottom: 30 }}>
              <h2 style={{ fontSize: 21, fontWeight: 700, color: accent, margin: "0 0 12px", letterSpacing: "0.02em" }}>
                {g.name}
              </h2>
              <div>
                {g.items.map((p) => (
                  <div key={p.id} className="pdf-item" style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                      <span style={{ fontSize: 15.5, fontWeight: 700 }}>{p.name}</span>
                      <span style={{ flex: 1, borderBottom: "1px dotted #c9c4ba", transform: "translateY(-4px)" }} />
                      <span style={{ fontSize: 15.5, fontWeight: 700, color: accent, whiteSpace: "nowrap" }}>
                        {formatPrice(p.price, currency)}
                      </span>
                    </div>
                    {p.description && (
                      <p style={{ margin: "3px 0 0", fontSize: 12, lineHeight: 1.5, color: "#6b6b6b", fontFamily: "system-ui", maxWidth: "85%" }}>
                        {p.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))
        )}

        <footer style={{ marginTop: 40, borderTop: "1px solid #e5e2db", paddingTop: 16, textAlign: "center", fontFamily: "system-ui", fontSize: 11, color: "#9a958c" }}>
          {[business.address, business.phone].filter(Boolean).join(" · ")}
          <div style={{ marginTop: 6, letterSpacing: "0.2em" }}>EAGLE QR</div>
        </footer>
      </div>

      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&display=swap" />
    </div>
  );
}
