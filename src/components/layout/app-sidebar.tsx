"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, ShoppingBasket } from "lucide-react";
import { dashboardNavigation } from "@/lib/constants/navigation";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <motion.aside
      initial={{ x: -32, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="hidden h-screen w-72 shrink-0 border-r border-white/10 bg-slate-950/80 p-5 backdrop-blur-xl lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:flex-col"
    >
      <Link href="/dashboard" className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-500 shadow-lg shadow-cyan-500/20">
          <ShoppingBasket className="h-6 w-6 text-white" />
        </div>

        <div>
          <p className="text-lg font-bold tracking-tight text-white">
            FutureStock
          </p>

          <p className="text-xs text-cyan-300">AI Inventory SaaS</p>
        </div>
      </Link>

      <nav className="mt-8 flex-1 space-y-2">
        {dashboardNavigation.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch
              className={cn(
                "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-cyan-400/10 text-cyan-200 shadow-[0_0_30px_rgba(34,211,238,0.12)]"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 transition",
                  active
                    ? "text-cyan-300"
                    : "text-slate-500 group-hover:text-white"
                )}
              />

              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-4">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-400/20">
          <Sparkles className="h-5 w-5 text-cyan-300" />
        </div>

        <p className="text-sm font-semibold text-white">AI Forecast Ready</p>

        <p className="mt-1 text-xs leading-relaxed text-slate-400">
          Optimalkan stok toko dengan prediksi permintaan berbasis AI.
        </p>
      </div>
    </motion.aside>
  );
}