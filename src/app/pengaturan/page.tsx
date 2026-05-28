import { Bell, Building2, Shield, User } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { GlassPanel } from "@/components/shared/glass-panel";
import { getCurrentProfile } from "@/services/profile-service";
import { getCurrentStore } from "@/services/store-service";
import { logoutAction } from "@/app/login/actions";

export default async function PengaturanPage() {
  const currentProfile = await getCurrentProfile();
  const currentStore = await getCurrentStore();

  const userName =
    currentProfile?.profile?.full_name ||
    currentProfile?.user?.email ||
    "User";

  const email = currentProfile?.profile?.email || currentProfile?.user?.email;
  const store = currentStore?.store;
  const role = currentStore?.role ?? "owner";

  return (
    <DashboardLayout
      userName={userName}
      storeName={store?.name ?? "FutureStock Store"}
      role={role}
    >
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
                <p className="text-lg font-semibold text-foreground">{userName}</p>
                <p className="text-sm text-muted-foreground">{email}</p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <InfoItem label="Role" value={role} />
              <InfoItem label="Store ID" value={store?.id ?? "-"} />
              <InfoItem label="User ID" value={currentProfile?.user?.id ?? "-"} />
            </div>

            <form action={logoutAction} className="mt-6">
              <button
                type="submit"
                className="h-11 w-full rounded-xl border border-destructive/20 bg-destructive/10 font-semibold text-destructive transition hover:bg-destructive/20"
              >
                Logout
              </button>
            </form>
          </GlassPanel>

          <GlassPanel className="p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                <Building2 className="h-8 w-8" />
              </div>

              <div>
                <p className="text-lg font-semibold text-foreground">
                  {store?.name ?? "FutureStock Store"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {store?.business_type ?? "UMKM Retail"} ·{" "}
                  {store?.country ?? "Indonesia"}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <InfoItem label="Nama Toko" value={store?.name ?? "-"} />
              <InfoItem
                label="Jenis Usaha"
                value={store?.business_type ?? "-"}
              />
              <InfoItem label="Kota" value={store?.city ?? "-"} />
              <InfoItem label="Negara" value={store?.country ?? "-"} />
              <InfoItem
                label="Alamat"
                value={store?.address ?? "-"}
                className="md:col-span-2"
              />
            </div>
          </GlassPanel>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <SettingsCard icon={User} title="Profil Pengguna" />
          <SettingsCard icon={Bell} title="Notifikasi" />
          <SettingsCard icon={Shield} title="Keamanan" />
        </section>
      </div>
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

function SettingsCard({
  icon: Icon,
  title,
}: {
  icon: typeof User;
  title: string;
}) {
  return (
    <button
      type="button"
      className="flex items-center gap-3 rounded-2xl border border-border bg-card/[0.06] p-4 text-left text-sm text-muted-foreground transition hover:bg-card/10 hover:text-foreground"
    >
      <Icon className="h-5 w-5 text-primary" />
      {title}
    </button>
  );
}