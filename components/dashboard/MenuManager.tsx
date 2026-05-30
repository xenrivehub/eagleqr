"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AllergenOption, CategoryView, ProductView } from "./types";
import type { MediaEntitlements } from "@/lib/plans";
import SlideOver from "./SlideOver";
import ConfirmDialog from "./ConfirmDialog";
import CategoryForm from "./CategoryForm";
import ProductForm from "./ProductForm";
import TranslateMenu, { type TargetLang } from "./TranslateMenu";
import { deleteCategory, deleteProduct } from "@/lib/actions/menu";
import { formatPrice, type CurrencySpec } from "@/lib/currency";

type Panel =
  | { kind: "category-new" }
  | { kind: "category-edit"; category: CategoryView }
  | { kind: "product-new"; categoryId: string }
  | { kind: "product-edit"; categoryId: string; product: ProductView };

type Confirm =
  | { kind: "category"; id: string; name: string }
  | { kind: "product"; id: string; name: string };

export default function MenuManager({
  menuId,
  categories,
  allergens,
  media,
  languages,
  currency,
}: {
  menuId: string;
  categories: CategoryView[];
  allergens: AllergenOption[];
  media: MediaEntitlements;
  languages: TargetLang[];
  currency: CurrencySpec;
}) {
  const router = useRouter();
  const [panel, setPanel] = useState<Panel | null>(null);
  const [confirm, setConfirm] = useState<Confirm | null>(null);
  const [deleting, setDeleting] = useState(false);

  function closeAndRefresh() {
    setPanel(null);
    router.refresh();
  }

  async function onConfirmDelete() {
    if (!confirm) return;
    setDeleting(true);
    const result =
      confirm.kind === "category"
        ? await deleteCategory(confirm.id)
        : await deleteProduct(confirm.id);
    setDeleting(false);
    setConfirm(null);
    if (result.success) router.refresh();
  }

  const panelTitle =
    panel?.kind === "category-new"
      ? "Yeni Kategori"
      : panel?.kind === "category-edit"
        ? "Kategoriyi Düzenle"
        : panel?.kind === "product-new"
          ? "Yeni Ürün"
          : "Ürünü Düzenle";

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Menü</h1>
          <p className="mt-1 text-sm text-ink/60">
            Kategorileri ve ürünleri buradan yönetin.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <TranslateMenu menuId={menuId} languages={languages} />
          <button
            type="button"
            onClick={() => setPanel({ kind: "category-new" })}
            className="cursor-pointer rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-ink transition-all hover:bg-brand-dark hover:scale-[1.02] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
          >
            + Kategori
          </button>
        </div>
      </div>

      {categories.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-ink/20 bg-white p-10 text-center">
          <p className="font-display text-lg font-semibold text-ink">
            Henüz kategori yok
          </p>
          <p className="mt-1 text-sm text-ink/60">
            İlk kategorinizi ekleyerek menünüzü oluşturmaya başlayın.
          </p>
          <button
            type="button"
            onClick={() => setPanel({ kind: "category-new" })}
            className="mt-5 cursor-pointer rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-ink hover:bg-brand-dark"
          >
            + İlk kategoriyi ekle
          </button>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          {categories.map((category) => (
            <section
              key={category.id}
              className="rounded-2xl border border-ink/10 bg-white"
            >
              <header className="flex items-center justify-between gap-3 border-b border-ink/10 px-5 py-4">
                <h2 className="font-display text-lg font-semibold text-ink">
                  {category.name}
                  <span className="ml-2 text-sm font-normal text-ink/40">
                    {category.products.length} ürün
                  </span>
                </h2>
                <div className="flex items-center gap-1">
                  <IconButton
                    label="Kategoriyi düzenle"
                    onClick={() => setPanel({ kind: "category-edit", category })}
                    icon="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"
                  />
                  <IconButton
                    label="Kategoriyi sil"
                    danger
                    onClick={() =>
                      setConfirm({ kind: "category", id: category.id, name: category.name })
                    }
                    icon="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"
                  />
                </div>
              </header>

              <div className="divide-y divide-ink/5">
                {category.products.length === 0 ? (
                  <p className="px-5 py-6 text-center text-sm text-ink/50">
                    Bu kategoride henüz ürün yok.
                  </p>
                ) : (
                  category.products.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-cream"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        {product.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={product.imageUrl}
                            alt=""
                            className="h-11 w-11 shrink-0 rounded-lg border border-ink/10 object-cover"
                          />
                        ) : (
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-dashed border-ink/15 text-ink/30">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                              <rect x="3" y="3" width="18" height="18" rx="2" />
                              <circle cx="9" cy="9" r="2" />
                              <path d="m21 15-5-5L5 21" />
                            </svg>
                          </span>
                        )}
                        <div className="min-w-0">
                          <p className="truncate font-medium text-ink">{product.name}</p>
                          {product.description && (
                            <p className="truncate text-sm text-ink/50">
                              {product.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-display font-semibold text-ink tabular-nums">
                          {formatPrice(product.price, currency)}
                        </span>
                        <IconButton
                          label="Ürünü düzenle"
                          onClick={() =>
                            setPanel({
                              kind: "product-edit",
                              categoryId: category.id,
                              product,
                            })
                          }
                          icon="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"
                        />
                        <IconButton
                          label="Ürünü sil"
                          danger
                          onClick={() =>
                            setConfirm({ kind: "product", id: product.id, name: product.name })
                          }
                          icon="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="px-5 py-3">
                <button
                  type="button"
                  onClick={() => setPanel({ kind: "product-new", categoryId: category.id })}
                  className="cursor-pointer text-sm font-semibold text-brand-dark hover:underline"
                >
                  + Ürün ekle
                </button>
              </div>
            </section>
          ))}
        </div>
      )}

      <SlideOver open={!!panel} onClose={() => setPanel(null)} title={panelTitle}>
        {panel?.kind === "category-new" && (
          <CategoryForm menuId={menuId} onDone={closeAndRefresh} />
        )}
        {panel?.kind === "category-edit" && (
          <CategoryForm menuId={menuId} category={panel.category} onDone={closeAndRefresh} />
        )}
        {panel?.kind === "product-new" && (
          <ProductForm
            categoryId={panel.categoryId}
            allergens={allergens}
            media={media}
            currency={currency}
            onDone={closeAndRefresh}
          />
        )}
        {panel?.kind === "product-edit" && (
          <ProductForm
            categoryId={panel.categoryId}
            allergens={allergens}
            product={panel.product}
            media={media}
            currency={currency}
            onDone={closeAndRefresh}
          />
        )}
      </SlideOver>

      <ConfirmDialog
        open={!!confirm}
        title={confirm?.kind === "category" ? "Kategoriyi sil" : "Ürünü sil"}
        message={
          confirm?.kind === "category"
            ? `"${confirm?.name}" kategorisi ve içindeki tüm ürünler silinecek. Bu işlem geri alınamaz.`
            : `"${confirm?.name}" ürünü silinecek. Bu işlem geri alınamaz.`
        }
        pending={deleting}
        onConfirm={onConfirmDelete}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}

function IconButton({
  label,
  icon,
  onClick,
  danger,
}: {
  label: string;
  icon: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark ${
        danger ? "text-ink/50 hover:bg-red-50 hover:text-red-600" : "text-ink/50 hover:bg-ink/5 hover:text-ink"
      }`}
    >
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d={icon} />
      </svg>
    </button>
  );
}
