import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Eagle Menu",
    short_name: "Eagle Menu",
    description: "Restoranlar için video, AR ve çok dilli QR dijital menü platformu.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbf9f3",
    theme_color: "#f5b70c",
    lang: "tr",
    icons: [
      { src: "/eagle-logo.webp", sizes: "any", type: "image/webp" },
    ],
  };
}
