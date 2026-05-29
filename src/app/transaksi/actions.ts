"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type SaleItemInput = {
  productId: string;
  quantity: number;
};

async function getCurrentStoreId() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Anda harus login terlebih dahulu.");
  }

  const { data: member, error: memberError } = await supabase
    .from("store_members")
    .select("store_id")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  if (memberError || !member?.store_id) {
    throw new Error("Workspace toko tidak ditemukan untuk akun ini.");
  }

  return {
    supabase,
    user,
    storeId: member.store_id as string,
  };
}

function parseSaleItems(formData: FormData): SaleItemInput[] {
  const productIds = formData
    .getAll("product_id")
    .map((value) => String(value || "").trim())
    .filter(Boolean);

  const quantities = formData
    .getAll("quantity")
    .map((value) => Number(value || 0));

  return productIds
    .map((productId, index) => ({
      productId,
      quantity: quantities[index] || 0,
    }))
    .filter((item) => item.productId && item.quantity > 0);
}

function mergeDuplicateItems(items: SaleItemInput[]) {
  const map = new Map<string, number>();

  for (const item of items) {
    map.set(item.productId, (map.get(item.productId) || 0) + item.quantity);
  }

  return Array.from(map.entries()).map(([productId, quantity]) => ({
    productId,
    quantity,
  }));
}

export async function createSaleAction(formData: FormData) {
  const { supabase, storeId } = await getCurrentStoreId();

  const customerName = String(formData.get("customer_name") || "").trim();
  const paymentMethod = String(formData.get("payment_method") || "cash").trim();

  const rawItems = parseSaleItems(formData);
  const saleItems = mergeDuplicateItems(rawItems);

  if (saleItems.length === 0) {
    throw new Error("Minimal satu produk transaksi wajib diisi.");
  }

  const productIds = saleItems.map((item) => item.productId);

  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, name, stock, price, store_id")
    .eq("store_id", storeId)
    .in("id", productIds);

  if (productsError || !products) {
    throw new Error("Produk transaksi gagal dimuat.");
  }

  if (products.length !== productIds.length) {
    throw new Error("Ada produk yang tidak ditemukan di workspace toko ini.");
  }

  const productMap = new Map(products.map((product) => [product.id, product]));

  for (const item of saleItems) {
    const product = productMap.get(item.productId);

    if (!product) {
      throw new Error("Produk tidak ditemukan.");
    }

    if (Number(product.stock) < item.quantity) {
      throw new Error(`Stok produk ${product.name} tidak mencukupi.`);
    }
  }

  const totalAmount = saleItems.reduce((total, item) => {
    const product = productMap.get(item.productId);
    const price = Number(product?.price || 0);

    return total + price * item.quantity;
  }, 0);

  const invoiceNumber = `INV-${Date.now()}`;

  const { data: sale, error: saleError } = await supabase
    .from("sales")
    .insert({
      store_id: storeId,
      invoice_number: invoiceNumber,
      customer_name: customerName || "Pelanggan Umum",
      payment_method: paymentMethod,
      total_amount: totalAmount,
      sale_date: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (saleError || !sale) {
    throw new Error(saleError?.message || "Transaksi gagal dibuat.");
  }

  const salesItemsPayload = saleItems.map((item) => {
    const product = productMap.get(item.productId);
    const unitPrice = Number(product?.price || 0);

    return {
      sale_id: sale.id,
      product_id: item.productId,
      quantity: item.quantity,
      unit_price: unitPrice,
      subtotal: unitPrice * item.quantity,
    };
  });

  const { error: itemError } = await supabase
    .from("sales_items")
    .insert(salesItemsPayload);

  if (itemError) {
    await supabase.from("sales").delete().eq("id", sale.id);

    throw new Error(itemError.message || "Item transaksi gagal dibuat.");
  }

  for (const item of saleItems) {
    const product = productMap.get(item.productId);

    if (!product) continue;

    const { error: stockError } = await supabase
      .from("products")
      .update({
        stock: Number(product.stock) - item.quantity,
        updated_at: new Date().toISOString(),
      })
      .eq("id", item.productId)
      .eq("store_id", storeId);

    if (stockError) {
      await supabase.from("sales").delete().eq("id", sale.id);

      throw new Error(
        stockError.message || `Stok produk ${product.name} gagal diperbarui.`
      );
    }
  }

  revalidatePath("/transaksi");
  revalidatePath("/produk");
  revalidatePath("/dashboard");
  revalidatePath("/inventaris");
  revalidatePath("/analitik");
  revalidatePath("/prediksi-ai");
  revalidatePath("/dead-stock");
  revalidatePath("/laporan");

  redirect("/transaksi");
}

export async function deleteSaleWithResultAction(formData: FormData) {
  try {
    const { supabase, storeId } = await getCurrentStoreId();

    const saleId = String(formData.get("sale_id") || "");

    if (!saleId) {
      return {
        success: false,
        message: "ID transaksi tidak ditemukan.",
      };
    }

    const { data: sale, error: saleError } = await supabase
      .from("sales")
      .select("id, store_id")
      .eq("id", saleId)
      .eq("store_id", storeId)
      .single();

    if (saleError || !sale) {
      return {
        success: false,
        message: "Transaksi tidak ditemukan di workspace toko ini.",
      };
    }

    const { error } = await supabase
      .from("sales")
      .delete()
      .eq("id", saleId)
      .eq("store_id", storeId);

    if (error) {
      return {
        success: false,
        message: error.message || "Transaksi gagal dihapus.",
      };
    }

    revalidatePath("/transaksi");
    revalidatePath("/dashboard");
    revalidatePath("/analitik");
    revalidatePath("/prediksi-ai");
    revalidatePath("/dead-stock");
    revalidatePath("/laporan");

    return {
      success: true,
      message: "Transaksi berhasil dihapus.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat menghapus transaksi.",
    };
  }
}