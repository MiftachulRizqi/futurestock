"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function registerAction(formData: FormData) {
  const supabase = await createClient();

  const fullName = String(formData.get("full_name") || "");
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const storeName = String(formData.get("store_name") || "");

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  const userId = data.user?.id;

  if (!userId) {
    redirect("/login");
  }

  const { data: store, error: storeError } = await supabase
    .from("stores")
    .insert({
      name: storeName || "Toko Baru",
      owner_id: userId,
    })
    .select("id")
    .single();

  if (storeError) {
    throw new Error(storeError.message);
  }

  const { error: memberError } = await supabase.from("store_members").insert({
    store_id: store.id,
    user_id: userId,
    role: "owner",
  });

  if (memberError) {
    throw new Error(memberError.message);
  }

  redirect("/dashboard");
}