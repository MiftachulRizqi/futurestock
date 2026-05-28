"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, Pencil } from "lucide-react";
import { useMemo, useState } from "react";

import type { Product } from "@/types/product";

import { formatCurrency } from "@/lib/helpers/format";

import { DeleteProductButton } from "./delete-product-button";

type ProductTableProps = {
  products: Product[];
};

export function ProductTable({
  products,
}: ProductTableProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchCategory =
        category === "all" ||
        product.category === category;

      return matchSearch && matchCategory;
    });
  }, [products, search, category]);

  const categories = Array.from(
    new Set(products.map((product) => product.category))
  );

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card/70 p-8 text-center">
        <h2 className="text-lg font-semibold text-foreground">
          Belum ada produk
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Tambahkan produk pertama untuk mulai mengelola inventaris.
        </p>

        <Link
          href="/produk/tambah"
          className="mt-5 inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Tambah Produk
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search & Filter */}
      <div className="flex flex-col gap-4 md:flex-row">
        <input
          type="text"
          placeholder="Cari produk..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-border bg-card px-4 py-2 text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-xl border border-border bg-card px-4 py-2 text-foreground outline-none focus:border-primary"
        >
          <option value="all">Semua Kategori</option>

          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-border bg-card/70">
        <table className="w-full min-w-[980px] text-sm">
          <thead className="bg-card/5 text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">
                Produk
              </th>

              <th className="px-4 py-3 text-left">
                SKU
              </th>

              <th className="px-4 py-3 text-left">
                Kategori
              </th>

              <th className="px-4 py-3 text-left">
                Stok
              </th>

              <th className="px-4 py-3 text-left">
                Harga
              </th>

              <th className="px-4 py-3 text-left">
                Status
              </th>

              <th className="px-4 py-3 text-right">
                Aksi
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.map((product) => (
              <tr
                key={product.id}
                className="border-t border-border transition hover:bg-card/[0.03]"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-border bg-card/5">
                      {product.image_url ? (
                        <Image
                          src={product.image_url.trim()}
                          alt={product.name}
                          width={48}
                          height={48}
                          unoptimized
                          className="h-12 w-12 object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] text-muted-foreground">
                          IMG
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground">
                        {product.name}
                      </p>

                      <p className="truncate text-xs text-muted-foreground">
                        {product.supplier ||
                          "Tanpa supplier"}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3 text-muted-foreground">
                  {product.sku}
                </td>

                <td className="px-4 py-3 text-muted-foreground">
                  {product.category}
                </td>

                <td className="px-4 py-3 text-muted-foreground">
                  {product.stock} {product.unit}
                </td>

                <td className="px-4 py-3 text-muted-foreground">
                  {formatCurrency(Number(product.price))}
                </td>

                <td className="px-4 py-3">
                  <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs text-primary">
                    {product.status === "active"
                      ? "Aktif"
                      : "Nonaktif"}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/produk/${product.id}`}
                      className="inline-flex h-9 items-center justify-center rounded-md bg-secondary px-3 text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
                    >
                      <Eye className="mr-1 h-4 w-4" />
                      Detail
                    </Link>

                    <Link
                      href={`/produk/${product.id}/edit`}
                      className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    >
                      <Pencil className="mr-1 h-4 w-4" />
                      Edit
                    </Link>

                    <DeleteProductButton
                      productId={product.id}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}