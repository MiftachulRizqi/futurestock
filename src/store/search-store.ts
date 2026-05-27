import { create } from "zustand";

type Product = {
  id: string;
  name: string;
};

type SearchStore = {
  query: string;
  setQuery: (q: string) => void;

  products: Product[];
  setProducts: (p: Product[]) => void;
};

export const useSearchStore = create<SearchStore>((set) => ({
  query: "",
  setQuery: (q) => set({ query: q }),

  products: [],
  setProducts: (p) => set({ products: p }),
}));