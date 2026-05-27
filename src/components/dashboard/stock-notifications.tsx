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
    wrapper: "border-rose-400/30 bg-rose-400/[0.09]",
    iconClass: "bg-rose-400/15 text-rose-300",
    badge: "border-rose-400/30 bg-rose-400/15 text-rose-100",
    action: "border-rose-400/25 bg-rose-400/10 text-rose-100 hover:bg-rose-400/20",
  },
  "low-stock": {
    icon: AlertTriangle,
    label: "Hampir habis",
    wrapper: "border-amber-400/30 bg-amber-400/[0.09]",
    iconClass: "bg-amber-400/15 text-amber-300",
    badge: "border-amber-400/30 bg-amber-400/15 text-amber-100",
    action: "border-amber-400/25 bg-amber-400/10 text-amber-100 hover:bg-amber-400/20",
  },
  "high-demand": {
    icon: Flame,
    label: "Permintaan tinggi",
    wrapper: "border-orange-400/30 bg-orange-400/[0.09]",
    iconClass: "bg-orange-400/15 text-orange-300",
    badge: "border-orange-400/30 bg-orange-400/15 text-orange-100",
    action: "border-orange-400/25 bg-orange-400/10 text-orange-100 hover:bg-orange-400/20",
  },
  "restock-soon": {
    icon: RotateCw,
    label: "Restock segera",
    wrapper: "border-violet-400/30 bg-violet-400/[0.09]",
    iconClass: "bg-violet-400/15 text-violet-300",
    badge: "border-violet-400/30 bg-violet-400/15 text-violet-100",
    action: "border-violet-400/25 bg-violet-400/10 text-violet-100 hover:bg-violet-400/20",
  },
  safe: {
    icon: CheckCircle2,
    label: "Aman",
    wrapper: "border-emerald-400/30 bg-emerald-400/[0.09]",
    iconClass: "bg-emerald-400/15 text-emerald-300",
    badge: "border-emerald-400/30 bg-emerald-400/15 text-emerald-100",
    action: "border-emerald-400/25 bg-emerald-400/10 text-emerald-100 hover:bg-emerald-400/20",
  },
  "ai-insight": {
    icon: Bot,
    label: "AI Insight",
    wrapper: "border-blue-400/30 bg-blue-400/[0.09]",
    iconClass: "bg-blue-400/15 text-blue-300",
    badge: "border-blue-400/30 bg-blue-400/15 text-blue-100",
    action: "border-blue-400/25 bg-blue-400/10 text-blue-100 hover:bg-blue-400/20",
  },
  "top-selling": {
    icon: Flame,
    label: "Penjualan tinggi",
    wrapper: "border-cyan-400/30 bg-cyan-400/[0.09]",
    iconClass: "bg-cyan-400/15 text-cyan-300",
    badge: "border-cyan-400/30 bg-cyan-400/15 text-cyan-100",
    action: "border-cyan-400/25 bg-cyan-400/10 text-cyan-100 hover:bg-cyan-400/20",
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
          "rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl",
          className
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-400/15 text-amber-300">
              <BellRing className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-amber-300">
                Smart Alerts
              </p>
              <h2 className="mt-1 text-xl font-bold text-white">
                Notifikasi Stok Otomatis
              </h2>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <span className="rounded-full border border-rose-400/20 bg-rose-400/10 px-3 py-1 text-xs font-semibold text-rose-100">
              {visibleNotifications.length} aktif
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200">
              <Radio className="h-3.5 w-3.5" />
              Live
            </span>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span>Auto update stok</span>
          <span className="h-1 w-1 rounded-full bg-slate-600" />
          <span>Sinkron {lastUpdated}</span>
        </div>

        <div className="mt-5 space-y-3">
          {visibleNotifications.length === 0 ? (
            <StockNotificationsEmptyState />
          ) : (
            <AnimatePresence initial={false}>
              {visibleNotifications.map((notification) => (
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
              <p className="text-sm font-semibold text-white">
                {notification.title}
              </p>
              <p className="mt-0.5 truncate text-sm font-medium text-slate-300">
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
                className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white/10 hover:text-white"
                aria-label={`Tutup notifikasi ${notification.productName}`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            {notification.message}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
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
              className="inline-flex h-9 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-xs font-semibold text-slate-200 transition hover:bg-white/10"
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
                "pointer-events-auto rounded-2xl border p-4 shadow-2xl shadow-black/30 backdrop-blur-xl",
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
                      <p className="text-sm font-semibold text-white">
                        {toast.title}
                      </p>
                      <p className="mt-1 text-sm leading-5 text-slate-300">
                        {toast.message}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => onClose(toast.toastId)}
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white/10 hover:text-white"
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
    <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-950/30 p-6 text-center">
      <CheckCircle2 className="h-10 w-10 text-emerald-400" />
      <p className="mt-3 text-sm font-medium text-white">
        Semua stok berada di zona aman
      </p>
      <p className="mt-1 max-w-xs text-xs leading-5 text-slate-500">
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
        "rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-cyan-950/20 backdrop-blur",
        className
      )}
    >
      <div className="space-y-4">
        <div className="h-11 w-52 animate-pulse rounded-2xl bg-white/10" />
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-28 animate-pulse rounded-2xl bg-white/10"
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
