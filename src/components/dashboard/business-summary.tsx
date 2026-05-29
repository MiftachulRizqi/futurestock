import {
  BadgeCheck,
  AlertTriangle,
  Package,
  CircleDollarSign,
} from "lucide-react";

import { GlassPanel } from "@/components/shared/glass-panel";
import { formatCurrency } from "@/lib/helpers/format";

type BusinessSummaryProps = {
  inventoryHealth: number;
  inventoryValue: number;
  totalProducts: number;
  healthyProducts: number;
  lowStockProducts: number;
};

export function BusinessSummary({
  inventoryHealth,
  inventoryValue,
  totalProducts,
  healthyProducts,
  lowStockProducts,
}: BusinessSummaryProps) {
  return (
    <GlassPanel className="p-5">
      <div className="mb-5">
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">
          Business Summary
        </p>

        <h2 className="mt-2 text-2xl font-bold text-foreground">
          Ringkasan Kondisi Bisnis
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Gambaran cepat kondisi inventaris dan operasional toko saat ini.
        </p>
      </div>

      <div className="space-y-4">
        <SummaryItem
          icon={BadgeCheck}
          title="Kesehatan Inventaris"
          description={`${inventoryHealth}% produk berada dalam kondisi sehat.`}
        />

        <SummaryItem
          icon={Package}
          title="Produk Aktif"
          description={`${healthyProducts} dari ${totalProducts} produk memiliki stok yang aman.`}
        />

        <SummaryItem
          icon={AlertTriangle}
          title="Perlu Restock"
          description={
            lowStockProducts > 0
              ? `${lowStockProducts} produk perlu segera dilakukan restock.`
              : "Tidak ada produk yang membutuhkan restock saat ini."
          }
        />

        <SummaryItem
          icon={CircleDollarSign}
          title="Nilai Inventaris"
          description={`Total estimasi nilai inventaris saat ini sebesar ${formatCurrency(
            inventoryValue
          )}.`}
        />
      </div>
    </GlassPanel>
  );
}

function SummaryItem({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof BadgeCheck;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card/40 p-4">
      <div className="flex gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>

        <div>
          <p className="font-medium text-foreground">
            {title}
          </p>

          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}