import Link from "next/link";
import {
  Bot,
  Clock3,
  Package,
  ReceiptText,
  Sparkles,
  Trash2,
} from "lucide-react";

import { GlassPanel } from "@/components/shared/glass-panel";
import type { ActivityLog } from "@/services/activity-log-service";

type ActivityTimelineProps = {
  activities: ActivityLog[];
};

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  const visibleActivities = activities.slice(0, 5);

  return (
    <GlassPanel className="p-5">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Clock3 className="h-5 w-5" />
          </div>

          <div>
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">
              Activity Timeline
            </p>
            <h2 className="text-xl font-bold text-foreground">
              Aktivitas Terbaru
            </h2>
          </div>
        </div>

        <Link href="/aktivitas" className="text-sm font-medium text-primary">
          Lihat Semua
        </Link>
      </div>

      {visibleActivities.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-6 text-center">
          <p className="font-medium text-foreground">
            Belum ada aktivitas tercatat
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Aktivitas produk, transaksi, dan AI akan muncul di sini.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {visibleActivities.map((activity) => {
            const Icon = getActivityIcon(activity.entity_type, activity.action);

            return (
              <div
                key={activity.id}
                className="flex gap-3 rounded-2xl border border-border bg-card/40 p-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-semibold text-foreground">
                      {activity.title}
                    </p>

                    <span className="text-xs text-muted-foreground">
                      {formatRelativeTime(activity.created_at)}
                    </span>
                  </div>

                  {activity.description ? (
                    <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">
                      {activity.description}
                    </p>
                  ) : null}

                  <div className="mt-2 inline-flex rounded-full border border-border bg-background/40 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {activity.entity_type} · {activity.action}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </GlassPanel>
  );
}

function getActivityIcon(entityType: string, action: string) {
  if (entityType === "product") return action === "delete" ? Trash2 : Package;
  if (entityType === "sale") return ReceiptText;
  if (entityType === "ai_forecast") return Bot;
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