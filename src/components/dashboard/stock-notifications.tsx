"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertOctagon,
  AlertTriangle,
  BellRing,
  Bot,
  CheckCircle2,
  Eye,
  Flame,
  PackagePlus,
  Radio,
  RotateCw,
  X,
  type LucideIcon,
} from "lucide-react";

import {
  type StockNotification,
  type StockNotificationType,
} from "@/lib/helpers/stock-notifications";
import { cn } from "@/lib/utils";

type StockNotificationsProps = {
  notifications: StockNotification[];
  isLoading?: boolean;
  enableRealtime?: boolean;
  className?: string;
};

type NotificationStyle = {
  icon: LucideIcon;
  label: string;
  wrapper: string;
  iconClass: string;
  badge: string;
  action: string;
};

type ToastNotification = StockNotification & {
  toastId: string;
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
    icon: Bot,
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

export function StockNotifications({
  notifications,
  isLoading = false,
  enableRealtime = true,
  className,
}: StockNotificationsProps) {
  const [liveNotifications, setLiveNotifications] =
    useState<StockNotification[]>(notifications);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(
    () => new Set()
  );
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [lastUpdated, setLastUpdated] = useState("Baru saja");
  const liveNotificationsRef = useRef(liveNotifications);

  useEffect(() => {
    liveNotificationsRef.current = liveNotifications;
  }, [liveNotifications]);

  const pushToast = useCallback((notification: StockNotification) => {
    const toastId = `${notification.id}-${Date.now()}`;

    setToasts((currentToasts) => [
      { ...notification, toastId },
      ...currentToasts,
    ].slice(0, 3));

    window.setTimeout(() => {
      setToasts((currentToasts) =>
        currentToasts.filter((toast) => toast.toastId !== toastId)
      );
    }, 4200);
  }, []);

  useEffect(() => {
    if (!enableRealtime || notifications.length === 0) {
      return;
    }

    const startupTimer = window.setTimeout(() => {
      const firstAlert =
        liveNotificationsRef.current.find(
          (notification) => notification.type !== "safe"
        ) ?? liveNotificationsRef.current[0];

      if (firstAlert) {
        pushToast(firstAlert);
      }
    }, 750);

    const interval = window.setInterval(() => {
      const source =
        liveNotificationsRef.current.find(
          (notification) =>
            notification.type !== "safe" &&
            typeof notification.stock === "number"
        ) ??
        liveNotificationsRef.current.find(
          (notification) => notification.type !== "safe"
        );

      if (!source) {
        return;
      }

      const updated = getRealtimeNotificationUpdate(source);

      setLiveNotifications((currentNotifications) =>
        currentNotifications.map((notification) =>
          notification.id === source.id ? updated : notification
        )
      );
      setLastUpdated("Baru saja");
      pushToast(updated);
    }, 12000);

    return () => {
      window.clearTimeout(startupTimer);
      window.clearInterval(interval);
    };
  }, [enableRealtime, notifications.length, pushToast]);

  const visibleNotifications = useMemo(
    () =>
      [...liveNotifications]
        .filter((notification) => !dismissedIds.has(notification.id))
        .sort((first, second) => first.priority - second.priority),
    [dismissedIds, liveNotifications]
  );

  const dashboardNotifications = visibleNotifications.slice(0, 5);

  function dismissNotification(id: string) {
    setDismissedIds((currentIds) => {
      const nextIds = new Set(currentIds);
      nextIds.add(id);
      return nextIds;
    });
  }

  function handleRestock(notification: StockNotification) {
    const restockedNotification: StockNotification = {
      ...notification,
      type: "safe",
      title: "Restock Dijadwalkan",
      message: `${notification.productName} masuk antrean pembelian stok.`,
      stock:
        typeof notification.stock === "number"
          ? notification.stock + 20
          : notification.stock,
      priority: 6,
      timestamp: "Baru saja",
    };

    setLiveNotifications((currentNotifications) =>
      currentNotifications.map((item) =>
        item.id === notification.id ? restockedNotification : item
      )
    );
    setLastUpdated("Baru saja");
    pushToast(restockedNotification);
  }

  if (isLoading) {
    return <StockNotificationsSkeleton className={className} />;
  }

  return (
    <>
      <section
        className={cn(
          "rounded-3xl border border-border bg-card p-5 shadow-sm",
          className
        )}
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
                Notifikasi Stok Otomatis
              </h2>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <span className="rounded-full border border-destructive/20 bg-destructive/10 px-3 py-1 text-xs font-semibold text-destructive">
              {visibleNotifications.length} aktif
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Radio className="h-3.5 w-3.5" />
              Live
            </span>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>Auto update stok</span>
          <span className="h-1 w-1 rounded-full bg-border" />
          <span>Sinkron {lastUpdated}</span>
        </div>

        <div className="mt-5 space-y-3">
         {visibleNotifications.length > 5 ? (
            <div className="mt-4 border-t border-border pt-4">
              <Link
                href="/inventaris"
                className="inline-flex text-sm font-medium text-primary"
              >
                Lihat semua notifikasi stok
              </Link>
            </div>
          ) : null}
          {visibleNotifications.length === 0 ? (
            <StockNotificationsEmptyState />
          ) : (
            <AnimatePresence initial={false}>
              {dashboardNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onDismiss={dismissNotification}
                  onRestock={handleRestock}
                />
              ))}
            </AnimatePresence>
          )}
        </div>
      </section>

      <ToastStack
        toasts={toasts}
        onClose={(toastId) =>
          setToasts((currentToasts) =>
            currentToasts.filter((toast) => toast.toastId !== toastId)
          )
        }
      />
    </>
  );
}

