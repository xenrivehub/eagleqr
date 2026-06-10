// ============================================================================
// Müşteri menüsü arayüz metinleri (sabit etiketler).
// Anahtarlar + TR/EN varsayılanları burada (fallback). Diğer dillerin çevirileri
// admin panelinden girilir (UiTranslation tablosu) ve bunları geçersiz kılar.
// {x} = değişken yer tutucu (ör. alerjen listesi).
// ============================================================================

export type UiKeyDef = { key: string; group: string; tr: string; en: string };

export const UI_KEYS: UiKeyDef[] = [
  // Menü
  { key: "digitalMenu", group: "Menü", tr: "DİJİTAL MENÜ", en: "DIGITAL MENU" },
  { key: "open", group: "Menü", tr: "Açık", en: "Open" },
  { key: "chefPick", group: "Menü", tr: "Şefin Seçimi", en: "Chef's Pick" },
  { key: "popular", group: "Menü", tr: "Popüler", en: "Popular" },
  { key: "isNew", group: "Menü", tr: "Yeni", en: "New" },
  { key: "curatedByHand", group: "Menü", tr: "EL İLE DERLENDİ", en: "HAND-PICKED" },
  { key: "deals", group: "Menü", tr: "Fırsatlar", en: "Deals" },
  { key: "soldOut", group: "Menü", tr: "Tükendi", en: "Sold out" },
  { key: "trendingToday", group: "Menü", tr: "Bugün Popüler", en: "Trending Today" },
  { key: "maintenanceTitle", group: "Menü", tr: "Menümüz güncelleniyor", en: "Our menu is being updated" },
  { key: "maintenanceHint", group: "Menü", tr: "Kısa süre sonra tekrar deneyin.", en: "Please check back shortly." },
  { key: "searchPlaceholder", group: "Menü", tr: "Yemek, malzeme veya kategori ara…", en: "Search dishes, ingredients or categories…" },
  { key: "noResults", group: "Menü", tr: "Aramanıza uygun ürün bulunamadı.", en: "No items match your search." },
  { key: "selectBranch", group: "Menü", tr: "Şube seçin", en: "Select a branch" },
  { key: "menuPreparing", group: "Menü", tr: "Menü hazırlanıyor", en: "Menu coming soon" },

  // Alerjen
  { key: "allergenFilter", group: "Alerjen", tr: "Alerjen filtresi", en: "Allergen filter" },
  { key: "allergenPanelHint", group: "Alerjen", tr: "Kaçındığınız alerjenleri seçin; içeren ürünler işaretlenir.", en: "Select allergens to avoid; matching items are flagged." },
  { key: "clearFilter", group: "Alerjen", tr: "Filtreyi temizle", en: "Clear filter" },
  { key: "containsTemplate", group: "Alerjen", tr: "{x} içerir", en: "Contains {x}" },
  { key: "allergenWarnIntro", group: "Alerjen", tr: "Dikkat: Bu ürün filtrelediğiniz alerjeni içeriyor:", en: "Warning: this item contains an allergen you filtered:" },

  // Ürün detay
  { key: "backToMenu", group: "Ürün detay", tr: "Menü", en: "Menu" },
  { key: "about", group: "Ürün detay", tr: "Hakkında", en: "About" },
  { key: "allergenInfo", group: "Ürün detay", tr: "Alerjen Bilgisi", en: "Allergen Info" },
  { key: "productAllergenIntro", group: "Ürün detay", tr: "Bu ürün şu alerjenleri içerir:", en: "This product contains:" },
  { key: "similar", group: "Ürün detay", tr: "Benzer seçimler", en: "Similar picks" },
  { key: "options", group: "Ürün detay", tr: "Seçenekler", en: "Options" },
  { key: "pairsWith", group: "Ürün detay", tr: "Yanında iyi gider", en: "Goes well with" },
  { key: "seeAll", group: "Ürün detay", tr: "Tümü", en: "See all" },
  { key: "minutesShort", group: "Ürün detay", tr: "dk", en: "min" },

  // Puanlama
  { key: "rateThis", group: "Puanlama", tr: "Bu ürünü puanla", en: "Rate this item" },
  { key: "votes", group: "Puanlama", tr: "oy", en: "votes" },
  { key: "rateThanks", group: "Puanlama", tr: "Puanın için teşekkürler!", en: "Thanks for your rating!" },

  // AR / medya
  { key: "viewInAR", group: "AR / Medya", tr: "Masamda Görüntüle", en: "View in my space" },

  // Alt bilgi
  { key: "footerNote", group: "Alt bilgi", tr: "Fiyatlara KDV dahildir.", en: "Prices include VAT." },
  { key: "poweredBy", group: "Alt bilgi", tr: "EAGLE MENU İLE HAZIRLANMIŞTIR", en: "POWERED BY EAGLE MENU" },
  { key: "directions", group: "Alt bilgi", tr: "Yol tarifi", en: "Directions" },
];

export type UiStrings = Record<string, string>;

/** {x} yer tutucusunu değerle değiştirir. */
export function fillTemplate(text: string, value: string): string {
  return text.replace(/\{x\}/g, value);
}
