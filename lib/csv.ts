// Küçük, bağımlılıksız CSV ayrıştırıcı (RFC 4180).
// Tırnaklı alanları (içinde virgül/yeni satır olabilir), "" kaçışını ve CRLF'yi yönetir.

export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  // BOM temizle
  const s = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;

  for (let i = 0; i < s.length; i++) {
    const ch = s[i];

    if (inQuotes) {
      if (ch === '"') {
        if (s[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (ch === "\r") {
      // \r\n veya tek \r — \n bir sonraki iterasyonda yakalanır; tek \r'yi satır sonu say
      if (s[i + 1] !== "\n") {
        row.push(field);
        rows.push(row);
        row = [];
        field = "";
      }
    } else {
      field += ch;
    }
  }

  // son alan/satır
  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  // tamamen boş satırları at
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

// Satır dizisini RFC 4180 CSV metnine çevirir. Excel'in Türkçe karakterleri
// doğru açması için çağıran taraf başına BOM ekleyebilir.
export function toCsv(rows: (string | number | null | undefined)[][]): string {
  const esc = (v: string | number | null | undefined): string => {
    const s = v == null ? "" : String(v);
    return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return rows.map((r) => r.map(esc).join(",")).join("\r\n");
}
