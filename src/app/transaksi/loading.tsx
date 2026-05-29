import { TablePageSkeleton } from "@/components/skeletons/dashboard-skeletons";

export default function TransaksiLoading() {
  return <TablePageSkeleton stats={3} rows={8} withAction />;
}