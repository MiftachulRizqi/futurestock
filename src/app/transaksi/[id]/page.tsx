import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  CreditCard,
  Package,
  ReceiptText,
  ShoppingCart,
  UserRound,
} from "lucide-react";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { GlassPanel } from "@/components/shared/glass-panel";
import { Button } from "@/components/ui/button";

import { getSales } from "@/services/sales-service";
import { formatCurrency } from "@/lib/helpers/format";

type DetailTransaksiPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type UnknownRecord = Record<string, unknown>;

function safeText(value: unknown) {
  return String(value ?? "");
}

function getNumber(value: unknown) {
  return Number(value ?? 0);
}

function getSaleItems(sale: { sales_items?: unknown }) {
  return Array.isArray(sale.sales_items) ? sale.sales_items : [];
}

function getProductName(item: unknown) {
  const itemRecord = item as UnknownRecord;
  const product = itemRecord.products as UnknownRecord | undefined;

  return safeText(product?.name) || "Produk tidak ditemukan";
}

function getProductSku(item: unknown) {
  const itemRecord = item as UnknownRecord;
  const product = itemRecord.products as UnknownRecord | undefined;

  return safeText(product?.sku) || "-";
}

function getItemQuantity(item: unknown) {
  const itemRecord = item as UnknownRecord;

  return getNumber(itemRecord.quantity);
}

function getItemUnitPrice(item: unknown) {
  const itemRecord = item as UnknownRecord;

  return getNumber(itemRecord.unit_price ?? itemRecord.price);
}

function getItemSubtotal(item: unknown) {
  const itemRecord = item as UnknownRecord;
  const directSubtotal = itemRecord.subtotal ?? itemRecord.total_price;

  if (directSubtotal !== undefined && directSubtotal !== null) {
    return getNumber(directSubtotal);
  }

  return getItemQuantity(item) * getItemUnitPrice(item);
}

export default async function DetailTransaksiPage({
  params,
}: DetailTransaksiPageProps) {
  const { id } = await params;

  const sales = await getSales();
  const sale = sales.find((item) => item.id === id);

  if (!sale) {
    notFound();
  }

  const saleItems = getSaleItems(sale);

  const totalQuantity = saleItems.reduce((total, item) => {
    return total + getItemQuantity(item);
  }, 0);

  const saleDate = sale.sale_date ? new Date(sale.sale_date) : null;
  const isValidDate = saleDate && !Number.isNaN(saleDate.getTime());

  const formattedDate = isValidDate
    ? new Intl.DateTimeFormat("id-ID", {
        dateStyle: "full",
        timeStyle: "short",
      }).format(saleDate)
    : "-";

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <GlassPanel className="overflow-hidden p-0">
          <div className="relative p-6">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />

            <div className="relative flex flex-col justify-between gap-5 md:flex-row md:items-start">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                  <ReceiptText className="h-3.5 w-3.5" />
                  Detail Transaksi
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  {safeText(sale.invoice_number) || "Tanpa invoice"}
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                  Ringkasan transaksi penjualan, item produk, metode pembayaran,
                  dan nilai revenue yang memengaruhi analitik FutureStock.
                </p>
              </div>

              <Button asChild variant="outline">
                <Link href="/transaksi">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Kembali
                </Link>
              </Button>
            </div>
          </div>
        </GlassPanel>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <DetailStatCard
            icon={<ReceiptText className="h-5 w-5" />}
            label="Invoice"
            value={safeText(sale.invoice_number) || "-"}
          />

          <DetailStatCard
            icon={<ShoppingCart className="h-5 w-5" />}
            label="Total Item"
            value={`${totalQuantity} qty`}
          />

          <DetailStatCard
            icon={<CreditCard className="h-5 w-5" />}
            label="Pembayaran"
            value={safeText(sale.payment_method) || "-"}
          />

          <DetailStatCard
            icon={<CalendarDays className="h-5 w-5" />}
            label="Tanggal"
            value={
              isValidDate
                ? new Intl.DateTimeFormat("id-ID", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(saleDate)
                : "-"
            }
          />
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <GlassPanel className="overflow-hidden p-0">
            <div className="border-b border-border p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Package className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-bold text-foreground">Item Transaksi</h2>
                  <p className="text-sm text-muted-foreground">
                    Produk yang tercatat dalam transaksi ini.
                  </p>
                </div>
              </div>
            </div>

            <div className="divide-y divide-border">
              {saleItems.length > 0 ? (
                saleItems.map((item, index) => {
                  const quantity = getItemQuantity(item);
                  const unitPrice = getItemUnitPrice(item);
                  const subtotal = getItemSubtotal(item);

                  return (
                    <div
                      key={index}
                      className="grid gap-4 p-5 md:grid-cols-[1.35fr_0.45fr_0.7fr_0.7fr]"
                    >
                      <div>
                        <p className="font-semibold text-foreground">
                          {getProductName(item)}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          SKU: {getProductSku(item)}
                        </p>
                      </div>

                      <InfoValue label="Qty" value={quantity.toString()} />

                      <InfoValue label="Harga" value={formatCurrency(unitPrice)} />

                      <div className="md:text-right">
                        <InfoValue
                          label="Subtotal"
                          value={formatCurrency(subtotal)}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  Tidak ada item transaksi.
                </div>
              )}
            </div>
          </GlassPanel>

          <div className="space-y-6">
            <GlassPanel className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <UserRound className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-bold text-foreground">
                    Informasi Customer
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Detail pelanggan dan pembayaran.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <InfoRow
                  label="Nama Customer"
                  value={safeText(sale.customer_name) || "Pelanggan Umum"}
                />

                <InfoRow
                  label="Metode Pembayaran"
                  value={safeText(sale.payment_method) || "-"}
                />

                <InfoRow label="Tanggal Transaksi" value={formattedDate} />
              </div>
            </GlassPanel>

            <GlassPanel className="relative overflow-hidden p-6">
              <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />

              <div className="relative">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Transaksi
                </p>

                <p className="mt-3 text-4xl font-bold tracking-tight text-foreground">
                  {formatCurrency(Number(sale.total_amount ?? 0))}
                </p>

                <div className="mt-5 rounded-2xl border border-primary/15 bg-primary/10 px-4 py-3 text-sm leading-6 text-primary">
                  Nilai ini ikut memengaruhi revenue, analytics, forecast AI,
                  dan laporan inventory.
                </div>
              </div>
            </GlassPanel>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function DetailStatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <GlassPanel className="p-5">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        {icon}
      </div>

      <p className="mt-5 text-sm font-medium text-muted-foreground">{label}</p>

      <p className="mt-2 truncate text-lg font-bold text-foreground">{value}</p>
    </GlassPanel>
  );
}

function InfoValue({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 font-semibold text-foreground">{value}</p>
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background/60 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 font-semibold text-foreground">{value}</p>
    </div>
  );
}