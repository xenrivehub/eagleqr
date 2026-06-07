import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Menü fotoğrafları base64 olarak server action'a gönderilir (AI menü okuma)
  experimental: { serverActions: { bodySizeLimit: "10mb" } },
};

export default nextConfig;
