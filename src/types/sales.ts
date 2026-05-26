export type Sale = {
  id: string;
  store_id: string | null;
  invoice_number: string;
  customer_name: string | null;
  total_amount: number;
  payment_method: string;
  sale_date: string;
  created_at: string;
};

export type SaleItem = {
  id: string;
  sale_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  created_at: string;
};

export type SaleWithItems = Sale & {
  sales_items: Array<
    SaleItem & {
      products: {
        id: string;
        store_id: string | null;
        name: string;
        sku: string;
        category: string;
        stock: number;
        min_stock: number;
        price: number;
        unit: string;
        status: "active" | "inactive";
      };
    }
  >;
};