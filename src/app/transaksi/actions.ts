"use server";

import { redirect } from "next/navigation";
import { deleteSale, createSale } from "@/services/sales-service";

export async function createSaleAction(formData: FormData) {
  const customerName = String(formData.get("customer_name") || "");
  const paymentMethod = String(formData.get("payment_method") || "cash");

  const productIds = formData.getAll("product_id").map(String);
  const quantities = formData.getAll("quantity").map(Number);
  const unitPrices = formData.getAll("unit_price").map(Number);

  const items = productIds
    .map((productId, index) => ({
      product_id: productId,
      quantity: quantities[index],
      unit_price: unitPrices[index],
    }))
    .filter((item) => item.product_id && item.quantity > 0);

  if (items.length === 0) {
    throw new Error("Minimal pilih 1 produk.");
  }

  await createSale({
    customer_name: customerName,
    payment_method: paymentMethod,
    items,
  });

  redirect("/transaksi");
}

export async function deleteSaleAction(formData: FormData) {
  const saleId = String(formData.get("sale_id") || "");

  if (!saleId) {
    throw new Error("ID transaksi tidak ditemukan.");
  }

  await deleteSale(saleId);

  redirect("/transaksi");
}