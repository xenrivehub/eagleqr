"use server";

import { randomUUID } from "node:crypto";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { auth } from "@/auth";
import { getR2Client, R2_BUCKET, publicUrl, isR2Configured } from "@/lib/r2";

const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

type UploadUrlResult =
  | { success: true; uploadUrl: string; publicUrl: string }
  | { success: false; error: string };

type UploadFolder = "products" | "covers";

export async function createImageUploadUrl(
  contentType: string,
  folder: UploadFolder = "products",
): Promise<UploadUrlResult> {
  const session = await auth();
  const businessId = session?.user?.businessId;
  if (!businessId) return { success: false, error: "Yetkisiz erişim." };

  if (!isR2Configured()) {
    return {
      success: false,
      error:
        "Görsel yükleme henüz yapılandırılmadı. (.env.local içine R2 ayarları eklenmeli.)",
    };
  }

  const ext = ALLOWED_IMAGE_TYPES[contentType];
  if (!ext) {
    return { success: false, error: "Yalnızca JPG, PNG veya WEBP yükleyebilirsiniz." };
  }

  const safeFolder = folder === "covers" ? "covers" : "products";
  const key = `businesses/${businessId}/${safeFolder}/${randomUUID()}.${ext}`;
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET(),
    Key: key,
    ContentType: contentType,
  });

  try {
    const uploadUrl = await getSignedUrl(getR2Client(), command, {
      expiresIn: 60,
    });
    return { success: true, uploadUrl, publicUrl: publicUrl(key) };
  } catch {
    return { success: false, error: "Yükleme adresi oluşturulamadı." };
  }
}
