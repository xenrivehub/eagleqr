// OpenRouter ile menü içeriği çevirisi (TR → hedef dil).
// Yemek/marka özel adları korunur, açıklamalar doğal çevrilir.

const ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

export function isTranslationConfigured(): boolean {
  return Boolean(process.env.OPENROUTER_API_KEY);
}

export type TranslateItem = {
  id: string;
  name: string;
  description?: string | null;
};

export type TranslatedItem = { id: string; name: string; description: string };

function buildPrompt(targetName: string) {
  return [
    `You are a professional restaurant menu translator. Translate the given items from Turkish to ${targetName}.`,
    `Rules:`,
    `- Translate the "name" and "description" naturally and appetizingly for a menu.`,
    `- KEEP internationally known dish/drink and brand names in their original form (e.g. Espresso, Latte, Cappuccino, Künefe, Baklava, Lahmacun).`,
    `- Keep numbers, measurements and currency symbols unchanged.`,
    `- If a description is empty, return an empty string for it.`,
    `- Return ONLY a JSON object of the form {"items":[{"id","name","description"}]} with the SAME ids. No extra text.`,
  ].join("\n");
}

function extractJson(content: string): unknown {
  try {
    return JSON.parse(content);
  } catch {
    const start = content.indexOf("{");
    const end = content.lastIndexOf("}");
    if (start >= 0 && end > start) {
      return JSON.parse(content.slice(start, end + 1));
    }
    throw new Error("Çeviri yanıtı çözümlenemedi.");
  }
}

/**
 * Verilen ürünleri hedef dile çevirir. id → {name, description} eşlemesi döner.
 */
export async function translateItems(
  items: TranslateItem[],
  targetName: string,
  model: string,
): Promise<Map<string, { name: string; description: string }>> {
  if (!isTranslationConfigured()) {
    throw new Error("Çeviri yapılandırılmadı (OPENROUTER_API_KEY eksik).");
  }
  if (items.length === 0) return new Map();

  const payload = {
    model,
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: buildPrompt(targetName) },
      {
        role: "user",
        content: JSON.stringify({
          items: items.map((i) => ({
            id: i.id,
            name: i.name,
            description: i.description ?? "",
          })),
        }),
      },
    ],
  };

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "X-Title": "Eagle Menu",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`OpenRouter hatası (${res.status}): ${body.slice(0, 200)}`);
  }

  const data = await res.json();
  const content: string = data?.choices?.[0]?.message?.content ?? "";
  const parsed = extractJson(content) as { items?: TranslatedItem[] };

  const map = new Map<string, { name: string; description: string }>();
  for (const it of parsed.items ?? []) {
    if (it && typeof it.id === "string") {
      map.set(it.id, {
        name: typeof it.name === "string" ? it.name : "",
        description: typeof it.description === "string" ? it.description : "",
      });
    }
  }
  return map;
}
