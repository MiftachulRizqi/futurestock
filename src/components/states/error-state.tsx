"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

type ErrorStateProps = {
  title?: string;
  description?: string;
  reset?: () => void;
  className?: string;
};

export function ErrorState({
  title = "Terjadi kesalahan",
  description = "Sistem gagal memuat data. Silakan coba lagi.",
  reset,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[360px] flex-col items-center justify-center rounded-3xl border border-red-500/15 bg-red-500/5 p-8 text-center",
        className
      )}
    >
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
        <AlertTriangle className="h-8 w-8" />
      </div>

      <h3 className="text-xl font-bold text-white">{title}</h3>

      <p className="mt-3 max-w-md text-sm leading-7 text-white/60">
        {description}
      </p>

      {reset ? (
        <button
          type="button"
          onClick={reset}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90"
        >
          <RefreshCw className="h-4 w-4" />
          Coba Lagi
        </button>
      ) : null}
    </div>
  );
}