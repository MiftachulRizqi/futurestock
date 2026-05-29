"use client";

import { RouteErrorState } from "@/components/states/route-error-state";

export default function AnalitikError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteErrorState
      title="Analitik gagal dimuat"
      description="Sistem gagal memuat grafik penjualan, revenue, atau insight performa bisnis."
      reset={reset}
    />
  );
}