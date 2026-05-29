"use client";

import { RouteErrorState } from "@/components/states/route-error-state";

export default function DashboardError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteErrorState
      title="Dashboard gagal dimuat"
      description="Sistem gagal memuat ringkasan inventaris, transaksi, atau forecast AI."
      reset={reset}
    />
  );
}