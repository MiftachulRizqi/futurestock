"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/services/activity-log-service";

type SaleItemInput = {
  productId: string;
  quantity: number;
  discountPercentage: number;
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

function clampDiscount(value: number) {
  if (Number.isNaN(value)) return 0;
  return Math.min(Math.max(value, 0), 100);
}

function parseSaleItems(formData: FormData): SaleItemInput[] {
  const productIds = formData
    .getAll("product_id")
    .map((value) => String(value || "").trim());

  const quantities = formData
    .getAll("quantity")
    .map((value) => Number(value || 0));

  const discounts = formData
    .getAll("discount_percentage")
    .map((value) => clampDiscount(Number(value || 0)));

  return productIds
    .map((productId, index) => ({
      productId,
      quantity: quantities[index] || 0,
      discountPercentage: discounts[index] || 0,
    }))
    .filter((item) => item.productId && item.quantity > 0);
}

function mergeDuplicateItems(items: SaleItemInput[]) {
  const map = new Map<string, SaleItemInput>();

  for (const item of items) {
    const key = `${item.productId}-${item.discountPercentage}`;
    const existing = map.get(key);

    if (existing) {
      map.set(key, {
        ...existing,
        quantity: existing.quantity + item.quantity,
      });
    } else {
      map.set(key, item);
    }
  }

  return Array.from(map.values());
}

function revalidateSaleRelatedPaths() {
  revalidatePath("/transaksi");
  revalidatePath("/produk");
  revalidatePath("/dashboard");
  revalidatePath("/inventaris");
  revalidatePath("/analitik");
  revalidatePath("/prediksi-ai");
  revalidatePath("/dead-stock");
  revalidatePath("/laporan");
}

export async function createSaleAction(formData: FormData) {
  const { supabase, user, storeId } = await getCurrentStoreId();

  const customerName = String(formData.get("customer_name") || "").trim();
  const paymentMethod = String(formData.get("payment_method") || "cash").trim();

  const rawItems = parseSaleItems(formData);
  const saleItems = mergeDuplicateItems(rawItems);

  if (saleItems.length === 0) {
    throw new Error("Minimal satu produk transaksi wajib diisi.");
  }

  const productIds = Array.from(
    new Set(saleItems.map((item) => item.productId))
  );

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

  const quantityByProduct = new Map<string, number>();

  for (const item of saleItems) {
    quantityByProduct.set(
      item.productId,
      (quantityByProduct.get(item.productId) || 0) + item.quantity
    );
  }

  for (const [productId, quantity] of quantityByProduct.entries()) {
    const product = productMap.get(productId);

    if (!product) {
      throw new Error("Produk tidak ditemukan.");
    }

    if (Number(product.stock) < quantity) {
      throw new Error(`Stok produk ${product.name} tidak mencukupi.`);
    }
  }

  const totalAmount = saleItems.reduce((total, item) => {
    const product = productMap.get(item.productId);
    const unitPrice = Number(product?.price || 0);
    const discountAmount = (unitPrice * item.discountPercentage) / 100;
    const finalUnitPrice = Math.max(unitPrice - discountAmount, 0);

    return total + finalUnitPrice * item.quantity;
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
    const discountAmount = (unitPrice * item.discountPercentage) / 100;
    const finalUnitPrice = Math.max(unitPrice - discountAmount, 0);

    return {
      sale_id: sale.id,
      product_id: item.productId,
      quantity: item.quantity,
      unit_price: unitPrice,
      discount_percentage: item.discountPercentage,
      discount_amount: discountAmount,
      final_unit_price: finalUnitPrice,
      subtotal: finalUnitPrice * item.quantity,
    };
  });

  const { error: itemError } = await supabase
    .from("sales_items")
    .insert(salesItemsPayload);

  if (itemError) {
    await supabase.from("sales").delete().eq("id", sale.id);
    throw new Error(itemError.message || "Item transaksi gagal dibuat.");
  }

  for (const [productId, quantity] of quantityByProduct.entries()) {
    const product = productMap.get(productId);

    if (!product) continue;

    const { error: stockError } = await supabase
      .from("products")
      .update({
        stock: Number(product.stock) - quantity,
        updated_at: new Date().toISOString(),
      })
      .eq("id", productId)
      .eq("store_id", storeId);

    if (stockError) {
      await supabase.from("sales").delete().eq("id", sale.id);

      throw new Error(
        stockError.message || `Stok produk ${product.name} gagal diperbarui.`
      );
    }
  }

  await logActivity({
    storeId,
    userId: user.id,
    action: "create",
    entityType: "sale",
    entityId: sale.id,
    title: "Transaksi baru dibuat",
    description: `Transaksi ${invoiceNumber} berhasil dibuat.`,
    metadata: {
      invoice_number: invoiceNumber,
      customer_name: customerName || "Pelanggan Umum",
      payment_method: paymentMethod,
      total_amount: totalAmount,
      item_count: saleItems.length,
    },
  });

  revalidateSaleRelatedPaths();

  redirect("/transaksi?toast=transaction-created");
}

export async function deleteSaleWithResultAction(formData: FormData) {
  try {
    const { supabase, user, storeId } = await getCurrentStoreId();

    const saleId = String(formData.get("sale_id") || "");

    if (!saleId) {
      return {
        success: false,
        message: "ID transaksi tidak ditemukan.",
      };
    }

    const { data: sale, error: saleError } = await supabase
      .from("sales")
      .select("id, store_id, invoice_number, total_amount")
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

    await logActivity({
      storeId,
      userId: user.id,
      action: "delete",
      entityType: "sale",
      entityId: sale.id,
      title: "Transaksi dihapus",
      description: `Transaksi ${sale.invoice_number} berhasil dihapus.`,
      metadata: {
        invoice_number: sale.invoice_number,
        total_amount: sale.total_amount,
      },
    });

    revalidateSaleRelatedPaths();

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