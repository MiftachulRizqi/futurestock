"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "@/components/feedback/toast";

const toastMessages: Record<
  string,
  {
    type: "success" | "error" | "info" | "warning";
    title: string;
    description?: string;
  }
> = {
  "transaction-created": {
    type: "success",
    title: "Transaksi berhasil ditambahkan",
    description: "Stok produk, histori penjualan, dan analitik telah diperbarui.",
  },
  "product-created": {
    type: "success",
    title: "Produk berhasil ditambahkan",
    description: "Produk baru sudah masuk ke inventaris FutureStock.",
  },
  "product-updated": {
    type: "success",
    title: "Produk berhasil diperbarui",
    description: "Perubahan produk sudah tersimpan.",
  },
  "product-deleted": {
    type: "success",
    title: "Produk berhasil dihapus",
    description: "Data inventaris telah diperbarui.",
  },
  "ai-forecast-generated": {
    type: "success",
    title: "Forecast AI berhasil diperbarui",
    description: "Hasil prediksi terbaru sudah dibuat menggunakan data terkini.",
  },
};

export function ToastUrlListener() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const toastKey = searchParams.get("toast");
    if (!toastKey) return;

    const message = toastMessages[toastKey];
    if (!message) return;

    toast[message.type](message.title, message.description);

    const params = new URLSearchParams(searchParams.toString());
    params.delete("toast");

    const nextUrl = params.toString() ? `${pathname}?${params}` : pathname;

    router.replace(nextUrl, { scroll: false });
  }, [pathname, router, searchParams]);

  return null;
}