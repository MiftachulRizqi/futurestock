"use client";

import { RouteErrorState } from "@/components/states/route-error-state";

export default function DeadStockError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteErrorState
      title="Dead stock gagal dimuat"
      description="Sistem gagal menganalisis produk yang berpotensi menjadi stok tidak bergerak."
      reset={reset}
    />
  );
}