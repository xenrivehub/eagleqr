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

type UploadFolder = "products" | "covers" | "logos";
const FOLDERS: UploadFolder[] = ["products", "covers", "logos"];

// Video (Pro/Max) ve 3D model (Max) yükleme — plan/kotaya göre kapı kontrolü
const ALLOWED_VIDEO_TYPES: Record<string, string> = {
  "video/mp4": "mp4",
  "video/webm": "webm",
};
const ALLOWED_MODEL_TYPES: Record<string, string> = {
  "model/gltf-binary": "glb",
};

type MediaKind = "video" | "model";

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

  const safeFolder = FOLDERS.includes(folder) ? folder : "products";
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

// Video / 3D model için presigned URL. Planın o özelliği açık olması gerekir
// (efektif limit > 0). Adet limiti ürün kaydında (createProduct/updateProduct)
// ayrıca kontrol edilir.
export async function createMediaUploadUrl(
  kind: MediaKind,
  contentType: string,
): Promise<UploadUrlResult> {
  const session = await auth();
  const businessId = session?.user?.businessId;
  if (!businessId) return { success: false, error: "Yetkisiz erişim." };

  if (!isR2Configured()) {
    return { success: false, error: "Medya yükleme henüz yapılandırılmadı." };
  }

  const { getMediaEntitlements } = await import("@/lib/queries/entitlements");
  const ent = await getMediaEntitlements(businessId);

  if (kind === "video" && !ent.video.allowed) {
    return { success: false, error: "Video yükleme planınızda kapalı." };
  }
  if (kind === "model" && !ent.ar.allowed) {
    return { success: false, error: "AR/3D yükleme planınızda kapalı." };
  }

  const map = kind === "video" ? ALLOWED_VIDEO_TYPES : ALLOWED_MODEL_TYPES;
  const ext = map[contentType];
  if (!ext) {
    return {
      success: false,
      error:
        kind === "video"
          ? "Yalnızca MP4 veya WEBM video yükleyebilirsiniz."
          : "Yalnızca GLB (.glb) 3D model yükleyebilirsiniz.",
    };
  }

  const folder = kind === "video" ? "videos" : "models";
  const key = `businesses/${businessId}/${folder}/${randomUUID()}.${ext}`;
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET(),
    Key: key,
    ContentType: contentType,
  });

  try {
    const uploadUrl = await getSignedUrl(getR2Client(), command, {
      expiresIn: 120,
    });
    return { success: true, uploadUrl, publicUrl: publicUrl(key) };
  } catch {
    return { success: false, error: "Yükleme adresi oluşturulamadı." };
  }
}
