"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import {
  Bell,
  LogOut,
  Menu,
  Search,
  Package,
  ChevronRight,
  X,
} from "lucide-react";

import { useMemo, useState, useEffect } from "react";

import { dashboardNavigation } from "@/lib/constants/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { logoutAction } from "@/app/login/actions";
import { useSearchStore } from "@/store/search-store";
import { StockNotificationsDropdown } from "@/components/dashboard/stock-notifications-dropdown";

export function AppHeader({
  onMenuClick,
  userName = "Owner Toko",
}: any) {
  const pathname = usePathname();
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const { query, setQuery, products } = useSearchStore();

  const { query, setQuery, products } = useSearchStore();

  const currentPage =
    dashboardNavigation.find(
      (item) =>
        pathname === item.href ||
        pathname.startsWith(`${item.href}/`)
    )?.title ?? "FutureStock";

  const menuItems = [
    { title: "Dashboard", href: "/dashboard", type: "Menu" },
    { title: "Produk", href: "/produk", type: "Menu" },
    { title: "Tambah Produk", href: "/produk/tambah", type: "Menu" },
    { title: "Transaksi", href: "/transaksi", type: "Menu" },
    { title: "Tambah Transaksi", href: "/transaksi/tambah", type: "Menu" },
    { title: "Inventaris", href: "/inventaris", type: "Menu" },
    { title: "Analitik", href: "/analitik", type: "Menu" },
    { title: "Prediksi AI", href: "/prediksi-ai", type: "AI" },
    { title: "Dead Stock", href: "/dead-stock", type: "Menu" },
    { title: "Aktivitas", href: "/aktivitas", type: "Menu" },
    { title: "Laporan", href: "/laporan", type: "Menu" },
    { title: "Pengaturan", href: "/pengaturan", type: "Menu" },
  ];

  const filteredMenus = useMemo(() => {
    if (!query) return [];

    const keyword = query.toLowerCase();

    return menuItems.filter((item) =>
      item.title.toLowerCase().includes(keyword)
    );
  }, [query]);

  const filteredProducts = useMemo(() => {
    if (!query) return [];

    const keyword = query.toLowerCase();

    return products.filter((product) =>
      product.name.toLowerCase().includes(keyword)
    );
  }, [query, products]);

  const hasSearchResult =
    filteredMenus.length > 0 || filteredProducts.length > 0;

  // Fetch notifications when component mounts
  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications');
      if (response.ok) {
        const stockNotifications = await response.json();
        setNotifications(stockNotifications);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleNotificationClick = () => {
    setNotificationOpen(!notificationOpen);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/70 backdrop-blur-xl">
      <div className="flex h-20 items-center gap-4 px-4 md:px-6">

        {/* MENU */}
        <Button
          variant="ghost"
          size="icon"
          className="text-foreground lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* TITLE */}
        <div className="min-w-0 flex-1">
          <p className="text-xs text-primary">FutureStock AI</p>
          <h1 className="truncate text-xl font-bold text-foreground">
            {currentPage}
          </h1>
        </div>

        <div className="relative hidden w-full max-w-md md:block">
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card/5 px-4">
            <Search className="h-4 w-4 text-muted-foreground" />

            <Input
              placeholder="Cari menu atau produk..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="border-0 bg-transparent text-foreground focus-visible:ring-0"
            />
          </div>

          {query ? (
            <div className="absolute left-0 right-0 top-14 z-50 rounded-2xl border border-border bg-card p-2 shadow-xl">
              {!hasSearchResult ? (
                <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                  Tidak ada hasil ditemukan.
                </div>
              ) : null}

              {filteredMenus.length > 0 ? (
                <div className="space-y-1">
                  <p className="px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Menu
                  </p>

                  {filteredMenus.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setQuery("")}
                      className="flex items-center justify-between rounded-xl px-3 py-2 text-sm text-foreground transition hover:bg-primary/10"
                    >
                      <span>{item.title}</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  ))}
                </div>
              ) : null}

              {filteredProducts.length > 0 ? (
                <div className="mt-2 space-y-1 border-t border-border pt-2">
                  <p className="px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Produk
                  </p>

                  {filteredProducts.slice(0, 6).map((product) => (
                    <Link
                      key={product.id}
                      href={`/produk/${product.id}`}
                      onClick={() => setQuery("")}
                      className="flex items-center justify-between rounded-xl px-3 py-2 text-sm text-foreground transition hover:bg-primary/10"
                    >
                      <span className="truncate">{product.name}</span>
                      <Package className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        <Button variant="ghost" size="icon" className="relative" onClick={handleNotificationClick}>
          <Bell className="h-5 w-5" />
          {notifications.length > 0 && (
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
          )}
        </Button>

        {notificationOpen && (
          <StockNotificationsDropdown
            notifications={notifications}
            onClose={() => setNotificationOpen(false)}
          />
        )}

        <Link href="/pengaturan">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
            {userName.slice(0, 2).toUpperCase()}
          </div>
        </Link>

        {/* LOGOUT */}
        <form action={logoutAction}>
          <button
            type="button"
            onClick={() => setLogoutOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-destructive transition hover:bg-destructive/10"
            aria-label="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </form>

        {logoutOpen &&
          createPortal(
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
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
      </div>
    </header>
  );
}