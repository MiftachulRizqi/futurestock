"use client";

import { RouteErrorState } from "@/components/states/route-error-state";

export default function PrediksiAIError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteErrorState
      title="Prediksi AI gagal dimuat"
      description="Sistem gagal memuat hasil forecast AI. Coba ulangi setelah beberapa saat."
      reset={reset}
    />
  );
}