import {
  eachDayOfInterval,
  endOfDay,
  format,
  startOfDay,
  subDays,
} from "date-fns";

import type { SaleWithItems } from "@/types/sales";

export function getDailySalesChartData(
  sales: SaleWithItems[]
) {
  const today = new Date();

  const days = eachDayOfInterval({
    start: subDays(today, 6),
    end: today,
  });

  return days.map((day) => {
    const start = startOfDay(day);
    const end = endOfDay(day);

    const relatedSales = sales.filter((sale) => {
      const saleDate = new Date(sale.sale_date);

      return saleDate >= start && saleDate <= end;
    });

    const revenue = relatedSales.reduce((total, sale) => {
      return total + Number(sale.total_amount);
    }, 0);

    const transactions = relatedSales.length;

    return {
      day: format(day, "EEE"),
      revenue,
      transactions,
    };
  });
}

export function getMonthlyRevenue(
  sales: SaleWithItems[]
) {
  return sales.reduce((total, sale) => {
    return total + Number(sale.total_amount);
  }, 0);
}

export function getTopSellingProducts(
  sales: SaleWithItems[]
) {
  const productMap = new Map<
    string,
    {
      name: string;
      quantity: number;
      revenue: number;
    }
  >();

  sales.forEach((sale) => {
    sale.sales_items.forEach((item) => {
      const existing = productMap.get(item.product_id);

      const quantity = Number(item.quantity);
      const revenue = Number(item.subtotal);

      if (existing) {
        existing.quantity += quantity;
        existing.revenue += revenue;
      } else {
        productMap.set(item.product_id, {
          name: item.products.name,
          quantity,
          revenue,
        });
      }
    });
  });

  return Array.from(productMap.values())
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);
}

export function getInventoryTurnover(
  sales: SaleWithItems[]
) {
  const totalUnitsSold = sales.reduce((total, sale) => {
    return (
      total +
      sale.sales_items.reduce((sum, item) => {
        return sum + Number(item.quantity);
      }, 0)
    );
  }, 0);

  return totalUnitsSold;
}

export function getAiBusinessInsight(params: {
  monthlyRevenue: number;
  totalTransactions: number;
  topSellingName?: string;
}) {
  const {
    monthlyRevenue,
    totalTransactions,
    topSellingName,
  } = params;

  if (totalTransactions === 0) {
    return "Belum ada transaksi untuk dianalisis.";
  }

  if (monthlyRevenue > 10000000) {
    return `Penjualan bulan ini sangat baik. Produk paling aktif saat ini adalah ${topSellingName ?? "produk utama"} dan demand terlihat meningkat.`;
  }

  if (monthlyRevenue > 3000000) {
    return `Performa toko cukup stabil. Fokus pada optimasi stok dan restock produk populer seperti ${topSellingName ?? "produk utama"}.`;
  }

  return `Penjualan masih relatif rendah. Pertimbangkan promo, bundling, atau optimasi produk unggulan untuk meningkatkan transaksi.`;
}