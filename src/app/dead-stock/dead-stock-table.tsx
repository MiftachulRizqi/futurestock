"use client";

import { useState } from "react";
import Image from "next/image";
import { Product } from "@/types/product";
import { getDeadStockRisk } from "@/lib/helpers/dead-stock";
import { formatCurrency } from "@/lib/helpers/format";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  products: Product[];
};

const ITEMS_PER_PAGE = 5;

export default function DeadStockTable({ products }: Props) {
  if (!products || products.length === 0) return null;

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  const displayedProducts = products.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-2xl border border-border bg-card p-4">
        <table className="w-full text-sm table-fixed border-collapse">
          <thead className="border-b border-border bg-muted/30 text-left text-muted-foreground">
            <tr>
              <th className="p-4 w-1/3">Produk</th>
              <th className="p-4 w-1/6">SKU</th>
              <th className="p-4 w-1/6">Kategori</th>
              <th className="p-4 w-1/6">Stok</th>
              <th className="p-4 w-1/6">Harga</th>
              <th className="p-4 w-1/6">Status</th>
            </tr>
          </thead>
          <tbody>
            {displayedProducts.map((product) => {
              const risk = getDeadStockRisk(product);
              return (
                <tr key={product.id} className="border-b border-border">
                  <td className="p-4 flex items-center gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded-lg border bg-muted flex items-center justify-center">
                      {product.image_url ? (
                        <Image
                          src={product.image_url.trim()}
                          alt={product.name}
                          width={40}
                          height={40}
                          unoptimized
                          className="h-10 w-10 object-cover"
                        />
                      ) : (
                        <span className="text-xs text-muted-foreground">IMG</span>
                      )}
                    </div>
                    <p className="font-semibold truncate">{product.name}</p>
                  </td>
                  <td className="p-4 text-muted-foreground">{product.sku || "-"}</td>
                  <td className="p-4">{product.category}</td>
                  <td className="p-4 font-semibold">{product.stock} {product.unit}</td>
                  <td className="p-4 font-semibold">{formatCurrency(Number(product.price))}</td>
                  <td className="p-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs ${
                        risk.label === "Risiko Tinggi"
                          ? "bg-red-100 text-red-700"
                          : risk.label === "Perlu Dipantau"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {risk.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* PAGINATION */}
        {totalPages > 1 && (
        <div className="mt-6 flex justify-end">
            <div className="flex items-center gap-1 rounded-xl border border-border bg-card/50 p-1">
            {/* PREV */}
            <button
                type="button"
                onClick={() => goToPage(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
                currentPage === 1
                    ? "pointer-events-none opacity-40"
                    : "hover:bg-accent"
                }`}
            >
                <ChevronLeft className="h-4 w-4" />
            </button>

            {/* PAGE NUMBERS */}
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                <button
                    key={page}
                    type="button"
                    onClick={() => goToPage(page)}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition ${
                    page === currentPage
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent"
                    }`}
                >
                    {page}
                </button>
                )
            )}

            {/* NEXT */}
            <button
                type="button"
                onClick={() => goToPage(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
                currentPage === totalPages
                    ? "pointer-events-none opacity-40"
                    : "hover:bg-accent"
                }`}
            >
                <ChevronRight className="h-4 w-4" />
            </button>
            </div>
        </div>
        )}
      </div>
    </div>
  );
}