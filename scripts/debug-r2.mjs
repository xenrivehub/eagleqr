import { config } from "dotenv";
config({ path: ".env.local" });

import {
  S3Client,
  PutObjectCommand,
  GetBucketCorsCommand,
  HeadBucketCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "node:crypto";

const mask = (v) => (v ? `SET(len=${v.length})` : "UNSET");

console.log("=== ENV ===");
console.log("R2_ACCOUNT_ID:", process.env.R2_ACCOUNT_ID ? `${process.env.R2_ACCOUNT_ID.slice(0, 6)}…(len=${process.env.R2_ACCOUNT_ID.length})` : "UNSET");
console.log("R2_ACCESS_KEY_ID:", mask(process.env.R2_ACCESS_KEY_ID));
console.log("R2_SECRET_ACCESS_KEY:", mask(process.env.R2_SECRET_ACCESS_KEY));
console.log("R2_BUCKET:", process.env.R2_BUCKET ?? "UNSET");
console.log("R2_PUBLIC_URL:", process.env.R2_PUBLIC_URL ?? "UNSET");
console.log("endpoint:", `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`);

const client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
  requestChecksumCalculation: "WHEN_REQUIRED",
  responseChecksumValidation: "WHEN_REQUIRED",
});

const Bucket = process.env.R2_BUCKET;
const key = `businesses/_debug/${randomUUID()}.png`;
const png = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  "base64",
);

async function step(name, fn) {
  try {
    const r = await fn();
    console.log(`✅ ${name}: OK`, r ?? "");
  } catch (e) {
    console.log(`❌ ${name}: ${e?.name} - ${e?.message}`);
    if (e?.$metadata) console.log("   metadata:", JSON.stringify(e.$metadata));
  }
}

console.log("\n=== 1) HeadBucket (creds + bucket erişimi) ===");
await step("HeadBucket", () => client.send(new HeadBucketCommand({ Bucket })));

console.log("\n=== 2) Direct PutObject (SDK ile, presigned değil) ===");
await step("PutObject", async () => {
  await client.send(new PutObjectCommand({ Bucket, Key: key, Body: png, ContentType: "image/png" }));
  return key;
});

console.log("\n=== 3) Presigned PUT URL üret + sunucudan PUT (CORS yok) ===");
let uploadUrl;
await step("getSignedUrl", async () => {
  uploadUrl = await getSignedUrl(
    client,
    new PutObjectCommand({ Bucket, Key: `${key}.presigned`, ContentType: "image/png" }),
    { expiresIn: 60 },
  );
  return uploadUrl.split("?")[0];
});
if (uploadUrl) {
  await step("fetch PUT (presigned)", async () => {
    const res = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": "image/png" },
      body: png,
    });
    const body = res.ok ? "" : await res.text();
    return `HTTP ${res.status} ${res.statusText} ${body.slice(0, 300)}`;
  });
}

console.log("\n=== 4) Mevcut CORS politikası ===");
await step("GetBucketCors", async () => {
  const r = await client.send(new GetBucketCorsCommand({ Bucket }));
  return JSON.stringify(r.CORSRules);
});
