"use client";

import { useEffect, useState } from "react";
import {
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  Database,
  LineChart,
  PackageSearch,
  Sparkles,
} from "lucide-react";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { GlassPanel } from "@/components/shared/glass-panel";

const aiSteps = [
  {
    icon: Database,
    label: "Membaca data produk dan transaksi",
  },
  {
    icon: BrainCircuit,
    label: "Menganalisis pola permintaan",
  },
  {
    icon: LineChart,
    label: "Menghitung forecast stok",
  },
  {
    icon: PackageSearch,
    label: "Mendeteksi overstock dan dead stock",
  },
];

export function AiForecastLoading() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveStep((prev) => (prev + 1) % aiSteps.length);
    }, 1200);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <GlassPanel className="relative overflow-hidden p-6">
          <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                Gemini AI Forecast Engine
              </div>

              <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground">
                Menyiapkan Prediksi AI
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                FutureStock sedang menganalisis histori penjualan, stok produk,
                risiko dead stock, dan peluang overstock.
              </p>
            </div>

            <div className="relative flex h-24 w-24 items-center justify-center rounded-[2rem] bg-primary/10 text-primary">
              <div className="absolute inset-0 animate-ping rounded-[2rem] bg-primary/10" />
              <BrainCircuit className="relative h-12 w-12 animate-pulse" />
            </div>
          </div>
        </GlassPanel>

        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <GlassPanel className="p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <BrainCircuit className="h-6 w-6" />
              </div>

              <div>
                <h2 className="font-bold text-foreground">AI sedang bekerja</h2>
                <p className="text-sm text-muted-foreground">
                  Proses forecast sedang berjalan.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {aiSteps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === activeStep;
                const isDone = index < activeStep;

                return (
                  <div
                    key={step.label}
                    className={`rounded-2xl border p-4 transition-all duration-300 ${
                      isActive
                        ? "border-primary/25 bg-primary/10"
                        : "border-border bg-card/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                          isDone
                            ? "bg-emerald-50 text-emerald-600"
                            : isActive
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <Icon className="h-5 w-5" />
                        )}
                      </div>

                      <p className="font-semibold text-foreground">
                        {step.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassPanel>

          <GlassPanel className="overflow-hidden p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <div className="h-5 w-48 animate-pulse rounded-full bg-muted" />
                <div className="mt-3 h-4 w-72 max-w-full animate-pulse rounded-full bg-muted" />
              </div>

              <div className="h-10 w-28 animate-pulse rounded-xl bg-muted" />
            </div>

            <div className="flex h-72 items-end gap-3 overflow-hidden rounded-3xl border border-border bg-card/40 p-5">
              {[42, 68, 54, 84, 62, 76, 92, 58, 73, 88].map(
                (height, index) => (
                  <div key={index} className="flex flex-1 items-end">
                    <div
                      className="w-full animate-pulse rounded-t-2xl bg-primary/25"
                      style={{ height: `${height}%` }}
                    />
                  </div>
                )
              )}
            </div>
          </GlassPanel>
        </div>

        <section className="grid gap-4 md:grid-cols-3">
          <LoadingMetricCard icon={<BarChart3 className="h-5 w-5" />} />
          <LoadingMetricCard icon={<PackageSearch className="h-5 w-5" />} />
          <LoadingMetricCard icon={<Sparkles className="h-5 w-5" />} />
        </section>
      </div>
    </DashboardLayout>
  );
}

function LoadingMetricCard({ icon }: { icon: React.ReactNode }) {
  return (
    <GlassPanel className="p-5">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        {icon}
      </div>

      <div className="mt-5 h-4 w-32 animate-pulse rounded-full bg-muted" />
      <div className="mt-3 h-3 w-44 max-w-full animate-pulse rounded-full bg-muted" />
    </GlassPanel>
  );
}