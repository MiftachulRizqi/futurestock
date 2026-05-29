"use client";

import { RouteErrorState } from "@/components/states/route-error-state";

export default function InventarisError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteErrorState
      title="Inventaris gagal dimuat"
      description="Sistem gagal membaca kondisi stok dan inventaris produk."
      reset={reset}
    />
  );
}