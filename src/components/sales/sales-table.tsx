"use client";

import Link from "next/link";
import {
  CalendarDays,
  Eye,
  PackageSearch,
  Plus,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";

import type { SaleWithItems } from "@/types/sales";
import { formatCurrency } from "@/lib/helpers/format";

import { DataTable } from "@/components/data/data-table";
import { Button } from "@/components/ui/button";
import { DeleteSaleButton } from "@/components/sales/delete-sale-button";

type SalesTableProps = {
  sales: SaleWithItems[];
};

function safeText(value: unknown) {
  return String(value ?? "");
}

function getSaleItems(sale: SaleWithItems) {
  return Array.isArray(sale.sales_items) ? sale.sales_items : [];
}

export function SalesTable({ sales }: SalesTableProps) {
  const [search, setSearch] = useState("");

  const filteredSales = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return sales;

    return sales.filter((sale) => {
      const saleItems = getSaleItems(sale);

      const productNames = saleItems
        .map((item) => safeText(item.products?.name))
        .join(" ")
        .toLowerCase();

      const invoiceNumber = safeText(sale.invoice_number).toLowerCase();
      const customerName = safeText(sale.customer_name).toLowerCase();
      const paymentMethod = safeText(sale.payment_method).toLowerCase();

      return (
        invoiceNumber.includes(keyword) ||
        customerName.includes(keyword) ||
        paymentMethod.includes(keyword) ||
        productNames.includes(keyword)
      );
    });
  }, [sales, search]);

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-border bg-card/80 p-4 shadow-sm">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <input
            type="text"
            placeholder="Cari invoice, produk, pelanggan, atau metode pembayaran..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-12 w-full rounded-2xl border border-border bg-background px-4 pl-11 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary/40 focus:ring-4 focus:ring-primary/10"
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
          <p>
            Menampilkan{" "}
            <span className="font-semibold text-foreground">
              {filteredSales.length}
            </span>{" "}
            dari{" "}
            <span className="font-semibold text-foreground">
              {sales.length}
            </span>{" "}
            transaksi.
          </p>

          {search ? (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="font-semibold text-primary transition hover:text-primary/80"
            >
              Reset pencarian
            </button>
          ) : null}
        </div>
      </div>

      <DataTable<SaleWithItems>
        data={filteredSales}
        getRowKey={(sale) => sale.id}
        emptyTitle={
          sales.length === 0
            ? "Belum ada transaksi"
            : "Transaksi tidak ditemukan"
        }
        emptyDescription={
          sales.length === 0
            ? "Tambahkan transaksi pertama agar sistem dapat membaca pola penjualan, stok, analitik, dan prediksi AI."
            : "Tidak ada transaksi yang sesuai dengan pencarian saat ini."
        }
        emptyAction={
          sales.length === 0 ? (
            <Button asChild>
              <Link href="/transaksi/tambah">
                <Plus className="mr-2 h-4 w-4" />
                Tambah Transaksi
              </Link>
            </Button>
          ) : (
            <Button type="button" variant="outline" onClick={() => setSearch("")}>
              <PackageSearch className="mr-2 h-4 w-4" />
              Reset Pencarian
            </Button>
          )
        }
        columns={[
          {
            key: "invoice_number",
            header: "Invoice",
            render: (sale) => (
              <div>
                <p className="font-semibold text-foreground">
                  {safeText(sale.invoice_number) || "Tanpa invoice"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  #{safeText(sale.id).slice(0, 8)}
                </p>
              </div>
            ),
          },
          {
            key: "customer_name",
            header: "Customer",
            render: (sale) => (
              <span className="text-muted-foreground">
                {safeText(sale.customer_name) || "Pelanggan Umum"}
              </span>
            ),
          },
          {
            key: "items",
            header: "Item",
            render: (sale) => {
              const saleItems = getSaleItems(sale);

              const productNames = saleItems
                .map((item) => item.products?.name)
                .filter(Boolean);

              return (
                <div>
                  <p className="font-semibold text-foreground">
                    {saleItems.length} item
                  </p>
                  <p className="mt-1 max-w-[260px] truncate text-xs text-muted-foreground">
                    {productNames.slice(0, 2).join(", ") || "Tanpa produk"}
                    {productNames.length > 2 ? " ..." : ""}
                  </p>
                </div>
              );
            },
          },
          {
            key: "total_qty",
            header: "Total Qty",
            render: (sale) => {
              const totalQty = getSaleItems(sale).reduce((total, item) => {
                return total + Number(item.quantity ?? 0);
              }, 0);

              return (
                <span className="inline-flex rounded-xl border border-primary/15 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {totalQty} qty
                </span>
              );
            },
          },
          {
            key: "payment_method",
            header: "Pembayaran",
            render: (sale) => (
              <span className="rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {safeText(sale.payment_method) || "-"}
              </span>
            ),
          },
          {
            key: "sale_date",
            header: "Tanggal",
            render: (sale) => {
              const date = sale.sale_date ? new Date(sale.sale_date) : null;
              const isValidDate = date && !Number.isNaN(date.getTime());

              return (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CalendarDays className="h-4 w-4" />
                  <span>
                    {isValidDate
                      ? new Intl.DateTimeFormat("id-ID", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }).format(date)
                      : "-"}
                  </span>
                </div>
              );
            },
          },
          {
            key: "total_amount",
            header: "Total",
            className: "text-right",
            render: (sale) => (
              <span className="font-semibold text-foreground">
                {formatCurrency(Number(sale.total_amount ?? 0))}
              </span>
            ),
          },
          {
            key: "actions",
            header: "Aksi",
            className: "text-right",
            render: (sale) => (
              <div className="flex justify-end gap-2">
                <Button asChild size="sm" variant="outline">
                  <Link href={`/transaksi/${sale.id}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    Detail
                  </Link>
                </Button>

                <DeleteSaleButton
                  saleId={sale.id}
                  invoiceNumber={sale.invoice_number}
                />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}