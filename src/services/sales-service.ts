import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentStore } from "@/services/store-service";
import type { SaleWithItems } from "@/types/sales";

async function requireCurrentStoreId() {
  const currentStore = await getCurrentStore();

  if (!currentStore?.store?.id) {
    throw new Error("Store tidak ditemukan. Silakan login ulang.");
  }

  return currentStore.store.id;
}

export async function getSales(): Promise<SaleWithItems[]> {
  const supabase = await createClient();
  const storeId = await requireCurrentStoreId();

  const { data, error } = await supabase
    .from("sales")
    .select(
      `
      *,
      sales_items (
        *,
        products (
          id,
          store_id,
          name,
          sku,
          category,
          stock,
          min_stock,
          price,
          unit,
          status
        )
      )
    `
    )
    .eq("store_id", storeId)
    .order("sale_date", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as SaleWithItems[];
}

export async function createSale(input: {
  customer_name?: string;
  payment_method: string;
  items: {
    product_id: string;
    quantity: number;
    unit_price: number;
  }[];
}) {
  const supabase = await createClient();
  const storeId = await requireCurrentStoreId();

  const totalAmount = input.items.reduce((total, item) => {
    return total + item.quantity * item.unit_price;
  }, 0);

  const invoiceNumber = `INV-${Date.now()}`;

  const { data: sale, error: saleError } = await supabase
    .from("sales")
    .insert({
      store_id: storeId,
      invoice_number: invoiceNumber,
      customer_name: input.customer_name || null,
      payment_method: input.payment_method,
      total_amount: totalAmount,
    })
    .select("id")
    .single();

  if (saleError) {
    throw new Error(saleError.message);
  }

  const saleItems = input.items.map((item) => ({
    sale_id: sale.id,
    product_id: item.product_id,
    quantity: item.quantity,
    unit_price: item.unit_price,
    subtotal: item.quantity * item.unit_price,
  }));

  const { error: itemsError } = await supabase
    .from("sales_items")
    .insert(saleItems);

  if (itemsError) {
    throw new Error(itemsError.message);
  }

  for (const item of input.items) {
    await supabase.rpc("decrease_product_stock", {
      product_id_input: item.product_id,
      quantity_input: item.quantity,
    });
  }

  revalidatePath("/dashboard");
  revalidatePath("/produk");
  revalidatePath("/transaksi");
  revalidatePath("/inventaris");
  revalidatePath("/analitik");
  revalidatePath("/prediksi-ai");
}

export async function deleteSale(saleId: string) {
  const supabase = await createClient();
  const storeId = await requireCurrentStoreId();

  const { data: sale, error: saleError } = await supabase
    .from("sales")
    .select(
      `
      id,
      sales_items (
        product_id,
        quantity
      )
    `
    )
    .eq("id", saleId)
    .eq("store_id", storeId)
    .single();

  if (saleError || !sale) {
    throw new Error("Transaksi tidak ditemukan.");
  }

  for (const item of sale.sales_items) {
    await supabase.rpc("increase_product_stock", {
      product_id_input: item.product_id,
      quantity_input: item.quantity,
    });
  }

  const { error: deleteItemsError } = await supabase
    .from("sales_items")
    .delete()
    .eq("sale_id", saleId);

  if (deleteItemsError) {
    throw new Error(deleteItemsError.message);
  }

  const { error: deleteSaleError } = await supabase
    .from("sales")
    .delete()
    .eq("id", saleId)
    .eq("store_id", storeId);

  if (deleteSaleError) {
    throw new Error(deleteSaleError.message);
  }

  revalidatePath("/dashboard");
  revalidatePath("/transaksi");
  revalidatePath("/produk");
  revalidatePath("/inventaris");
  revalidatePath("/analitik");
  revalidatePath("/prediksi-ai");
}