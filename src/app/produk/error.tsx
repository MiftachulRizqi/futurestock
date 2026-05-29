"use client";

import { RouteErrorState } from "@/components/states/route-error-state";

export default function ProdukError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteErrorState
      title="Produk gagal dimuat"
      description="Sistem gagal memuat data produk. Periksa koneksi atau coba refresh halaman."
      reset={reset}
    />
  );
}