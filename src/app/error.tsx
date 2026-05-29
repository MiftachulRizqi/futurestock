"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-6">
      <div className="w-full max-w-xl rounded-3xl border border-border bg-card p-8 shadow-sm">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-destructive/10 text-destructive">
          <AlertTriangle className="h-10 w-10" />
        </div>

        <div className="mt-6 text-center">
          <h1 className="text-3xl font-bold text-foreground">
            Terjadi Kesalahan
          </h1>

          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            FutureStock mengalami gangguan sementara saat memproses data.
            Silakan coba kembali atau kembali ke dashboard.
          </p>

          {process.env.NODE_ENV === "development" && (
            <div className="mt-5 rounded-2xl border border-border bg-muted/30 p-4 text-left">
              <p className="mb-2 text-xs font-semibold text-muted-foreground">
                Development Error
              </p>

              <pre className="overflow-auto text-xs text-red-500">
                {error.message}
              </pre>
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => reset()}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            <RefreshCw className="h-4 w-4" />
            Coba Lagi
          </button>

          <Link
            href="/dashboard"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-semibold transition hover:bg-muted/40"
          >
            <Home className="h-4 w-4" />
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}