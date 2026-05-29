import { TablePageSkeleton } from "@/components/skeletons/dashboard-skeletons";

export default function DetailProdukLoading() {
  return <TablePageSkeleton stats={3} rows={4} withAction={false} />;
}