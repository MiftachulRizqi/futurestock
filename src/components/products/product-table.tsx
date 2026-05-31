"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Eye,
  PackageSearch,
  Pencil,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useMemo, useState } from "react";

import type { Product } from "@/types/product";

import { formatCurrency } from "@/lib/helpers/format";
import { DataTable } from "@/components/data/data-table";
import { Button } from "@/components/ui/button";

import { DeleteProductButton } from "./delete-product-button";

type ProductTableProps = {
  products: Product[];
};

function safeText(value: unknown) {
  return String(value ?? "");
}

export function ProductTable({ products }: ProductTableProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const categories = useMemo(() => {
    return Array.from(
      new Set(products.map((product) => safeText(product.category)))
    )
      .filter(Boolean)
      .sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return products.filter((product) => {
      const productName = safeText(product.name).toLowerCase();
      const productSku = safeText(product.sku).toLowerCase();
      const productCategory = safeText(product.category).toLowerCase();
      const productSupplier = safeText(product.supplier).toLowerCase();

      const matchSearch =
        !keyword ||
        productName.includes(keyword) ||
        productSku.includes(keyword) ||
        productCategory.includes(keyword) ||
        productSupplier.includes(keyword);

      const matchCategory =
        category === "all" || safeText(product.category) === category;

      return matchSearch && matchCategory;
    });
  }, [products, search, category]);

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-border bg-card/80 p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <input
              type="text"
              placeholder="Cari nama produk, SKU, kategori, atau supplier..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-12 w-full rounded-2xl border border-border bg-background px-4 pl-11 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary/40 focus:ring-4 focus:ring-primary/10"
            />
          </div>

          <div className="relative md:w-64">
            <SlidersHorizontal className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="h-12 w-full appearance-none rounded-2xl border border-border bg-background px-4 pl-11 text-sm text-foreground outline-none transition focus:border-primary/40 focus:ring-4 focus:ring-primary/10"
            >
              <option value="all">Semua Kategori</option>

              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
          <p>
            Menampilkan{" "}
            <span className="font-semibold text-foreground">
              {filteredProducts.length}
            </span>{" "}
            dari{" "}
            <span className="font-semibold text-foreground">
              {products.length}
            </span>{" "}
            produk.
          </p>

          {(search || category !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("all");
              }}
              className="font-semibold text-primary transition hover:text-primary/80"
            >
              Reset filter
            </button>
          )}
        </div>
      </div>

      <DataTable<Product>
        data={filteredProducts}
        getRowKey={(product) => product.id}
        emptyTitle={
          products.length === 0
            ? "Belum ada produk"
            : "Produk tidak ditemukan"
        }
        emptyDescription={
          products.length === 0
            ? "Tambahkan produk pertama untuk mulai mengelola inventaris, stok, transaksi, dan prediksi AI."
            : "Tidak ada produk yang sesuai dengan pencarian atau filter kategori saat ini."
        }
        emptyAction={
          products.length === 0 ? (
            <Button asChild>
              <Link href="/produk/tambah">
                <Plus className="mr-2 h-4 w-4" />
                Tambah Produk
              </Link>
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setSearch("");
                setCategory("all");
              }}
            >
              <PackageSearch className="mr-2 h-4 w-4" />
              Reset Filter
            </Button>
          )
        }
        columns={[
          {
            key: "name",
            header: "Produk",
            render: (product) => {
              const productName = safeText(product.name) || "Tanpa nama";

              return (
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl border border-border bg-muted">
                    {product.image_url ? (
                      <Image
                        src={product.image_url.trim()}
                        alt={productName}
                        width={48}
                        height={48}
                        unoptimized
                        className="h-12 w-12 object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[10px] font-semibold text-muted-foreground">
                        IMG
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-semibold text-foreground">
                      {productName}
                    </p>

                    <p className="truncate text-xs text-muted-foreground">
                      {safeText(product.supplier) || "Tanpa supplier"}
                    </p>
                  </div>
                </div>
              );
            },
          },
          {
            key: "sku",
            header: "SKU",
            render: (product) => (
              <span className="font-medium text-muted-foreground">
                {safeText(product.sku) || "-"}
              </span>
            ),
          },
          {
            key: "category",
            header: "Kategori",
            render: (product) => (
              <span className="rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {safeText(product.category) || "Tanpa kategori"}
              </span>
            ),
          },
          {
            key: "stock",
            header: "Stok",
            render: (product) => {
              const stock = Number(product.stock ?? 0);
              const minStock = Number(product.min_stock ?? 0);
              const isLowStock = stock <= minStock;

              return (
                <div>
                  <p
                    className={
                      isLowStock
                        ? "font-semibold text-red-600"
                        : "font-semibold text-foreground"
                    }
                  >
                    {stock} {safeText(product.unit) || "unit"}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Min. {minStock} {safeText(product.unit) || "unit"}
                  </p>
                </div>
              );
            },
          },
          {
            key: "price",
            header: "Harga",
            render: (product) => (
              <span className="font-semibold text-foreground">
                {formatCurrency(Number(product.price ?? 0))}
              </span>
            ),
          },
          {
            key: "status",
            header: "Status",
            render: (product) => (
              <div className="flex justify-center">
                <span
                  className={
                    product.status === "active"
                      ? "rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
                      : "rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600"
                  }
                >
                  {product.status === "active" ? "Aktif" : "Nonaktif"}
                </span>
              </div>
            ),
          },
          {
            key: "actions",
            header: "Aksi",
            className: "text-right",
            render: (product) => (
              <div className="flex justify-end gap-2">
                <Button asChild size="sm" variant="outline">
                  <Link href={`/produk/${product.id}`}>
                    <Eye className="mr-1 h-4 w-4" />
                    Detail
                  </Link>
                </Button>

                <Button asChild size="sm">
                  <Link href={`/produk/${product.id}/edit`}>
                    <Pencil className="mr-1 h-4 w-4" />
                    Edit
                  </Link>
                </Button>

                <DeleteProductButton
                  productId={product.id}
                  productName={safeText(product.name)}
                />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}