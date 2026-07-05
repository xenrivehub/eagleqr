import { ListObjectsV2Command, DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { getR2Client, R2_BUCKET, isR2Configured } from "@/lib/r2";

// R2 yönetim yardımcıları — hesap silme temizliği ve orphan (sahipsiz) dosya temizliği için.
// Yalnızca sunucu (server action / route handler) tarafında kullanılır.

export async function listKeys(prefix?: string): Promise<string[]> {
  if (!isR2Configured()) return [];
  const client = getR2Client();
  const bucket = R2_BUCKET();
  const keys: string[] = [];
  let token: string | undefined;
  do {
    const res = await client.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: prefix,
        ContinuationToken: token,
        MaxKeys: 1000,
      }),
    );
    for (const o of res.Contents ?? []) if (o.Key) keys.push(o.Key);
    token = res.IsTruncated ? res.NextContinuationToken : undefined;
  } while (token);
  return keys;
}

export async function listObjects(
  prefix?: string,
): Promise<{ key: string; lastModified: Date | null }[]> {
  if (!isR2Configured()) return [];
  const client = getR2Client();
  const bucket = R2_BUCKET();
  const out: { key: string; lastModified: Date | null }[] = [];
  let token: string | undefined;
  do {
    const res = await client.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: prefix,
        ContinuationToken: token,
        MaxKeys: 1000,
      }),
    );
    for (const o of res.Contents ?? []) {
      if (o.Key) out.push({ key: o.Key, lastModified: o.LastModified ?? null });
    }
    token = res.IsTruncated ? res.NextContinuationToken : undefined;
  } while (token);
  return out;
}

export async function deleteKeys(keys: string[]): Promise<number> {
  if (!keys.length || !isR2Configured()) return 0;
  const client = getR2Client();
  const bucket = R2_BUCKET();
  let deleted = 0;
  for (let i = 0; i < keys.length; i += 1000) {
    const batch = keys.slice(i, i + 1000);
    const res = await client.send(
      new DeleteObjectsCommand({
        Bucket: bucket,
        Delete: { Objects: batch.map((Key) => ({ Key })), Quiet: true },
      }),
    );
    deleted += batch.length - (res.Errors?.length ?? 0);
  }
  return deleted;
}

export async function deletePrefix(prefix: string): Promise<number> {
  const keys = await listKeys(prefix);
  return deleteKeys(keys);
}

// Public URL → R2 key. Custom CDN alanı da olsa pathname key'i verir.
export function keyFromUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const base = (process.env.R2_PUBLIC_URL ?? "").replace(/\/+$/, "");
  if (base && url.startsWith(base + "/")) return url.slice(base.length + 1);
  try {
    return new URL(url).pathname.replace(/^\/+/, "") || null;
  } catch {
    return null;
  }
}
