"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { trackEvent } from "@/lib/track";

// "Yanında iyi gider" önerisi linki — tıklamayı PAIR_CLICK olarak kaydeder.
export default function PairLink({
  href, businessId, productId, menuId, className, children,
}: {
  href: string;
  businessId: string;
  productId: string;
  menuId?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={className} onClick={() => trackEvent({ businessId, type: "PAIR_CLICK", productId, menuId })}>
      {children}
    </Link>
  );
}
