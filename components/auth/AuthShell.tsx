import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
};

export default function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: AuthShellProps) {
  return (
    <main className="relative flex flex-1 items-center justify-center overflow-hidden px-5 py-16">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand/20 blur-3xl" />
        <div className="absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-brand-soft blur-3xl" />
      </div>

      <div className="w-full max-w-md">
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/eagle-logo.webp"
              alt="Eagle QR"
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
            />
            <span className="font-display text-xl font-bold tracking-tight text-ink">
              Eagle QR
            </span>
          </Link>
          <h1 className="mt-6 font-display text-2xl font-bold text-ink">{title}</h1>
          <p className="mt-2 text-sm text-ink/60">{subtitle}</p>
        </div>

        <div className="mt-8 rounded-2xl border border-ink/10 bg-white p-6 shadow-sm sm:p-8">
          {children}
        </div>

        <p className="mt-6 text-center text-sm text-ink/60">{footer}</p>
      </div>
    </main>
  );
}
