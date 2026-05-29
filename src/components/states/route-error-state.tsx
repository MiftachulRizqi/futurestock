"use client";

import Link from "next/link";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { GlassPanel } from "@/components/shared/glass-panel";

type RouteErrorStateProps = {
  title?: string;
  description?: string;
  reset?: () => void;
};

export function RouteErrorState({
  title = "Halaman gagal dimuat",
  description = "Terjadi kesalahan saat memuat data. Silakan coba refresh halaman.",
  reset,
}: RouteErrorStateProps) {
  return (
    <DashboardLayout>
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <GlassPanel className="w-full max-w-2xl overflow-hidden p-0">
          <div className="relative p-8 text-center">
            <div className="absolute left-0 top-0 h-40 w-40 rounded-full bg-red-500/10 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />

            <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-red-500/15 bg-red-500/10 text-red-500">
              <AlertTriangle className="h-10 w-10" />
            </div>

            <h1 className="relative mt-7 text-3xl font-bold tracking-tight text-foreground">
              {title}
            </h1>

            <p className="relative mx-auto mt-3 max-w-md text-sm leading-7 text-muted-foreground">
              {description}
            </p>

            <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              {reset ? (
                <Button type="button" onClick={reset}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Coba Lagi
                </Button>
              ) : null}

              <Button asChild variant="outline">
                <Link href="/dashboard">
                  <Home className="mr-2 h-4 w-4" />
                  Kembali ke Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </GlassPanel>
      </div>
    </DashboardLayout>
  );
}