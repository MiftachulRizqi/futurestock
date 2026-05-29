"use client";

import { useEffect, useState } from "react";
import { BrainCircuit, Sparkles } from "lucide-react";

const steps = [
  "Membaca histori penjualan...",
  "Menganalisis pola permintaan...",
  "Menghitung kebutuhan stok...",
  "Menyusun rekomendasi inventory...",
];

export function AILoadingState() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 1400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-3xl border border-primary/15 bg-primary/5 p-6">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <BrainCircuit className="h-7 w-7 animate-pulse" />
      </div>

      <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
        <Sparkles className="h-4 w-4" />
        AI Forecasting
      </div>

      <h3 className="mt-3 text-xl font-bold text-white">
        FutureStock sedang menganalisis data
      </h3>

      <div className="mt-5 space-y-3">
        {steps.map((step, index) => (
          <div
            key={step}
            className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition ${
              index === activeStep
                ? "border-primary/30 bg-primary/10 text-white"
                : "border-white/10 bg-white/[0.03] text-white/50"
            }`}
          >
            <div
              className={`h-2.5 w-2.5 rounded-full ${
                index === activeStep ? "bg-primary" : "bg-white/20"
              }`}
            />
            {step}
          </div>
        ))}
      </div>
    </div>
  );
}