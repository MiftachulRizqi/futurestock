import Link from "next/link";
import {
  Plus,
  ReceiptText,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { GlassPanel } from "@/components/shared/glass-panel";
import { SalesTable } from "@/components/sales/sales-table";
import { Button } from "@/components/ui/button";

import {
  getSales,
  getPaginatedSales,
} from "@/services/sales-service";

import { formatCurrency } from "@/lib/helpers/format";

type TransaksiPageProps = {
  searchParams?: Promise<{
    page?: string;
    search?: string;
  }>;
};

export default async function TransaksiPage({
  searchParams,
}: TransaksiPageProps) {
  const params = await searchParams;

  const currentPage = Math.max(
    1,
    Number(params?.page ?? "1")
  );

  const search = params?.search ?? "";

  const pageSize = 5;

  const [allSales, paginatedResult] =
    await Promise.all([
      getSales(),
      getPaginatedSales(
        currentPage,
        pageSize,
        search
      ),
    ]);

  const {
    sales,
    total,
  } = paginatedResult;

  const totalPages = Math.max(
    1,
    Math.ceil(total / pageSize)
  );

  const totalTransactions = allSales.length;

  const totalRevenue = allSales.reduce(
    (total, sale) => {
      return total + Number(sale.total_amount);
    },
    0
  );

  const totalItemsSold = allSales.reduce(
    (total, sale) => {
      return (
        total +
        sale.sales_items.reduce(
          (itemTotal, item) => {
            return (
              itemTotal +
              Number(item.quantity)
            );
          },
          0
        )
      );
    },
    0
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <GlassPanel className="p-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                <ReceiptText className="h-3.5 w-3.5" />
                Monitoring Penjualan
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-foreground">
                Transaksi
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                Kelola transaksi penjualan untuk menjaga sinkronisasi stok,
                analitik penjualan, prediksi AI, dan monitoring inventory.
              </p>
            </div>

            <Button
              asChild
              size="lg"
              className="rounded-2xl"
            >
              <Link href="/transaksi/tambah">
                <Plus className="mr-2 h-4 w-4" />
                Tambah Transaksi
              </Link>
            </Button>
          </div>
        </GlassPanel>

        <section className="grid gap-5 md:grid-cols-3">
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

        <SalesTable
          sales={sales}
          currentPage={currentPage}
          totalPages={totalPages}
          totalTransactions={total}
          search={search}
        />
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
    <GlassPanel className="p-6 transition-all duration-200 hover:-translate-y-0.5">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        {icon}
      </div>

      <p className="mt-5 text-sm font-medium text-muted-foreground">
        {label}
      </p>

      <p className="mt-3 text-3xl font-bold tracking-tight text-foreground">
        {value}
      </p>
    </GlassPanel>
  );
}