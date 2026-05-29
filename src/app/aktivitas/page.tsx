import {
  Bot,
  Clock3,
  Package,
  ReceiptText,
  Sparkles,
  Trash2,
} from "lucide-react";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { GlassPanel } from "@/components/shared/glass-panel";
import { getRecentActivityLogs } from "@/services/activity-log-service";
import type { ActivityLog } from "@/services/activity-log-service";

export default async function AktivitasPage() {
  const activities = await getRecentActivityLogs(50);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <GlassPanel className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Clock3 className="h-7 w-7" />
            </div>

            <div>
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">
                Activity Log
              </p>

              <h1 className="mt-2 text-3xl font-bold text-foreground">
                Riwayat Aktivitas
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Pantau seluruh aktivitas penting seperti produk dibuat,
                transaksi dicatat, transaksi dihapus, dan forecast AI
                diperbarui.
              </p>
            </div>
          </div>
        </GlassPanel>

        <GlassPanel className="p-5">
          {activities.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center">
              <p className="font-semibold text-foreground">
                Belum ada aktivitas
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Aktivitas akan muncul setelah Anda membuat produk, transaksi,
                atau generate forecast AI.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {activities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          )}
        </GlassPanel>
      </div>
    </DashboardLayout>
  );
}

function ActivityItem({ activity }: { activity: ActivityLog }) {
  const Icon = getActivityIcon(activity.entity_type, activity.action);

  return (
    <div className="flex gap-4 rounded-2xl border border-border bg-card/40 p-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
          <p className="font-semibold text-foreground">{activity.title}</p>

          <span className="text-xs text-muted-foreground">
            {formatDate(activity.created_at)}
          </span>
        </div>

        {activity.description ? (
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {activity.description}
          </p>
        ) : null}

        <div className="mt-3 flex flex-wrap gap-2">
          <Badge>{activity.entity_type}</Badge>
          <Badge>{activity.action}</Badge>
          <Badge>{formatRelativeTime(activity.created_at)}</Badge>
        </div>
      </div>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-border bg-background/40 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
      {children}
    </span>
  );
}

function getActivityIcon(entityType: string, action: string) {
  if (entityType === "product") {
    return action === "delete" ? Trash2 : Package;
  }

  if (entityType === "sale") {
    return ReceiptText;
  }

  if (entityType === "ai_forecast") {
    return Bot;
  }

  return Sparkles;
}

function formatRelativeTime(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return "Baru saja";
  if (minutes < 60) return `${minutes} menit lalu`;
  if (hours < 24) return `${hours} jam lalu`;
  return `${days} hari lalu`;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}