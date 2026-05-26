import type { Product } from "@/types/product";

export function getDashboardMetrics(products: Product[]) {
  const totalProducts = products.length;

  const totalStock = products.reduce((total, product) => {
    return total + Number(product.stock);
  }, 0);

  const inventoryValue = products.reduce((total, product) => {
    return total + Number(product.price) * Number(product.stock);
  }, 0);

  const lowStockProducts = products.filter((product) => {
    return Number(product.stock) <= Number(product.min_stock);
  });

  const inactiveProducts = products.filter((product) => {
    return product.status === "inactive";
  });

  const healthyProducts = products.filter((product) => {
    return (
      product.status === "active" &&
      Number(product.stock) > Number(product.min_stock)
    );
  });

  const inventoryHealth =
    totalProducts === 0
      ? 0
      : Math.round((healthyProducts.length / totalProducts) * 100);

  return {
    totalProducts,
    totalStock,
    inventoryValue,
    lowStockProducts,
    inactiveProducts,
    healthyProducts,
    inventoryHealth,
  };
}