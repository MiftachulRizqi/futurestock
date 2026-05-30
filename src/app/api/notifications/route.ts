import { NextResponse } from "next/server";
import { getProducts } from "@/services/product-service";
import { getSales } from "@/services/sales-service";
import { getAutomaticStockNotifications } from "@/lib/helpers/stock-notifications";

export async function GET() {
  try {
    const products = await getProducts();
    const sales = await getSales();
    const stockNotifications = getAutomaticStockNotifications(products, sales);
    return NextResponse.json(stockNotifications);
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    return NextResponse.json([], { status: 500 });
  }
}
