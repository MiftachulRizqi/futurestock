"use client";

import { useEffect } from "react";
import { useSearchStore } from "@/store/search-store";

export default function GlobalProvider({
  children,
  products,
}: {
  children: React.ReactNode;
  products: any[];
}) {
  const setProducts = useSearchStore((s) => s.setProducts);

  useEffect(() => {
    setProducts(products || []);
  }, [products, setProducts]);

  return children;
}