"use client";

import { RouteErrorState } from "@/components/states/route-error-state";

export default function LaporanError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteErrorState
      title="Laporan gagal dimuat"
      description="Sistem gagal memuat data laporan inventaris dan transaksi."
      reset={reset}
    />
  );
}