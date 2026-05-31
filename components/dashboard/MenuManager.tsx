"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { AllergenOption, CategoryView, ProductView } from "./types";
import type { MediaEntitlements } from "@/lib/plans";
import SlideOver from "./SlideOver";
import ConfirmDialog from "./ConfirmDialog";
import CategoryForm from "./CategoryForm";
import ProductForm from "./ProductForm";
import TranslateMenu, { type TargetLang } from "./TranslateMenu";
import BulkImport from "./BulkImport";
import {
  deleteCategory,
  deleteProduct,
  reorderCategories,
  reorderProducts,
} from "@/lib/actions/menu";
import { formatPrice, type CurrencySpec } from "@/lib/currency";

type Panel =
  | { kind: "category-new" }
  | { kind: "category-edit"; category: CategoryView }
  | { kind: "product-new"; categoryId: string }
  | { kind: "product-edit"; categoryId: string; product: ProductView }
  | { kind: "import" };

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
  campaigns,
}: {
  menuId: string;
  categories: CategoryView[];
  allergens: AllergenOption[];
  media: MediaEntitlements;
  languages: TargetLang[];
  currency: CurrencySpec;
  campaigns: { id: string; label: string; color: string }[];
}) {
  const router = useRouter();
  const [panel, setPanel] = useState<Panel | null>(null);
  const [confirm, setConfirm] = useState<Confirm | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [cats, setCats] = useState<CategoryView[]>(categories);

  // Sunucudan yeni veri gelince (ekle/sil/düzenle sonrası) yerel durumu eşitle
  useEffect(() => setCats(categories), [categories]);

  // Eşleşme seçici için tüm menü ürünleri
  const menuProducts = cats.flatMap((c) => c.products.map((p) => ({ id: p.id, name: p.name })));

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

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

  function onCategoryDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return;
    const oldIndex = cats.findIndex((c) => c.id === active.id);
    const newIndex = cats.findIndex((c) => c.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    const next = arrayMove(cats, oldIndex, newIndex);
    setCats(next);
    reorderCategories(menuId, next.map((c) => c.id));
  }

  function onProductDragEnd(categoryId: string, { active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return;
    const cat = cats.find((c) => c.id === categoryId);
    if (!cat) return;
    const oldIndex = cat.products.findIndex((p) => p.id === active.id);
    const newIndex = cat.products.findIndex((p) => p.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    const products = arrayMove(cat.products, oldIndex, newIndex);
    setCats((prev) => prev.map((c) => (c.id === categoryId ? { ...c, products } : c)));
    reorderProducts(categoryId, products.map((p) => p.id));
  }

  const panelTitle =
    panel?.kind === "category-new"
      ? "Yeni Kategori"
      : panel?.kind === "category-edit"
        ? "Kategoriyi Düzenle"
        : panel?.kind === "product-new"
          ? "Yeni Ürün"
          : panel?.kind === "import"
            ? "Toplu İçe Aktar (CSV)"
            : "Ürünü Düzenle";

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Menü</h1>
          <p className="mt-1 text-sm text-ink/60">
            Kategorileri ve ürünleri buradan yönetin. Sıralamak için tutamaçtan sürükleyin.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <TranslateMenu menuId={menuId} languages={languages} />
          <button
            type="button"
            onClick={() => setPanel({ kind: "import" })}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-ink/15 px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-ink/5"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            Toplu içe aktar
          </button>
          <button
            type="button"
            onClick={() => setPanel({ kind: "category-new" })}
            className="cursor-pointer rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-ink transition-all hover:bg-brand-dark hover:scale-[1.02] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
          >
            + Kategori
          </button>
        </div>
      </div>

      {cats.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-ink/20 bg-white p-10 text-center">
          <p className="font-display text-lg font-semibold text-ink">Henüz kategori yok</p>
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
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onCategoryDragEnd}>
          <SortableContext items={cats.map((c) => c.id)} strategy={verticalListSortingStrategy}>
            <div className="mt-8 space-y-6">
              {cats.map((category) => (
                <SortableCategory
                  key={category.id}
                  category={category}
                  currency={currency}
                  sensors={sensors}
                  onEditCategory={() => setPanel({ kind: "category-edit", category })}
                  onDeleteCategory={() => setConfirm({ kind: "category", id: category.id, name: category.name })}
                  onAddProduct={() => setPanel({ kind: "product-new", categoryId: category.id })}
                  onEditProduct={(product) => setPanel({ kind: "product-edit", categoryId: category.id, product })}
                  onDeleteProduct={(product) => setConfirm({ kind: "product", id: product.id, name: product.name })}
                  onProductDragEnd={(e) => onProductDragEnd(category.id, e)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <SlideOver open={!!panel} onClose={() => setPanel(null)} title={panelTitle}>
        {panel?.kind === "import" && (
          <BulkImport menuId={menuId} onImported={closeAndRefresh} />
        )}
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
            menuProducts={menuProducts}
            campaigns={campaigns}
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
            menuProducts={menuProducts}
            campaigns={campaigns}
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

function SortableCategory({
  category,
  currency,
  sensors,
  onEditCategory,
  onDeleteCategory,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onProductDragEnd,
}: {
  category: CategoryView;
  currency: CurrencySpec;
  sensors: ReturnType<typeof useSensors>;
  onEditCategory: () => void;
  onDeleteCategory: () => void;
  onAddProduct: () => void;
  onEditProduct: (p: ProductView) => void;
  onDeleteProduct: (p: ProductView) => void;
  onProductDragEnd: (e: DragEndEvent) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: category.id,
  });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 20 : undefined,
  };

  return (
    <section ref={setNodeRef} style={style} className="rounded-2xl border border-ink/10 bg-white">
      <header className="flex items-center justify-between gap-3 border-b border-ink/10 px-3 py-4 sm:px-5">
        <div className="flex min-w-0 items-center gap-1.5">
          <Grip listeners={listeners} attributes={attributes} label="Kategoriyi sürükle" />
          <h2 className="truncate font-display text-lg font-semibold text-ink">
            {category.name}
            <span className="ml-2 text-sm font-normal text-ink/40">
              {category.products.length} ürün
            </span>
          </h2>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <IconButton label="Kategoriyi düzenle" onClick={onEditCategory} icon="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z" />
          <IconButton label="Kategoriyi sil" danger onClick={onDeleteCategory} icon="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
        </div>
      </header>

      <div className="divide-y divide-ink/5">
        {category.products.length === 0 ? (
          <p className="px-5 py-6 text-center text-sm text-ink/50">Bu kategoride henüz ürün yok.</p>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onProductDragEnd}>
            <SortableContext items={category.products.map((p) => p.id)} strategy={verticalListSortingStrategy}>
              {category.products.map((product) => (
                <SortableProduct
                  key={product.id}
                  product={product}
                  currency={currency}
                  onEdit={() => onEditProduct(product)}
                  onDelete={() => onDeleteProduct(product)}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>

      <div className="px-5 py-3">
        <button
          type="button"
          onClick={onAddProduct}
          className="cursor-pointer text-sm font-semibold text-brand-dark hover:underline"
        >
          + Ürün ekle
        </button>
      </div>
    </section>
  );
}

function SortableProduct({
  product,
  currency,
  onEdit,
  onDelete,
}: {
  product: ProductView;
  currency: CurrencySpec;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: product.id,
  });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 20 : undefined,
    background: isDragging ? "var(--color-cream, #faf7f2)" : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between gap-3 px-3 py-3.5 transition-colors hover:bg-cream sm:px-5"
    >
      <div className="flex min-w-0 items-center gap-2">
        <Grip listeners={listeners} attributes={attributes} label="Ürünü sürükle" />
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.imageUrl} alt="" className="h-11 w-11 shrink-0 rounded-lg border border-ink/10 object-cover" />
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
          {product.description && <p className="truncate text-sm text-ink/50">{product.description}</p>}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <span className="font-display font-semibold text-ink tabular-nums">
          {formatPrice(product.price, currency)}
        </span>
        <IconButton label="Ürünü düzenle" onClick={onEdit} icon="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z" />
        <IconButton label="Ürünü sil" danger onClick={onDelete} icon="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
      </div>
    </div>
  );
}

function Grip({
  listeners,
  attributes,
  label,
}: {
  listeners: ReturnType<typeof useSortable>["listeners"];
  attributes: ReturnType<typeof useSortable>["attributes"];
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className="flex h-8 w-7 shrink-0 cursor-grab touch-none items-center justify-center rounded-md text-ink/30 hover:bg-ink/5 hover:text-ink/60 active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
      {...attributes}
      {...listeners}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <circle cx="9" cy="6" r="1.5" />
        <circle cx="15" cy="6" r="1.5" />
        <circle cx="9" cy="12" r="1.5" />
        <circle cx="15" cy="12" r="1.5" />
        <circle cx="9" cy="18" r="1.5" />
        <circle cx="15" cy="18" r="1.5" />
      </svg>
    </button>
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