function NotificationItem({
  notification,
  onDismiss,
  onRestock,
}: {
  notification: StockNotification;
  onDismiss: (id: string) => void;
  onRestock: (notification: StockNotification) => void;
}) {
  const style = notificationStyles[notification.type];
  const Icon = style.icon;
  const detailHref = notification.productId
    ? `/produk/${notification.productId}`
    : "/produk";

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className={cn(
        "rounded-2xl border p-4 transition hover:-translate-y-0.5",
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

              <button
                type="button"
                onClick={() => onDismiss(notification.id)}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
                aria-label={`Tutup notifikasi ${notification.productName}`}
              >
                <X className="h-4 w-4" />
              </button>
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
            {notification.type !== "safe" ? (
              <button
                type="button"
                onClick={() => onRestock(notification)}
                className={cn(
                  "inline-flex h-9 items-center gap-2 rounded-xl border px-3 text-xs font-semibold transition",
                  style.action
                )}
              >
                <PackagePlus className="h-4 w-4" />
                Restock Sekarang
              </button>
            ) : null}

            <Link
              href={detailHref}
              className="inline-flex h-9 items-center gap-2 rounded-xl border border-border bg-muted/30 px-3 text-xs font-semibold text-foreground transition hover:bg-muted"
            >
              <Eye className="h-4 w-4" />
              Lihat Detail
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function ToastStack({
  toasts,
  onClose,
}: {
  toasts: ToastNotification[];
  onClose: (toastId: string) => void;
}) {
  return (
    <div
      className="pointer-events-none fixed right-4 top-4 z-[80] w-[min(420px,calc(100vw-2rem))] space-y-3"
      aria-live="polite"
    >
      <AnimatePresence>
        {toasts.map((toast) => {
          const style = notificationStyles[toast.type];
          const Icon = style.icon;

          return (
            <motion.div
              key={toast.toastId}
              initial={{ opacity: 0, x: 24, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 24, scale: 0.98 }}
              transition={{ duration: 0.22 }}
              className={cn(
                "pointer-events-auto rounded-2xl border p-4 shadow-xl backdrop-blur-xl",
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
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-primary">
                        {toast.title}
                      </p>
                      <p className="mt-1 text-sm leading-5 text-primary/80">
                        {toast.message}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => onClose(toast.toastId)}
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-primary/60 transition hover:bg-primary/10 hover:text-primary"
                      aria-label="Tutup toast notifikasi"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

function StockNotificationsEmptyState() {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 p-6 text-center">
      <CheckCircle2 className="h-10 w-10 text-primary/50" />
      <p className="mt-3 text-sm font-medium text-foreground">
        Semua stok berada di zona aman
      </p>
      <p className="mt-1 max-w-xs text-xs leading-5 text-muted-foreground">
        Alert stok baru akan muncul otomatis ketika ada produk yang perlu
        dipantau.
      </p>
    </div>
  );
}

function StockNotificationsSkeleton({ className }: { className?: string }) {
  return (
    <section
      className={cn(
        "rounded-3xl border border-border bg-card p-5 shadow-sm",
        className
      )}
    >
      <div className="space-y-4">
        <div className="h-11 w-52 animate-pulse rounded-2xl bg-muted" />
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-28 animate-pulse rounded-2xl bg-muted"
          />
        ))}
      </div>
    </section>
  );
}

function getRealtimeNotificationUpdate(notification: StockNotification) {
  if (typeof notification.stock !== "number") {
    return {
      ...notification,
      timestamp: "Baru saja",
    };
  }

  const nextStock = Math.max(0, notification.stock - 1);

  if (nextStock <= 0) {
    return {
      ...notification,
      type: "out-of-stock" as const,
      title: "Stok Habis",
      message: `${notification.productName} baru saja mencapai stok 0. Segera restock agar transaksi tidak tertahan.`,
      stock: 0,
      priority: 1,
      timestamp: "Baru saja",
    };
  }

  if (nextStock <= 5) {
    return {
      ...notification,
      type: "low-stock" as const,
      title: "Stok Hampir Habis",
      message: `${notification.productName} tersisa ${nextStock} unit. Sistem menandai produk ini sebagai prioritas restock.`,
      stock: nextStock,
      priority: 2,
      timestamp: "Baru saja",
    };
  }

  return {
    ...notification,
    stock: nextStock,
    timestamp: "Baru saja",
  };
}