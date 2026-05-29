import { TablePageSkeleton } from "@/components/skeletons/dashboard-skeletons";

export default function DeadStockLoading() {
  return <TablePageSkeleton stats={3} rows={6} withAction={false} />;
}