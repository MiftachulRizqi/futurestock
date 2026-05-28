"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { useState } from "react";
import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { dashboardNavigation } from "@/lib/constants/navigation";
import { cn } from "@/lib/utils";

type DashboardLayoutProps = {
  children: React.ReactNode;
  userName?: string;
  storeName?: string;
  role?: string;

  products?: {
    id: string;
    name: string;
  }[];
};

export function DashboardLayout({
  children,
  userName,
  storeName,
  role,
  products = [],
}: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] =
    useState(false);

  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_top_left,rgba(53,138,155,0.18),transparent_35%),radial-gradient(circle_at_top_right,rgba(53,138,155,0.14),transparent_30%),linear-gradient(180deg,var(--background)_0%,var(--background)_100%)]" />

      <AppSidebar />

      {mobileOpen ? (
        <MobileSidebar
          onClose={() => setMobileOpen(false)}
        />
      ) : null}

      <div className="relative z-10 lg:ml-72">
        <AppHeader
          onMenuClick={() =>
            setMobileOpen(true)
          }
          userName={userName}
          storeName={storeName}
          role={role}
          products={products}
        />

        <main className="min-h-[calc(100vh-80px)] p-4 md:p-6">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function MobileSidebar({
  onClose,
}: {
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-label="Tutup sidebar"
      />

      <aside className="relative h-full w-80 max-w-[85vw] border-r border-border bg-background p-5 shadow-2xl shadow-black/50">
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            onClick={onClose}
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-primary to-primary shadow-lg shadow-primary/20">
              <span className="font-bold text-primary-foreground">
                FS
              </span>
            </div>

            <div>
              <p className="text-lg font-bold tracking-tight text-foreground">
                FutureStock
              </p>

              <p className="text-xs text-primary">
                AI Inventory SaaS
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-border p-2 text-muted-foreground transition hover:bg-card/5 hover:text-foreground"
            aria-label="Tutup menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-8 space-y-2">
          {dashboardNavigation.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href ||
              pathname.startsWith(
                `${item.href}/`
              );

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                prefetch
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                  active
                    ? "bg-primary/10 text-primary shadow-[0_0_30px_rgba(53,138,155,0.12)]"
                    : "text-muted-foreground hover:bg-card/5 hover:text-foreground"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5",
                    active
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                />

                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </div>
  );
}