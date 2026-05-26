export type Product = {
  id: string;
  store_id: string | null;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  min_stock: number;
  unit: string;
  supplier: string | null;
  barcode: string | null;
  image_url: string | null;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
};