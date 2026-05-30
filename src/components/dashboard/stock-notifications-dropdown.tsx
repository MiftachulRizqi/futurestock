"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertOctagon,
  AlertTriangle,
  BellRing,
  CheckCircle2,
  Eye,
  Flame,
  PackagePlus,
  Radio,
  RotateCw,
  X,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

import {
  type StockNotification,
  type StockNotificationType,
} from "@/lib/helpers/stock-notifications";
import { cn } from "@/lib/utils";

type StockNotificationsDropdownProps = {
  notifications: StockNotification[];
  onClose: () => void;
};

type NotificationStyle = {
  icon: LucideIcon;
  label: string;
  wrapper: string;
  iconClass: string;
  badge: string;
  action: string;
};

const notificationStyles: Record<StockNotificationType, NotificationStyle> = {
  "out-of-stock": {
    icon: AlertOctagon,
    label: "Habis",
    wrapper: "border-destructive/30 bg-destructive/5",
    iconClass: "bg-destructive/15 text-destructive",
    badge: "border-destructive/30 bg-destructive/15 text-destructive",
    action: "border-destructive/25 bg-destructive/10 text-destructive hover:bg-destructive/20",
  },
  "low-stock": {
    icon: AlertTriangle,
    label: "Hampir habis",
    wrapper: "border-amber-400/30 bg-amber-400/5",
    iconClass: "bg-amber-400/15 text-amber-600",
    badge: "border-amber-400/30 bg-amber-400/15 text-amber-600",
    action: "border-amber-400/25 bg-amber-400/10 text-amber-600 hover:bg-amber-400/20",
  },
  "high-demand": {
    icon: Flame,
    label: "Permintaan tinggi",
    wrapper: "border-primary/20 bg-background text-primary shadow-sm",
    iconClass: "bg-primary/10 text-primary",
    badge: "border-primary/20 bg-primary/10 text-primary",
    action: "border-primary/25 bg-primary/10 text-primary hover:bg-primary/20",
  },
  "restock-soon": {
    icon: RotateCw,
    label: "Restock segera",
    wrapper: "border-violet-400/30 bg-violet-400/5",
    iconClass: "bg-violet-400/15 text-violet-600",
    badge: "border-violet-400/30 bg-violet-400/15 text-violet-600",
    action: "border-violet-400/25 bg-violet-400/10 text-violet-600 hover:bg-violet-400/20",
  },
  safe: {
    icon: CheckCircle2,
    label: "Aman",
    wrapper: "border-emerald-400/30 bg-emerald-400/5",
    iconClass: "bg-emerald-400/15 text-emerald-600",
    badge: "border-emerald-400/30 bg-emerald-400/15 text-emerald-600",
    action: "border-emerald-400/25 bg-emerald-400/10 text-emerald-600 hover:bg-emerald-400/20",
  },
  "ai-insight": {
    icon: BellRing,
    label: "AI Insight",
    wrapper: "border-primary/30 bg-primary/5 text-primary",
    iconClass: "bg-primary/15 text-primary",
    badge: "border-primary/30 bg-primary/15 text-primary",
    action: "border-primary/25 bg-primary/10 text-primary hover:bg-primary/20",
  },
  "top-selling": {
    icon: Flame,
    label: "Penjualan tinggi",
    wrapper: "border-primary/20 bg-background text-primary shadow-sm",
    iconClass: "bg-primary/10 text-primary",
    badge: "border-primary/20 bg-primary/10 text-primary",
    action: "border-primary/25 bg-primary/10 text-primary hover:bg-primary/20",
  },
};

export function StockNotificationsDropdown({
  notifications,
  onClose,
}: StockNotificationsDropdownProps) {
  const visibleNotifications = notifications.slice(0, 5);

  return (
    <div className="fixed right-4 top-20 z-50 w-[min(420px,calc(100vw-2rem)]">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="rounded-3xl border border-border bg-card p-5 shadow-2xl"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <BellRing className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary/70">
                  Smart Alerts
                </p>
                <h2 className="mt-1 text-xl font-bold text-foreground">
                  Notifikasi Stok
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
              aria-label="Tutup notifikasi"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>{visibleNotifications.length} notifikasi aktif</span>
          </div>

          <div className="mt-4 space-y-3 max-h-[400px] overflow-y-auto">
            {visibleNotifications.length === 0 ? (
              <div className="flex min-h-32 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 p-6 text-center">
                <CheckCircle2 className="h-10 w-10 text-primary/50" />
                <p className="mt-3 text-sm font-medium text-foreground">
                  Semua stok berada di zona aman
                </p>
                <p className="mt-1 max-w-xs text-xs leading-5 text-muted-foreground">
                  Alert stok baru akan muncul otomatis ketika ada produk yang perlu
                  dipantau.
                </p>
              </div>
            ) : (
              visibleNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                />
              ))
            )}
          </div>

          {notifications.length > 5 && (
            <div className="mt-4 border-t border-border pt-4">
              <Link
                href="/inventaris"
                onClick={onClose}
                className="inline-flex text-sm font-medium text-primary"
              >
                Lihat semua notifikasi stok
              </Link>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function NotificationItem({
  notification,
}: {
  notification: StockNotification;
}) {
  const style = notificationStyles[notification.type];
  const Icon = style.icon;
  const detailHref = notification.productId
    ? `/produk/${notification.productId}`
    : "/produk";

  return (
    <div
      className={cn(
        "rounded-2xl border p-4 transition",
        style.wrapper
      )}
    >
      <div className="flex gap-3">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
            style.iconClass
          )}
        >
          <Icon className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">
                {notification.title}
              </p>
              <p className="mt-0.5 truncate text-sm font-medium text-muted-foreground">
                {notification.productName}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11px] font-semibold",
                  style.badge
                )}
              >
                {style.label}
              </span>
            </div>
          </div>

          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {notification.message}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span>{notification.timestamp}</span>
            {typeof notification.stock === "number" ? (
              <span>Stok: {notification.stock}</span>
            ) : null}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Link
              href={detailHref}
              onClick={() => {}}
              className="inline-flex h-9 items-center gap-2 rounded-xl border border-border bg-muted/30 px-3 text-xs font-semibold text-foreground transition hover:bg-muted"
            >
              <Eye className="h-4 w-4" />
              Lihat Detail
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
