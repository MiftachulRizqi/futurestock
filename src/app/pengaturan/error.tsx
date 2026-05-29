"use client";

import { RouteErrorState } from "@/components/states/route-error-state";

export default function PengaturanError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteErrorState
      title="Pengaturan gagal dimuat"
      description="Sistem gagal memuat preferensi akun atau pengaturan workspace."
      reset={reset}
    />
  );
}