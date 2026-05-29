"use client";

import { RouteErrorState } from "@/components/states/route-error-state";

export default function TransaksiError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteErrorState
      title="Transaksi gagal dimuat"
      description="Sistem gagal memuat histori transaksi penjualan. Coba lagi beberapa saat."
      reset={reset}
    />
  );
}