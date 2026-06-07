// ============================================================================
// Sayfa oluşturucu — blok tipleri ve varsayılanları.
// Bloklar Page.blocks (JSON) içinde sıralı bir dizi olarak saklanır.
// Her blok: { id, type, ...alanlar }
// ============================================================================

export type BlockType =
  | "hero"
  | "richText"
  | "featureSplit"
  | "featureGrid"
  | "stats"
  | "cta"
  | "faq"
  | "image";

export type Block = {
  id: string;
  type: BlockType;
  // Esnek alanlar — tipe göre değişir (editör/render tarafında daraltılır)
  overline?: string;
  title?: string;
  subtitle?: string;
  heading?: string;
  body?: string;
  ctaLabel?: string;
  ctaHref?: string;
  imageUrl?: string;
  caption?: string;
  side?: "left" | "right";
  items?: { title?: string; desc?: string; value?: string; label?: string; q?: string; a?: string }[];
};

export const BLOCK_META: Record<
  BlockType,
  { label: string; desc: string }
> = {
  hero: { label: "Hero", desc: "Üst etiket + büyük başlık + alt metin + buton" },
  featureSplit: { label: "Metin + Görsel", desc: "Solda/sağda görsel, yanında metin" },
  featureGrid: { label: "Özellik kartları", desc: "Başlık + açıklama kart ızgarası" },
  stats: { label: "İstatistik", desc: "Büyük rakam + etiket (3'lü)" },
  cta: { label: "CTA bandı", desc: "Çağrı başlığı + buton" },
  faq: { label: "SSS", desc: "Soru-cevap listesi" },
  richText: { label: "Zengin metin", desc: "Başlık + paragraf" },
  image: { label: "Tek görsel", desc: "Görsel + opsiyonel açıklama" },
};

export const BLOCK_ORDER: BlockType[] = [
  "hero",
  "featureSplit",
  "featureGrid",
  "stats",
  "cta",
  "faq",
  "richText",
  "image",
];

/** Yeni blok için varsayılan içerik. id çağıran tarafça atanır (crypto.randomUUID). */
export function blockDefaults(type: BlockType): Omit<Block, "id"> {
  switch (type) {
    case "hero":
      return { type, overline: "Yeni nesil", title: "Başlık buraya", subtitle: "Kısa açıklama metni.", ctaLabel: "Ücretsiz Başla", ctaHref: "/register" };
    case "featureSplit":
      return { type, title: "Özellik başlığı", body: "Bu özelliğin ne yaptığını anlatan kısa metin.", side: "left", imageUrl: "" };
    case "featureGrid":
      return { type, heading: "Özellikler", items: [{ title: "Özellik 1", desc: "Açıklama" }, { title: "Özellik 2", desc: "Açıklama" }, { title: "Özellik 3", desc: "Açıklama" }] };
    case "stats":
      return { type, items: [{ value: "%40", label: "Daha fazla etkileşim" }, { value: "15dk", label: "Kurulum" }, { value: "10+", label: "Dil" }] };
    case "cta":
      return { type, title: "Bugün başlayın", subtitle: "Kredi kartı gerekmez.", ctaLabel: "Ücretsiz Başla", ctaHref: "/register" };
    case "faq":
      return { type, heading: "Sıkça Sorulan Sorular", items: [{ q: "Soru?", a: "Cevap." }] };
    case "richText":
      return { type, heading: "Başlık", body: "Paragraf metni." };
    case "image":
      return { type, imageUrl: "", caption: "" };
  }
}
