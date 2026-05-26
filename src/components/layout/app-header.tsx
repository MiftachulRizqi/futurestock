"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, LogOut, Menu, Search, Sparkles } from "lucide-react";
import { dashboardNavigation } from "@/lib/constants/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { logoutAction } from "@/app/login/actions";

type AppHeaderProps = {
  onMenuClick?: () => void;
  userName?: string;
  storeName?: string;
  role?: string;
};

export function AppHeader({
  onMenuClick,
  userName = "Owner Toko",
  storeName = "FutureStock Store",
  role = "owner",
}: AppHeaderProps) {
  const pathname = usePathname();

  const currentPage =
    dashboardNavigation.find(
      (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
    )?.title ?? "FutureStock";

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <div className="flex h-20 items-center gap-4 px-4 md:px-6">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-white lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-cyan-300">
            FutureStock AI
          </p>
          <h1 className="truncate text-xl font-bold text-white md:text-2xl">
            {currentPage}
          </h1>
        </div>

        <div className="hidden w-full max-w-sm items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 md:flex">
          <Search className="h-4 w-4 text-slate-500" />
          <Input
            placeholder="Cari produk, laporan, insight..."
            className="border-0 bg-transparent text-white shadow-none focus-visible:ring-0"
          />
        </div>

        <Link
          href="/prediksi-ai"
          className="hidden h-10 items-center justify-center rounded-xl bg-cyan-400 px-4 text-sm font-medium text-slate-950 transition hover:bg-cyan-300 md:inline-flex"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Tanya AI
        </Link>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-2xl border border-white/10 text-slate-300"
        >
          <Bell className="h-5 w-5" />
        </Button>

        <Link
          href="/pengaturan"
          className="hidden items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 transition hover:bg-white/10 sm:flex"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 text-sm font-bold text-white">
            {userName.slice(0, 2).toUpperCase()}
          </div>

          <div>
            <p className="max-w-32 truncate text-sm font-medium text-white">
              {userName}
            </p>
            <p className="max-w-32 truncate text-xs text-slate-500">
              {storeName} · {role}
            </p>
          </div>
        </Link>

        <form action={logoutAction}>
          <button
            type="submit"
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-rose-400/20 bg-rose-400/10 text-rose-300 transition hover:bg-rose-400/20"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </form>
      </div>
    </header>
  );
}