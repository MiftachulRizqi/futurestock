import type { Product } from "@/types/product";

export function getCategoryStockChartData(products: Product[]) {
  const grouped = products.reduce<Record<string, number>>((acc, product) => {
    acc[product.category] =
      (acc[product.category] ?? 0) + Number(product.stock);

    return acc;
  }, {});

  return Object.entries(grouped).map(([category, stock]) => ({
    category,
    stock,
  }));
}

export function getInventoryValueChartData(products: Product[]) {
  const grouped = products.reduce<Record<string, number>>((acc, product) => {
    const value = Number(product.price) * Number(product.stock);

    acc[product.category] = (acc[product.category] ?? 0) + value;

    return acc;
  }, {});

  return Object.entries(grouped).map(([category, value]) => ({
    category,
    value,
  }));
}