import Link from "next/link";
import { Plus, ReceiptText } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { GlassPanel } from "@/components/shared/glass-panel";
import { SalesTable } from "@/components/sales/sales-table";
import { getSales } from "@/services/sales-service";
import { formatCurrency } from "@/lib/helpers/format";

export default async function TransaksiPage() {
  const sales = await getSales();

  const totalRevenue = sales.reduce((total, sale) => {
    return total + Number(sale.total_amount);
  }, 0);

  const totalItems = sales.reduce((total, sale) => {
    return total + sale.sales_items.length;
  }, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <GlassPanel className="p-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">
                Sales History
              </p>

              <h1 className="mt-2 text-3xl font-bold text-foreground">
                Transaksi
              </h1>

              <p className="mt-2 text-sm text-muted-foreground">
                Catat penjualan real untuk membentuk pola forecasting AI.
              </p>
            </div>

            <Link
              href="/transaksi/tambah"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Tambah Transaksi
            </Link>
          </div>
        </GlassPanel>

        <section className="grid gap-4 md:grid-cols-3">
          <GlassPanel className="p-5">
            <ReceiptText className="h-6 w-6 text-primary" />
            <p className="mt-4 text-sm text-muted-foreground">Total Transaksi</p>
            <p className="mt-2 text-3xl font-bold text-foreground">
              {sales.length}
            </p>
          </GlassPanel>

          <GlassPanel className="p-5">
            <ReceiptText className="h-6 w-6 text-primary" />
            <p className="mt-4 text-sm text-muted-foreground">Total Revenue</p>
            <p className="mt-2 text-3xl font-bold text-foreground">
              {formatCurrency(totalRevenue)}
            </p>
          </GlassPanel>

          <GlassPanel className="p-5">
            <ReceiptText className="h-6 w-6 text-primary" />
            <p className="mt-4 text-sm text-muted-foreground">Item Transaksi</p>
            <p className="mt-2 text-3xl font-bold text-foreground">
              {totalItems}
            </p>
          </GlassPanel>
        </section>

        <SalesTable sales={sales} />
      </div>
    </DashboardLayout>
  );
}