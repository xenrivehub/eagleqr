import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Docker/Coolify için bağımsız (standalone) çıktı — küçük runtime imajı
  output: "standalone",
  // Menü fotoğrafları base64 olarak server action'a gönderilir (AI menü okuma)
  experimental: { serverActions: { bodySizeLimit: "10mb" } },
  // Güvenlik HTTP başlıkları (clickjacking, MIME-sniffing, referrer sızıntısı, HSTS)
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
          // AR/3D için kamera self'e açık; mikrofon/konum kapalı
          { key: "Permissions-Policy", value: "camera=(self), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
