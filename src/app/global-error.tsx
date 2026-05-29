"use client";

import Link from "next/link";
import { AlertOctagon, Home, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="flex min-h-screen items-center justify-center bg-background p-6">
          <div className="w-full max-w-xl rounded-3xl border border-border bg-card p-8 shadow-sm">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-destructive/10 text-destructive">
              <AlertOctagon className="h-12 w-12" />
            </div>

            <div className="mt-6 text-center">
              <h1 className="text-4xl font-bold text-foreground">
                Sistem Mengalami Gangguan
              </h1>

              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                FutureStock tidak dapat memuat aplikasi dengan normal.
                Silakan refresh halaman atau kembali ke dashboard.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => reset()}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
              >
                <RefreshCw className="h-4 w-4" />
                Reload
              </button>

              <Link
                href="/dashboard"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-semibold"
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}