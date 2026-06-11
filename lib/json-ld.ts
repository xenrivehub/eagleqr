// JSON-LD verisini <script type="application/ld+json"> içine gömerken güvenli serileştirme.
// JSON.stringify, "<", ">", "&" karakterlerini escape ETMEZ; bu yüzden veri içindeki
// "</script>" tarayıcıda script etiketini erkenden kapatıp XSS'e yol açabilir.
// Bu karakterleri \uXXXX kaçışına çevirerek breakout'u önleriz (JSON geçerliliği korunur).
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}
