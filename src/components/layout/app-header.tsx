"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  LogOut,
  Menu,
  Search,
  Sparkles,
  Package,
  ChevronRight,
} from "lucide-react";

import { useMemo, useState } from "react";

import { dashboardNavigation } from "@/lib/constants/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { logoutAction } from "@/app/login/actions";

import { useSearchStore } from "@/store/search-store";

export function AppHeader({
  onMenuClick,
  userName = "Owner Toko",
  storeName = "FutureStock Store",
  role = "owner",
}: any) {
  const pathname = usePathname();

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
    { title: "Analytics", href: "/analytics", type: "Menu" },
    { title: "Laporan", href: "/laporan", type: "Menu" },
    { title: "Prediksi AI", href: "/prediksi-ai", type: "AI" },
    { title: "Pengaturan", href: "/pengaturan", type: "Menu" },
  ];

  const filteredMenus = useMemo(() => {
    if (!query) return [];
    return menuItems.filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  const filteredProducts = useMemo(() => {
    if (!query) return [];
    return products.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, products]);

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

        {/* SEARCH */}
        <div className="relative hidden w-full max-w-md md:block">
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card/5 px-4">
            <Search className="h-4 w-4 text-muted-foreground" />

            <Input
              placeholder="Cari menu atau produk..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border-0 bg-transparent text-foreground focus-visible:ring-0"
            />
          </div>

          {query && (
            <div className="absolute left-0 right-0 top-14 z-50 rounded-2xl border border-border bg-card p-2">

              {filteredMenus.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setQuery("")}
                  className="flex justify-between px-3 py-2 hover:bg-card/5"
                >
                  {item.title}
                  <ChevronRight className="h-4 w-4" />
                </Link>
              ))}

              {filteredProducts.map((p) => (
                <Link
                  key={p.id}
                  href="/produk"
                  onClick={() => setQuery("")}
                  className="flex justify-between px-3 py-2 hover:bg-card/5"
                >
                  {p.name}
                  <Package className="h-4 w-4" />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* AI BUTTON */}
        <Link
          href="/prediksi-ai"
          className="hidden md:inline-flex h-10 items-center rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Tanya AI
        </Link>

        {/* NOTIF */}
        <Button variant="ghost" size="icon">
          <Bell />
        </Button>

        {/* PROFILE */}
        <Link href="/pengaturan">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold">
            {userName.slice(0, 2).toUpperCase()}
          </div>
        </Link>

        {/* LOGOUT */}
        <form action={logoutAction}>
          <button className="text-destructive">
            <LogOut />
          </button>
        </form>
      </div>
    </header>
  );
}