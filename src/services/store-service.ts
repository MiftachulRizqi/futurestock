import { createClient } from "@/lib/supabase/server";

export async function getCurrentStore() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: existingMember } = await supabase
    .from("store_members")
    .select(
      `
      role,
      stores (
        id,
        name,
        business_type,
        city,
        country,
        address,
        owner_id
      )
    `
    )
    .eq("user_id", user.id)
    .limit(1)
    .single();

  if (existingMember?.stores) {
    return {
      role: existingMember.role,
      store: Array.isArray(existingMember.stores)
        ? existingMember.stores[0]
        : existingMember.stores,
    };
  }

  const { data: store, error: storeError } = await supabase
    .from("stores")
    .insert({
      name: "Toko FutureStock",
      business_type: "UMKM Retail",
      country: "Indonesia",
      owner_id: user.id,
    })
    .select(
      `
      id,
      name,
      business_type,
      city,
      country,
      address,
      owner_id
    `
    )
    .single();

  if (storeError) {
    throw new Error(storeError.message);
  }

  const { error: memberError } = await supabase
    .from("store_members")
    .insert({
      store_id: store.id,
      user_id: user.id,
      role: "owner",
    });

  if (memberError) {
    throw new Error(memberError.message);
  }

  return {
    role: "owner",
    store,
  };
}