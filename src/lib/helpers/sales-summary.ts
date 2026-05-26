import type { Product } from "@/types/product";
import type { SaleWithItems } from "@/types/sales";

export function getSalesSummaryForAi(
  products: Product[],
  sales: SaleWithItems[]
) {
  const now = new Date();

  return products.map((product) => {
    const relatedItems = sales.flatMap((sale) => {
      return sale.sales_items
        .filter((item) => item.product_id === product.id)
        .map((item) => ({
          quantity: Number(item.quantity),
          sale_date: sale.sale_date,
          subtotal: Number(item.subtotal),
        }));
    });

    const soldLast7Days = relatedItems
      .filter((item) => {
        const diff =
          now.getTime() - new Date(item.sale_date).getTime();

        return diff <= 7 * 24 * 60 * 60 * 1000;
      })
      .reduce((total, item) => total + item.quantity, 0);

    const soldLast30Days = relatedItems
      .filter((item) => {
        const diff =
          now.getTime() - new Date(item.sale_date).getTime();

        return diff <= 30 * 24 * 60 * 60 * 1000;
      })
      .reduce((total, item) => total + item.quantity, 0);

    const totalSold = relatedItems.reduce((total, item) => {
      return total + item.quantity;
    }, 0);

    const totalRevenue = relatedItems.reduce((total, item) => {
      return total + item.subtotal;
    }, 0);

    const lastSoldAt =
      relatedItems.length > 0
        ? relatedItems
            .map((item) => item.sale_date)
            .sort()
            .reverse()[0]
        : null;

    return {
      product_id: product.id,
      name: product.name,
      sku: product.sku,
      category: product.category,
      current_stock: Number(product.stock),
      min_stock: Number(product.min_stock),
      price: Number(product.price),
      status: product.status,
      sold_last_7_days: soldLast7Days,
      sold_last_30_days: soldLast30Days,
      average_daily_sales_30d: soldLast30Days / 30,
      total_sold: totalSold,
      total_revenue: totalRevenue,
      last_sold_at: lastSoldAt,
    };
  });
}