import { TablePageSkeleton } from "@/components/skeletons/dashboard-skeletons";

export default function ProdukLoading() {
  return <TablePageSkeleton rows={8} withAction />;
}