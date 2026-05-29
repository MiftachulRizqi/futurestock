"use client";

import { useFormStatus } from "react-dom";
import { RefreshCw, Sparkles } from "lucide-react";

export function GenerateForecastSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? (
        <>
          <RefreshCw className="h-4 w-4 animate-spin" />
          Generate ulang...
        </>
      ) : (
        <>
          <Sparkles className="h-4 w-4" />
          Generate Ulang Forecast
        </>
      )}
    </button>
  );
}