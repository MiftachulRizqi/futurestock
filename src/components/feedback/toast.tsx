"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Info, TriangleAlert, X, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info" | "warning";

type ToastItem = {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
};

const TOAST_EVENT = "futurestock-toast";

export const toast = {
  success: (title: string, description?: string) =>
    dispatchToast("success", title, description),
  error: (title: string, description?: string) =>
    dispatchToast("error", title, description),
  info: (title: string, description?: string) =>
    dispatchToast("info", title, description),
  warning: (title: string, description?: string) =>
    dispatchToast("warning", title, description),
};

function dispatchToast(type: ToastType, title: string, description?: string) {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent<ToastItem>(TOAST_EVENT, {
      detail: {
        id: crypto.randomUUID(),
        type,
        title,
        description,
      },
    })
  );
}

export function ToastProvider() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    function handleToast(event: Event) {
      const toastEvent = event as CustomEvent<ToastItem>;

      setToasts((prev) => [toastEvent.detail, ...prev].slice(0, 4));

      setTimeout(() => {
        setToasts((prev) =>
          prev.filter((item) => item.id !== toastEvent.detail.id)
        );
      }, 4000);
    }

    window.addEventListener(TOAST_EVENT, handleToast);

    return () => {
      window.removeEventListener(TOAST_EVENT, handleToast);
    };
  }, []);

  return (
    <div className="fixed right-4 top-4 z-[9999] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3">
      {toasts.map((item) => (
        <ToastCard
          key={item.id}
          toast={item}
          onClose={() =>
            setToasts((prev) => prev.filter((toast) => toast.id !== item.id))
          }
        />
      ))}
    </div>
  );
}

function ToastCard({
  toast,
  onClose,
}: {
  toast: ToastItem;
  onClose: () => void;
}) {
  const Icon =
    toast.type === "success"
      ? CheckCircle2
      : toast.type === "error"
        ? XCircle
        : toast.type === "warning"
          ? TriangleAlert
          : Info;

  return (
    <div className="animate-in slide-in-from-right-4 fade-in rounded-2xl border border-emerald-900/10 bg-white/95 p-4 shadow-2xl shadow-emerald-900/10 backdrop-blur-xl">
      <div className="flex gap-3">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
            toast.type === "success" && "bg-emerald-50 text-emerald-600",
            toast.type === "error" && "bg-red-50 text-red-600",
            toast.type === "warning" && "bg-amber-50 text-amber-600",
            toast.type === "info" && "bg-primary/10 text-primary"
          )}
        >
          <Icon className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-semibold text-[#102418]">{toast.title}</p>
          {toast.description ? (
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {toast.description}
            </p>
          ) : null}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="text-muted-foreground transition hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}