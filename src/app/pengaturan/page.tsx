"use client";

import { Building2, User } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { GlassPanel } from "@/components/shared/glass-panel";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/app/login/actions";

export default function PengaturanPage() {
  const [logoutOpen, setLogoutOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <GlassPanel className="p-6">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">
            Workspace Settings
          </p>
          <h1 className="mt-2 text-3xl font-bold text-foreground">Pengaturan</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Lihat akun yang sedang login, toko aktif, dan role user.
          </p>
        </GlassPanel>

        <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
          <GlassPanel className="p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                <User className="h-8 w-8" />
              </div>

              <div>
                <p className="text-lg font-semibold text-foreground">User</p>
                <p className="text-sm text-muted-foreground">user@example.com</p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <InfoItem label="Role" value="owner" />
              <InfoItem label="Store ID" value="store-123" />
              <InfoItem label="User ID" value="user-123" />
            </div>

            <button
              type="button"
              onClick={() => setLogoutOpen(true)}
              className="mt-6 h-11 w-full rounded-xl border border-destructive/20 bg-destructive/10 font-semibold text-destructive transition hover:bg-destructive/20"
            >
              Logout
            </button>
          </GlassPanel>

          <GlassPanel className="p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                <Building2 className="h-8 w-8" />
              </div>

              <div>
                <p className="text-lg font-semibold text-foreground">
                  FutureStock Store
                </p>
                <p className="text-sm text-muted-foreground">
                  UMKM Retail · Indonesia
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <InfoItem label="Nama Toko" value="FutureStock Store" />
              <InfoItem label="Jenis Usaha" value="UMKM Retail" />
              <InfoItem label="Kota" value="Jakarta" />
              <InfoItem label="Negara" value="Indonesia" />
              <InfoItem label="Alamat" value="Jl. Contoh No. 123" className="md:col-span-2" />
            </div>
          </GlassPanel>
        </section>
      </div>

      {logoutOpen &&
        createPortal(
          <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-2xl">
              <h3 className="text-lg font-bold text-foreground">Konfirmasi Logout</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Apakah Anda yakin ingin keluar dari akun?
              </p>
              <div className="mt-4 flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setLogoutOpen(false)}
                >
                  Batal
                </Button>
                <form action={logoutAction}>
                  <Button type="submit" variant="destructive" className="bg-destructive text-white hover:bg-destructive/90">
                    Ya, Keluar
                  </Button>
                </form>
              </div>
            </div>
          </div>,
          document.body
        )}
    </DashboardLayout>
  );
}

function InfoItem({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-border bg-card/50 p-4 ${className}`}
    >
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-2 break-all text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}