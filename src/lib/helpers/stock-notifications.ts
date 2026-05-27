import type { Product } from "@/types/product";
import type { SaleWithItems } from "@/types/sales";
import { getSalesSummaryForAi } from "@/lib/helpers/sales-summary";

export type StockNotificationType =
  | "out-of-stock"
  | "low-stock"
  | "high-demand"
  | "restock-soon"
  | "safe"
  | "ai-insight"
  | "top-selling";

export type StockNotification = {
  id: string;
  type: StockNotificationType;
  title: string;
  message: string;
  productName: string;
  productId?: string;
  stock?: number;
  priority: number;
  timestamp: string;
};

const LOW_STOCK_THRESHOLD = 5;
const PREDICTION_WINDOW_DAYS = 7;
const HIGH_DEMAND_MIN_UNITS = 5;
const HIGH_DEMAND_GROWTH_PERCENT = 40;
const DAY_IN_MS = 24 * 60 * 60 * 1000;

export function getAutomaticStockNotifications(
  products: Product[],
  sales: SaleWithItems[]
): StockNotification[] {
  const summary = getSalesSummaryForAi(products, sales);
  const demandSignals = getDemandSignals(products, sales);

  const outOfStockNotifications = summary
    .filter((item) => item.current_stock <= 0)
    .map((item): StockNotification => ({
      id: `out-of-stock-${item.product_id}`,
      type: "out-of-stock",
      title: "Stok Habis",
      productName: item.name,
      productId: item.product_id,
      message: `${item.name} sudah habis dan perlu segera direstock.`,
      stock: item.current_stock,
      priority: 1,
      timestamp: "Diperbarui otomatis",
    }));

  const lowStockNotifications = summary
    .filter(
      (item) =>
        item.current_stock > 0 && item.current_stock <= LOW_STOCK_THRESHOLD
    )
    .map((item): StockNotification => ({
      id: `low-stock-${item.product_id}`,
      type: "low-stock",
      title: "Stok Hampir Habis",
      productName: item.name,
      productId: item.product_id,
      message: `${item.name} tersisa ${item.current_stock} unit, di bawah batas aman stok.`,
      stock: item.current_stock,
      priority: 2,
      timestamp: "Diperbarui otomatis",
    }));

  const restockSoonNotifications = summary
    .filter((item) => item.current_stock > LOW_STOCK_THRESHOLD)
    .filter((item) => item.average_daily_sales_30d > 0)
    .map((item) => ({
      ...item,
      daysUntilOut: Math.ceil(
        item.current_stock / item.average_daily_sales_30d
      ),
    }))
    .filter((item) => item.daysUntilOut <= PREDICTION_WINDOW_DAYS)
    .map((item): StockNotification => ({
      id: `restock-soon-${item.product_id}`,
      type: "restock-soon",
      title: "Restock Segera",
      productName: item.name,
      productId: item.product_id,
      message: `${item.name} diprediksi habis dalam ${item.daysUntilOut} hari berdasarkan tren penjualan 30 hari terakhir.`,
      stock: item.current_stock,
      priority: 3,
      timestamp: "Prediksi 7 hari",
    }));

  const highDemandNotifications = demandSignals
    .filter((item) => item.currentStock > 0)
    .filter(
      (item) =>
        item.soldLast7Days >= HIGH_DEMAND_MIN_UNITS &&
        item.growthPercent >= HIGH_DEMAND_GROWTH_PERCENT
    )
    .sort((first, second) => second.growthPercent - first.growthPercent)
    .slice(0, 3)
    .map((item): StockNotification => ({
      id: `high-demand-${item.product.id}`,
      type: "high-demand",
      title: "Permintaan Tinggi",
      productName: item.product.name,
      productId: item.product.id,
      message: `${item.product.name} naik ${formatPercent(
        item.growthPercent
      )}% dibanding 7 hari sebelumnya. Siapkan stok tambahan.`,
      stock: item.currentStock,
      priority: 4,
      timestamp: "7 hari terakhir",
    }));

  const highDemandIds = new Set(
    highDemandNotifications.map((notification) => notification.productId)
  );

  const topSellingNotification = [...summary]
    .filter((item) => item.sold_last_7_days > 0)
    .filter((item) => !highDemandIds.has(item.product_id))
    .sort((first, second) => second.sold_last_7_days - first.sold_last_7_days)
    .slice(0, 1)
    .map((item): StockNotification => ({
      id: `top-selling-${item.product_id}`,
      type: "top-selling",
      title: "Produk Penjualan Tinggi",
      productName: item.name,
      productId: item.product_id,
      message: `${item.name} menjadi produk paling aktif dengan ${item.sold_last_7_days} unit terjual dalam 7 hari terakhir.`,
      stock: item.current_stock,
      priority: 5,
      timestamp: "7 hari terakhir",
    }));

  const notifications = [
    ...outOfStockNotifications,
    ...lowStockNotifications,
    ...restockSoonNotifications,
    ...highDemandNotifications,
    ...topSellingNotification,
  ];

  if (notifications.length > 0) {
    return notifications.sort((first, second) => first.priority - second.priority);
  }

  if (products.length === 0) {
    return [];
  }

  return [
    {
      id: "all-stock-safe",
      type: "safe",
      title: "Stok Aman",
      productName: "Semua produk",
      message: "Semua stok produk berada di atas batas minimum saat ini.",
      priority: 6,
      timestamp: "Diperbarui otomatis",
    },
  ];
}

function getDemandSignals(products: Product[], sales: SaleWithItems[]) {
  return products.map((product) => {
    const soldLast7Days = getSoldQuantityBetweenDays(product.id, sales, 0, 7);
    const soldPrevious7Days = getSoldQuantityBetweenDays(
      product.id,
      sales,
      7,
      14
    );
    const growthPercent =
      soldPrevious7Days > 0
        ? ((soldLast7Days - soldPrevious7Days) / soldPrevious7Days) * 100
        : soldLast7Days > 0
          ? 100
          : 0;

    return {
      product,
      currentStock: Number(product.stock),
      soldLast7Days,
      soldPrevious7Days,
      growthPercent: Math.max(0, growthPercent),
    };
  });
}

function getSoldQuantityBetweenDays(
  productId: string,
  sales: SaleWithItems[],
  minDaysAgo: number,
  maxDaysAgo: number
) {
  const now = new Date();

  return sales.reduce((total, sale) => {
    const saleDate = new Date(sale.sale_date);
    const ageInDays = (now.getTime() - saleDate.getTime()) / DAY_IN_MS;

    if (ageInDays < minDaysAgo || ageInDays > maxDaysAgo) {
      return total;
    }

    return (
      total +
      sale.sales_items
        .filter((item) => item.product_id === productId)
        .reduce((sum, item) => sum + Number(item.quantity), 0)
    );
  }, 0);
}

function formatPercent(value: number) {
  return new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 0,
  }).format(value);
}
