import { S3Client } from "@aws-sdk/client-s3";

export function isR2Configured(): boolean {
  return Boolean(
    process.env.R2_ACCOUNT_ID &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      process.env.R2_BUCKET &&
      process.env.R2_PUBLIC_URL,
  );
}

export function getR2Client(): S3Client {
  return new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
    },
    // Yeni SDK varsayılan olarak presigned URL'e CRC32 checksum ekler;
    // R2 + tarayıcı PUT akışını bozar. Sadece gerektiğinde hesapla.
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
  });
}

export const R2_BUCKET = (): string => process.env.R2_BUCKET as string;

export function publicUrl(key: string): string {
  const base = (process.env.R2_PUBLIC_URL as string).replace(/\/+$/, "");
  return `${base}/${key}`;
}
