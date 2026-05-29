import Link from "next/link";
import {
  ArrowUpRight,
  ReceiptText,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { GlassPanel } from "@/components/shared/glass-panel";
import { SalesTable } from "@/components/sales/sales-table";
import { Button } from "@/components/ui/button";

import { getSales } from "@/services/sales-service";
import { formatCurrency } from "@/lib/helpers/format";

export default async function TransaksiPage() {
  const sales = await getSales();

  const totalTransactions = sales.length;

  const totalRevenue = sales.reduce((total, sale) => {
    return total + Number(sale.total_amount);
  }, 0);

  const totalItemsSold = sales.reduce((total, sale) => {
    return (
      total +
      sale.sales_items.reduce((itemTotal, item) => {
        return itemTotal + Number(item.quantity);
      }, 0)
    );
  }, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <GlassPanel className="p-6">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                <ReceiptText className="h-3.5 w-3.5" />
                Monitoring Penjualan
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Transaksi
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Kelola transaksi penjualan untuk menjaga sinkronisasi stok,
                analitik penjualan, prediksi AI, dan monitoring inventory.
              </p>
            </div>

            <Button asChild>
              <Link href="/transaksi/tambah">
                <ArrowUpRight className="mr-2 h-4 w-4" />
                Tambah Transaksi
              </Link>
            </Button>
          </div>
        </GlassPanel>

        <section className="grid gap-4 md:grid-cols-3">
          <TransactionStatCard
            label="Total Transaksi"
            value={totalTransactions.toString()}
            icon={<ReceiptText className="h-5 w-5" />}
          />

          <TransactionStatCard
            label="Total Revenue"
            value={formatCurrency(totalRevenue)}
            icon={<TrendingUp className="h-5 w-5" />}
          />

          <TransactionStatCard
            label="Produk Terjual"
            value={`${totalItemsSold} item`}
            icon={<ShoppingCart className="h-5 w-5" />}
          />
        </section>

        <SalesTable sales={sales} />
      </div>
    </DashboardLayout>
  );
}

function TransactionStatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <GlassPanel className="p-5">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        {icon}
      </div>

      <p className="mt-5 text-sm font-medium text-muted-foreground">{label}</p>

      <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">
        {value}
      </p>
    </GlassPanel>
  );
}