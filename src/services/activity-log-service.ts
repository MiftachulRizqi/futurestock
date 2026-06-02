import { createClient } from "@/lib/supabase/server";
import { getCurrentStore } from "@/services/store-service";

type LogActivityParams = {
  storeId: string;
  userId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  title: string;
  description?: string | null;
  metadata?: Record<string, unknown>;
};

export type ActivityLog = {
  id: string;
  store_id: string;
  user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  title: string;
  description: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
};

export async function logActivity({
  storeId,
  userId,
  action,
  entityType,
  entityId,
  title,
  description,
  metadata = {},
}: LogActivityParams) {
  const supabase = await createClient();

  const { error } = await supabase.from("activity_logs").insert({
    store_id: storeId,
    user_id: userId || null,
    action,
    entity_type: entityType,
    entity_id: entityId || null,
    title,
    description: description || null,
    metadata,
  });

  if (error) {
    console.error("Failed to write activity log:", error.message);
  }
}

export async function getRecentActivityLogs(
  limit = 10
): Promise<ActivityLog[]> {
  const currentStore = await getCurrentStore();

  if (!currentStore?.store?.id) {
    return [];
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("activity_logs")
    .select("*")
    .eq("store_id", currentStore.store.id)
    .order("created_at", {
      ascending: false,
    })
    .limit(limit);

  if (error) {
    console.error(error.message);
    return [];
  }

  return (data ?? []) as ActivityLog[];
}

export async function getPaginatedActivityLogs(
  page = 1,
  pageSize = 10
): Promise<{
  activities: ActivityLog[];
  total: number;
}> {
  const currentStore = await getCurrentStore();

  if (!currentStore?.store?.id) {
    return {
      activities: [],
      total: 0,
    };
  }

  const supabase = await createClient();

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, count, error } = await supabase
    .from("activity_logs")
    .select("*", {
      count: "exact",
    })
    .eq("store_id", currentStore.store.id)
    .order("created_at", {
      ascending: false,
    })
    .range(from, to);

  if (error) {
    console.error(error.message);

    return {
      activities: [],
      total: 0,
    };
  }

  return {
    activities: (data ?? []) as ActivityLog[],
    total: count ?? 0,
  };
}