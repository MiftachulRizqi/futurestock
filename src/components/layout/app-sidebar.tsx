"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ShoppingBasket } from "lucide-react";
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
      className="hidden h-screen w-72 shrink-0 border-r border-border bg-background/80 p-5 backdrop-blur-xl lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:flex-col"
    >
      <Link href="/dashboard" className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-primary to-primary shadow-lg shadow-primary/20">
          <ShoppingBasket className="h-6 w-6 text-primary-foreground" />
        </div>

        <div>
          <p className="text-lg font-bold tracking-tight text-foreground">
            FutureStock
          </p>

          <p className="text-xs text-primary">AI Inventory SaaS</p>
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
                  ? "bg-primary/10 text-primary shadow-[0_0_30px_rgba(53,138,155,0.12)]"
                  : "text-muted-foreground hover:bg-card/5 hover:text-foreground"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 transition",
                  active
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-foreground"
                )}
              />

              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </motion.aside>
  );
}