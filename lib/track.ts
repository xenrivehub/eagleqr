// Müşteri tarafı etkileşim olaylarını kaydeder (AR açma, öneri tıklama).
// Tıklama olayları her seferinde sayılır (TrackView'daki SCAN/VIEW dedupe'inden ayrı).
export function trackEvent(payload: {
  businessId: string;
  type: "AR_OPEN" | "PAIR_CLICK";
  productId?: string;
  menuId?: string;
}) {
  try {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // sessiz
  }
}
