export type AllergenOption = { id: string; label: string };

export type ProductView = {
  id: string;
  name: string;
  price: string;
  description: string | null;
  calories: number | null;
  prepMinutes: number | null;
  categoryId: string;
  allergenIds: string[];
  imageUrl: string | null;
  videoUrl: string | null;
  modelGlbUrl: string | null;
  pairedIds: string[];
  campaignId: string | null;
  campaignStart: string | null;
  campaignEnd: string | null;
  campaignPrice: string | null;
  isFeatured: boolean;
  isNew: boolean;
  isPopular: boolean;
};

export type CategoryView = {
  id: string;
  name: string;
  products: ProductView[];
};
