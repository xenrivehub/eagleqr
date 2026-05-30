// 14 AB alerjeni — sabit, doğrulanmış çeviriler (makineye çevirtilmez).
// Diğer dillerde karşılığı yoksa DB'deki TR etiketine düşülür.

const DICT: Record<string, Record<string, string>> = {
  en: { gluten: "Gluten", crustaceans: "Crustaceans", eggs: "Eggs", fish: "Fish", peanuts: "Peanuts", soybeans: "Soybeans", milk: "Milk", nuts: "Nuts", celery: "Celery", mustard: "Mustard", sesame: "Sesame", sulphites: "Sulphites", lupin: "Lupin", molluscs: "Molluscs" },
  de: { gluten: "Gluten", crustaceans: "Krebstiere", eggs: "Eier", fish: "Fisch", peanuts: "Erdnüsse", soybeans: "Soja", milk: "Milch", nuts: "Schalenfrüchte", celery: "Sellerie", mustard: "Senf", sesame: "Sesam", sulphites: "Sulfite", lupin: "Lupinen", molluscs: "Weichtiere" },
  fr: { gluten: "Gluten", crustaceans: "Crustacés", eggs: "Œufs", fish: "Poisson", peanuts: "Arachides", soybeans: "Soja", milk: "Lait", nuts: "Fruits à coque", celery: "Céleri", mustard: "Moutarde", sesame: "Sésame", sulphites: "Sulfites", lupin: "Lupin", molluscs: "Mollusques" },
  es: { gluten: "Gluten", crustaceans: "Crustáceos", eggs: "Huevos", fish: "Pescado", peanuts: "Cacahuetes", soybeans: "Soja", milk: "Leche", nuts: "Frutos de cáscara", celery: "Apio", mustard: "Mostaza", sesame: "Sésamo", sulphites: "Sulfitos", lupin: "Altramuces", molluscs: "Moluscos" },
  it: { gluten: "Glutine", crustaceans: "Crostacei", eggs: "Uova", fish: "Pesce", peanuts: "Arachidi", soybeans: "Soia", milk: "Latte", nuts: "Frutta a guscio", celery: "Sedano", mustard: "Senape", sesame: "Sesamo", sulphites: "Solfiti", lupin: "Lupini", molluscs: "Molluschi" },
  ru: { gluten: "Глютен", crustaceans: "Ракообразные", eggs: "Яйца", fish: "Рыба", peanuts: "Арахис", soybeans: "Соя", milk: "Молоко", nuts: "Орехи", celery: "Сельдерей", mustard: "Горчица", sesame: "Кунжут", sulphites: "Сульфиты", lupin: "Люпин", molluscs: "Моллюски" },
  ar: { gluten: "الغلوتين", crustaceans: "القشريات", eggs: "البيض", fish: "السمك", peanuts: "الفول السوداني", soybeans: "الصويا", milk: "الحليب", nuts: "المكسرات", celery: "الكرفس", mustard: "الخردل", sesame: "السمسم", sulphites: "الكبريتيت", lupin: "الترمس", molluscs: "الرخويات" },
};

/** Alerjen etiketini istenen dilde döndürür; yoksa TR etiketine düşer. */
export function allergenLabel(code: string, lang: string, fallbackTr: string): string {
  if (lang === "tr") return fallbackTr;
  return DICT[lang]?.[code] ?? fallbackTr;
}
