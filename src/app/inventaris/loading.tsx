import { TablePageSkeleton } from "@/components/skeletons/dashboard-skeletons";

export default function InventarisLoading() {
  return <TablePageSkeleton stats={4} rows={7} withAction={false} />;
}