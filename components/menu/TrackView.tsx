"use client";

import { useEffect } from "react";

export default function TrackView({
  businessId,
  type,
  productId,
}: {
  businessId: string;
  type: "SCAN" | "VIEW";
  productId?: string;
}) {
  useEffect(() => {
    // Aynı oturumda aynı sayfayı tekrar saymamak için basit guard
    const key = `tracked:${type}:${productId ?? businessId}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");

    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessId, type, productId }),
      keepalive: true,
    }).catch(() => {});
  }, [businessId, type, productId]);

  return null;
}
