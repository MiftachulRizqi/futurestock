"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  ChevronLeft,
  ChevronRight,
  PackageSearch,
  Search,
} from "lucide-react";

import type { Product } from "@/types/product";

import { formatCurrency } from "@/lib/helpers/format";
import { Button } from "@/components/ui/button";

type InventoryTableProps = {
  products: Product[];
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  search?: string;
};

function generatePagination(
  currentPage: number,
  totalPages: number
) {
  const pages: (number | string)[] = [];

  if (totalPages <= 10) {
    return Array.from(
      { length: totalPages },
      (_, index) => index + 1
    );
  }

  pages.push(1);

  if (currentPage > 4) {
    pages.push("...");
  }

  const startPage = Math.max(
    2,
    currentPage - 2
  );

  const endPage = Math.min(
    totalPages - 1,
    currentPage + 2
  );

  for (
    let page = startPage;
    page <= endPage;
    page++
  ) {
    pages.push(page);
  }

  if (currentPage < totalPages - 3) {
    pages.push("...");
  }

  pages.push(totalPages);

  return pages;
}

export function InventoryTable({
  products,
  currentPage,
  totalPages,
  totalProducts,
  search,
}: InventoryTableProps) {

  const router = useRouter();

  const [searchValue, setSearchValue] =
    useState(() => search ?? "");

  useEffect(() => {
    setSearchValue(search ?? "");
  }, [search]);

  const createQueryString = (
    params: Record<string, string | number>
  ) => {
    const query = new URLSearchParams();

    if (search) {
      query.set("search", search);
    }

    Object.entries(params).forEach(
      ([key, value]) => {
        query.set(key, String(value));
      }
    );

    return query.toString();
  };

  return (
    <div className="space-y-5">

      {/* SEARCH */}
      <div className="rounded-3xl border border-border bg-card/80 p-4 shadow-sm">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <input
            type="text"
            placeholder="Cari produk, SKU, kategori..."
            value={searchValue ?? ""}
            onChange={(e) => {
              const value = e.target.value;

              setSearchValue(value);

              const params =
                new URLSearchParams();

              if (value) {
                params.set("search", value);
              }

              params.set("page", "1");

              router.push(
                `/inventaris?${params.toString()}`
              );
            }}
            className="h-12 w-full rounded-2xl border border-border bg-background px-4 pl-11 text-sm outline-none transition focus:border-primary/40 focus:ring-4 focus:ring-primary/10"
          />
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Menampilkan{" "}
            <strong>{products.length}</strong>
            {" dari "}
            <strong>{totalProducts}</strong>
            {" produk"}
          </span>

          {search && (
            <Button asChild variant="outline">
              <Link href="/inventaris">
                <PackageSearch className="mr-2 h-4 w-4" />
                Reset Pencarian
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* INFO */}
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
            Total produk:{" "}
            <span className="font-semibold text-foreground">
              {totalProducts}
            </span>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/30 text-left text-muted-foreground">
              <tr>
                <th className="p-4">Produk</th>
                <th className="p-4">SKU</th>
                <th className="p-4">Kategori</th>
                <th className="p-4">Stok</th>
                <th className="p-4">Harga</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-10 text-center text-muted-foreground"
                  >
                    Tidak ada produk
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-border"
                  >
                    {/* PRODUCT */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 overflow-hidden rounded-lg border bg-muted">
                          {product.image_url ? (
                            <Image
                              src={product.image_url}
                              alt={product.name}
                              width={40}
                              height={40}
                              unoptimized
                              className="h-10 w-10 object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                              IMG
                            </div>
                          )}
                        </div>

                        <div>
                          <p className="font-semibold">
                            {product.name}
                          </p>

                          <p className="text-xs text-muted-foreground">
                            {product.supplier || "-"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* SKU */}
                    <td className="p-4 text-muted-foreground">
                      {product.sku || "-"}
                    </td>

                    {/* CATEGORY */}
                    <td className="p-4">
                      {product.category}
                    </td>

                    {/* STOCK */}
                    <td className="p-4">
                      <div>
                        <p
                          className={
                            product.stock <=
                            product.min_stock
                              ? "font-semibold text-red-600"
                              : "font-semibold"
                          }
                        >
                          {product.stock}{" "}
                          {product.unit}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          Min {product.min_stock}
                        </p>
                      </div>
                    </td>

                    {/* PRICE */}
                    <td className="p-4 font-semibold">
                      {formatCurrency(
                        Number(product.price)
                      )}
                    </td>

                    {/* STATUS */}
                    <td className="p-4">
                      <span
                        className={
                          product.status ===
                          "active"
                            ? "rounded-full bg-green-100 px-3 py-1 text-xs text-green-700"
                            : "rounded-full bg-red-100 px-3 py-1 text-xs text-red-600"
                        }
                      >
                        {product.status ===
                        "active"
                          ? "Aktif"
                          : "Nonaktif"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-end p-4">
            <div className="flex items-center gap-1 rounded-xl border border-border bg-card/50 p-1">

              {/* PREV */}
              <Link
                href={`?${createQueryString({
                  page: Math.max(
                    currentPage - 1,
                    1
                  ),
                })}`}
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                  currentPage === 1
                    ? "pointer-events-none opacity-40"
                    : "hover:bg-accent"
                }`}
              >
                <ChevronLeft className="h-4 w-4" />
              </Link>

              {/* PAGE NUMBERS */}
              {generatePagination(
                currentPage,
                totalPages
              ).map((page, index) =>
                page === "..." ? (
                  <span
                    key={index}
                    className="px-2 text-sm"
                  >
                    ...
                  </span>
                ) : (
                  <Link
                    key={page}
                    href={`?${createQueryString({
                      page: page as number,
                    })}`}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm ${
                      page === currentPage
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent"
                    }`}
                  >
                    {page}
                  </Link>
                )
              )}

              {/* NEXT */}
              <Link
                href={`?${createQueryString({
                  page: Math.min(
                    currentPage + 1,
                    totalPages
                  ),
                })}`}
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${
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
    </div>
  );
}