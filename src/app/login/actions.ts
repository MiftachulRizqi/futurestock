"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
} from "@/lib/validations/auth";
import type { AuthActionState } from "./authTypes";

function getZodFieldErrors(
  fieldErrors: Record<string, string[] | undefined>
): AuthActionState["fieldErrors"] {
  return {
    full_name: fieldErrors.full_name?.[0],
    store_name: fieldErrors.store_name?.[0],
    email: fieldErrors.email?.[0],
    password: fieldErrors.password?.[0],
  };
}

export async function loginAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const supabase = await createClient();

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    next: formData.get("next"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Data login belum valid. Periksa email dan password Anda.",
      fieldErrors: getZodFieldErrors(parsed.error.flatten().fieldErrors),
    };
  }

  const { email, password, next } = parsed.data;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      status: "error",
      message: "Email atau password tidak sesuai.",
      fieldErrors: {},
    };
  }

  redirect(next || "/dashboard");
}

export async function registerAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const supabase = await createClient();

  const parsed = registerSchema.safeParse({
    full_name: formData.get("full_name"),
    store_name: formData.get("store_name"),
    email: formData.get("email"),
    password: formData.get("password"),
    next: formData.get("next"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Data pendaftaran belum valid. Periksa kembali form Anda.",
      fieldErrors: getZodFieldErrors(parsed.error.flatten().fieldErrors),
    };
  }

  const { full_name, store_name, email, password, next } = parsed.data;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name,
      },
    },
  });

  if (error) {
    return {
      status: "error",
      message: error.message || "Pendaftaran belum berhasil.",
      fieldErrors: {},
    };
  }

  const userId = data.user?.id;

  if (!userId) {
    return {
      status: "error",
      message: "Akun belum berhasil dibuat. Silakan coba lagi.",
      fieldErrors: {},
    };
  }

  const { data: store, error: storeError } = await supabase
    .from("stores")
    .insert({
      name: store_name,
      owner_id: userId,
    })
    .select("id")
    .single();

  if (storeError) {
    return {
      status: "error",
      message: storeError.message || "Toko belum berhasil dibuat.",
      fieldErrors: {},
    };
  }

  const { error: memberError } = await supabase.from("store_members").insert({
    store_id: store.id,
    user_id: userId,
    role: "owner",
  });

  if (memberError) {
    return {
      status: "error",
      message: memberError.message || "Membership toko belum berhasil dibuat.",
      fieldErrors: {},
    };
  }

  redirect(next || "/dashboard");
}

export async function forgotPasswordAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const supabase = await createClient();

  const parsed = forgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Format email belum valid.",
      fieldErrors: getZodFieldErrors(parsed.error.flatten().fieldErrors),
    };
  }

  const { email } = parsed.data;

  const headersList = await headers();
  const origin = headersList.get("origin") || "http://localhost:3000";

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/reset-password`,
  });

  if (error) {
    return {
      status: "error",
      message: error.message || "Link reset password belum berhasil dikirim.",
      fieldErrors: {},
    };
  }

  return {
    status: "success",
    message:
      "Link reset password sudah dikirim. Silakan cek inbox atau folder spam email Anda.",
    fieldErrors: {},
  };
}

export async function logoutAction() {
  const supabase = await createClient();

  await supabase.auth.signOut();

  redirect("/login");
}