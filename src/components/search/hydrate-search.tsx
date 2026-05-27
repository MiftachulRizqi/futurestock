"use client";

import { useEffect } from "react";
import { useSearchStore } from "@/store/search-store";

export function HydrateSearch({
  products,
}: {
  products: { id: string; name: string }[];
}) {
  const setProducts = useSearchStore(
    (state) => state.setProducts
  );

  useEffect(() => {
    setProducts(products);
  }, [products, setProducts]);

  return null;
}