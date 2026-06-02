"use client";

import Link from "next/link";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Eye,
  PackageSearch,
  Plus,
  Search,
} from "lucide-react";

import type { SaleWithItems } from "@/types/sales";
import { formatCurrency } from "@/lib/helpers/format";

import { DataTable } from "@/components/data/data-table";
import { Button } from "@/components/ui/button";
import { DeleteSaleButton } from "@/components/sales/delete-sale-button";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type SalesTableProps = {
  sales: SaleWithItems[];

  currentPage: number;
  totalPages: number;
  totalTransactions: number;

  search: string;
};

function safeText(value: unknown) {
  return String(value ?? "");
}

function getSaleItems(sale: SaleWithItems) {
  return Array.isArray(sale.sales_items) ? sale.sales_items : [];
}

function generatePagination(currentPage: number, totalPages: number) {
  const pages: (number | string)[] = [];

  if (totalPages <= 10) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  pages.push(1);

  if (currentPage > 4) {
    pages.push("...");
  }

  const startPage = Math.max(2, currentPage - 2);
  const endPage = Math.min(totalPages - 1, currentPage + 2);

  for (let page = startPage; page <= endPage; page++) {
    pages.push(page);
  }

  if (currentPage < totalPages - 3) {
    pages.push("...");
  }

  pages.push(totalPages);

  return pages;
}

export function SalesTable({
  sales,
  currentPage,
  totalPages,
  totalTransactions,
  search,
}: SalesTableProps) {

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // =========================
  // STATE SEARCH
  // =========================
  const [searchInput, setSearchInput] = useState(search || "");

  // =========================
  // SYNC DARI URL (ANTI LOOP FIX)
  // =========================
  useEffect(() => {
    setSearchInput(search || "");
  }, [search]);

  // =========================
  // LIVE SEARCH (DEBOUNCE + ANTI LOOP)
  // =========================
  useEffect(() => {
    const delay = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (searchInput.trim()) {
        params.set("search", searchInput.trim());
      } else {
        params.delete("search");
      }

      params.set("page", "1");

      const newUrl = `${pathname}?${params.toString()}`;

      if (window.location.search !== `?${params.toString()}`) {
        router.push(newUrl);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [searchInput, pathname, router, searchParams]);

  // =========================
  // QUERY STRING PAGINATION
  // =========================
  const createQueryString = (params: Record<string, string | number>) => {
    const query = new URLSearchParams();

    if (searchInput) {
      query.set("search", searchInput);
    }

    Object.entries(params).forEach(([key, value]) => {
      query.set(key, String(value));
    });

    return query.toString();
  };

  return (
    <div className="space-y-5">

      {/* ================= SEARCH FORM (UI TETAP) ================= */}
      <form
        action="/transaksi"
        method="GET"
        className="rounded-3xl border border-border bg-card/80 p-4 shadow-sm"
      >
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          {/* 🔥 ONLY CHANGE HERE (defaultValue → value + onChange) */}
          <input
            type="text"
            name="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Cari invoice, pelanggan, atau metode pembayaran..."
            className="h-12 w-full rounded-2xl border border-border bg-background px-4 pl-11 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary/40 focus:ring-4 focus:ring-primary/10"
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Menampilkan{" "}
            <span className="font-semibold text-foreground">
              {sales.length}
            </span>{" "}
            dari{" "}
            <span className="font-semibold text-foreground">
              {totalTransactions}
            </span>{" "}
            transaksi.
          </p>

          <div className="flex gap-2">

            {/* ================= RESET FIX (NO LOOP) ================= */}
            {search && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSearchInput("");
                  router.push("/transaksi");
                }}
              >
                <PackageSearch className="mr-2 h-4 w-4" />
                Reset Pencarian
              </Button>
            )}

          </div>
        </div>
      </form>

      {/* ================= INFO BAR (UNCHANGED) ================= */}
      <div className="rounded-3xl border border-border bg-card/80 p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Search className="h-4 w-4" />

            <span>
              Halaman{" "}
              <span className="font-semibold text-foreground">
                {currentPage}
              </span>{" "}
              dari{" "}
              <span className="font-semibold text-foreground">
                {totalPages}
              </span>
            </span>
          </div>

          <div className="text-sm text-muted-foreground">
            Total transaksi:{" "}
            <span className="font-semibold text-foreground">
              {totalTransactions}
            </span>
          </div>

        </div>
      </div>

      {/* ================= TABLE (UNCHANGED) ================= */}
      <DataTable<SaleWithItems>
        data={sales}
        getRowKey={(sale) => sale.id}
        emptyTitle={
          totalTransactions === 0
            ? "Belum ada transaksi"
            : "Transaksi tidak ditemukan"
        }
        emptyDescription={
          totalTransactions === 0
            ? "Tambahkan transaksi pertama agar sistem dapat membaca pola penjualan, stok, analitik, dan prediksi AI."
            : "Tidak ada transaksi yang sesuai dengan pencarian saat ini."
        }
        emptyAction={
          totalTransactions === 0 ? (
            <Button asChild>
              <Link href="/transaksi/tambah">
                <Plus className="mr-2 h-4 w-4" />
                Tambah Transaksi
              </Link>
            </Button>
          ) : (
            <Button asChild variant="outline">
              <Link href="/transaksi">
                <PackageSearch className="mr-2 h-4 w-4" />
                Reset Pencarian
              </Link>
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
              const totalQty = getSaleItems(sale).reduce(
                (total, item) => total + Number(item.quantity ?? 0),
                0
              );

              return (
                <span className="font-medium text-foreground">
                  {totalQty} qty
                </span>
              );
            },
          },
          {
            key: "payment_method",
            header: "Pembayaran",
            render: (sale) => (
              <span className="text-sm font-medium uppercase text-muted-foreground">
                {safeText(sale.payment_method) || "-"}
              </span>
            ),
          },
          {
            key: "sale_date",
            header: "Tanggal",
            render: (sale) => {
              const date = sale.sale_date
                ? new Date(sale.sale_date)
                : null;

              const isValidDate =
                date && !Number.isNaN(date.getTime());

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

      {/* ================= PAGINATION (UNCHANGED) ================= */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-end">
          <div className="flex items-center gap-1 rounded-xl border border-border bg-card/50 p-1">

            <Link
              href={`?${createQueryString({
                page: Math.max(currentPage - 1, 1),
              })}`}
              className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
                currentPage === 1
                  ? "pointer-events-none opacity-40"
                  : "hover:bg-accent"
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
            </Link>

            {generatePagination(currentPage, totalPages).map((page, index) =>
              page === "..." ? (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 text-sm text-muted-foreground"
                >
                  ...
                </span>
              ) : (
                <Link
                  key={page}
                  href={`?${createQueryString({
                    page: page as number,
                  })}`}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition ${
                    page === currentPage
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent"
                  }`}
                >
                  {page}
                </Link>
              )
            )}

            <Link
              href={`?${createQueryString({
                page: Math.min(currentPage + 1, totalPages),
              })}`}
              className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
                currentPage === totalPages
                  ? "pointer-events-none opacity-40"
                  : "hover:bg-accent"
              }`}
            >
              <ChevronRight className="h-4 w-4" />
            </Link>

          </div>
        </div>
      )}
    </div>
  );
}