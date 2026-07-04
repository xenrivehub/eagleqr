export type AllergenOption = { id: string; label: string };

// Çeviri sözlüğü: { en: { name, description }, de: { ... } } — panel önizlemesi + müşteri menüsü
export type Translations = Record<string, { name?: string; description?: string }>;

export type ProductView = {
  id: string;
  name: string;
  price: string;
  description: string | null;
  translations: Translations;
  calories: number | null;
  prepMinutes: number | null;
  weight: string | null;
  portion: string | null;
  categoryId: string;
  allergenIds: string[];
  imageUrl: string | null;
  videoUrl: string | null;
  modelGlbUrl: string | null;
  pairedIds: string[];
  campaignId: string | null;
  campaignStart: string | null;
  campaignEnd: string | null;
  campaignDateStart: string | null;
  campaignDateEnd: string | null;
  campaignPrice: string | null;
  availStart: string | null;
  availEnd: string | null;
  variations: { name: string; icon: string; price: string }[];
  isSoldOut: boolean;
  isFeatured: boolean;
  isNew: boolean;
  isPopular: boolean;
};

export type CategoryView = {
  id: string;
  name: string;
  description: string | null;
  translations: Translations;
  imageUrl: string | null;
  videoUrl: string | null;
  availStart: string | null;
  availEnd: string | null;
  campaignId: string | null;
  campaignStart: string | null;
  campaignEnd: string | null;
  campaignDateStart: string | null;
  campaignDateEnd: string | null;
  campaignDiscType: string | null;
  campaignDiscValue: string | null;
  products: ProductView[];
};
