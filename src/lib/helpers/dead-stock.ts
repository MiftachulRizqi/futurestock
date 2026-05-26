import type { Product } from "@/types/product";

export function getDeadStockProducts(products: Product[]) {
  return products.filter((product) => {
    const stock = Number(product.stock);
    const minStock = Number(product.min_stock);

    return (
      product.status === "inactive" ||
      stock === 0 ||
      stock > minStock * 5
    );
  });
}

export function getDeadStockRisk(product: Product) {
  const stock = Number(product.stock);
  const minStock = Number(product.min_stock);

  if (product.status === "inactive") {
    return {
      label: "Nonaktif",
      className: "border-rose-400/20 bg-rose-400/10 text-rose-300",
    };
  }

  if (stock === 0) {
    return {
      label: "Stok Kosong",
      className: "border-red-400/20 bg-red-400/10 text-red-300",
    };
  }

  if (stock > minStock * 8) {
    return {
      label: "Risiko Tinggi",
      className: "border-amber-400/20 bg-amber-400/10 text-amber-300",
    };
  }

  return {
    label: "Perlu Dipantau",
    className: "border-cyan-400/20 bg-cyan-400/10 text-cyan-300",
  };
}