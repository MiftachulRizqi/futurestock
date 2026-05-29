"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export function GlobalLoadingOverlay() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);

    const timeout = setTimeout(() => {
      setVisible(false);
    }, 450);

    return () => clearTimeout(timeout);
  }, [pathname, searchParams]);

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[9998] flex justify-center">
      <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-white/90 px-4 py-2 text-sm font-semibold text-primary shadow-lg shadow-emerald-900/10 backdrop-blur-xl">
        <Loader2 className="h-4 w-4 animate-spin" />
        Memuat halaman...
      </div>
    </div>
  );
}