"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Leaf,
  LockKeyhole,
  ShoppingBasket,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type ResetStatus = "checking" | "ready" | "success" | "error";

export function ResetPasswordClient() {
  const [status, setStatus] = useState<ResetStatus>("checking");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    async function prepareSession() {
      const supabase = createClient();

      setStatus("checking");
      setMessage("");

      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          setStatus("error");
          setMessage(
            "Link reset password tidak valid atau sudah kedaluwarsa. Silakan minta link reset ulang."
          );
          return;
        }

        window.history.replaceState(null, "", "/reset-password");
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setStatus("error");
        setMessage(
          "Link reset password tidak valid atau sudah kedaluwarsa. Silakan minta link reset ulang."
        );
        return;
      }

      setStatus("ready");
    }

    prepareSession();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const supabase = createClient();

    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

    if (trimmedPassword.length < 6) {
      setStatus("ready");
      setMessage("Password minimal 6 karakter.");
      return;
    }

    if (trimmedPassword !== trimmedConfirmPassword) {
      setStatus("ready");
      setMessage("Konfirmasi password belum sama.");
      return;
    }

    setPending(true);
    setMessage("");

    const { error } = await supabase.auth.updateUser({
      password: trimmedPassword,
    });

    setPending(false);

    if (error) {
      setStatus("ready");
      setMessage(error.message || "Password belum berhasil diperbarui.");
      return;
    }

    setPassword("");
    setConfirmPassword("");
    setStatus("success");
    setMessage("Password berhasil diperbarui. Silakan login kembali.");

    await supabase.auth.signOut();
  }

  const isChecking = status === "checking";
  const isSuccess = status === "success";
  const isError = status === "error";
  const canSubmit = status === "ready" && !pending;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F5FAF5] px-4 py-8 text-[#102418] md:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,120,63,0.14),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(177,211,171,0.32),transparent_35%),linear-gradient(135deg,#f8fcf8,#eef8ef,#ffffff)]" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full max-w-6xl overflow-hidden rounded-[34px] border border-white/80 bg-white/75 shadow-[0_35px_90px_rgba(16,36,24,0.14)] backdrop-blur-xl lg:grid-cols-[1.05fr_0.95fr]">
          <section className="relative px-5 py-8 md:px-10 md:py-10 lg:px-12 lg:py-12">
            <div className="relative mx-auto flex min-h-[500px] w-full max-w-md flex-col justify-center">
              <div className="mb-6">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-primary">
                  <Sparkles className="h-4 w-4" />
                  FutureStock Security
                </div>

                <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-[#102418] md:text-4xl">
                  Buat password baru
                </h1>

                <p className="text-sm font-medium leading-relaxed text-[#5E6761] md:text-base">
                  Masukkan password baru untuk akun FutureStock Anda. Gunakan
                  password yang kuat agar workspace inventory tetap aman.
                </p>
              </div>

              {isChecking ? (
                <div className="rounded-3xl border border-emerald-100 bg-emerald-50/70 px-5 py-5">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-primary shadow-sm">
                    <Leaf className="h-5 w-5 animate-pulse" />
                  </div>

                  <h2 className="text-lg font-extrabold text-[#102418]">
                    Memeriksa link reset
                  </h2>

                  <p className="mt-2 text-sm font-medium leading-relaxed text-[#5E6761]">
                    Tunggu sebentar, sistem sedang memvalidasi link reset
                    password Anda.
                  </p>
                </div>
              ) : null}

              {!isChecking && message ? (
                <div
                  className={`mb-5 rounded-2xl px-4 py-3 text-sm font-semibold leading-relaxed ${
                    isSuccess
                      ? "border border-emerald-100 bg-emerald-50 text-emerald-700"
                      : "border border-red-100 bg-red-50 text-red-700"
                  }`}
                >
                  {message}
                </div>
              ) : null}

              {status === "ready" ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <PasswordInput
                    label="Password Baru"
                    value={password}
                    onChange={setPassword}
                    show={showPassword}
                    onToggleShow={() => setShowPassword((prev) => !prev)}
                    placeholder="Masukkan password baru"
                    disabled={pending}
                  />

                  <PasswordInput
                    label="Konfirmasi Password"
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    show={showConfirmPassword}
                    onToggleShow={() =>
                      setShowConfirmPassword((prev) => !prev)
                    }
                    placeholder="Ulangi password baru"
                    disabled={pending}
                  />

                  <p className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-xs font-semibold leading-relaxed text-amber-700">
                    Password minimal 6 karakter. Setelah berhasil diperbarui,
                    Anda perlu login kembali menggunakan password baru.
                  </p>

                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className="group inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-primary px-5 py-3.5 text-sm font-extrabold uppercase tracking-wide text-white shadow-[0_18px_38px_rgba(34,120,63,0.28)] transition hover:-translate-y-0.5 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {pending ? "Menyimpan..." : "Simpan Password Baru"}
                    {!pending && <CheckCircle2 className="h-4 w-4" />}
                  </button>
                </form>
              ) : null}

              {isSuccess || isError ? (
                <Link
                  href={isSuccess ? "/login" : "/login?mode=forgot"}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-extrabold text-primary transition hover:text-primary/80"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {isSuccess ? "Kembali ke login" : "Minta link reset ulang"}
                </Link>
              ) : null}
            </div>
          </section>

          <section className="relative hidden overflow-hidden bg-[#F5FAF5] px-12 py-12 lg:block">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,120,63,0.14),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(177,211,171,0.34),transparent_40%)]" />

            <div className="relative z-10 flex h-full min-h-[520px] flex-col justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-xl shadow-primary/20">
                  <ShoppingBasket className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-2xl font-bold tracking-tight text-[#102418]">
                    FutureStock
                  </p>
                  <p className="text-sm font-medium text-primary">
                    AI Inventory SaaS
                  </p>
                </div>
              </div>

              <div>
                <h2 className="max-w-lg text-4xl font-extrabold leading-tight tracking-tight text-[#102418] md:text-5xl">
                  Amankan akses ke workspace inventory Anda.
                </h2>

                <p className="mt-5 max-w-md text-sm font-medium leading-relaxed text-[#5E6761] md:text-base">
                  Reset password membantu menjaga data stok, transaksi, dan
                  insight bisnis tetap aman.
                </p>

                <div className="relative mt-8 flex min-h-[300px] items-center justify-center">
                  <div className="absolute h-56 w-56 rounded-full border border-primary/10 bg-emerald-50/80" />
                  <Image
                    src="/images/auth-inventory-illustration.png"
                    alt="FutureStock inventory illustration"
                    width={520}
                    height={420}
                    priority
                    unoptimized
                    className="relative z-10 w-[350px] object-contain drop-shadow-[0_28px_40px_rgba(16,36,24,0.16)]"
                  />
                </div>
              </div>

              <div className="rounded-3xl border border-emerald-900/10 bg-white/75 p-5 shadow-sm backdrop-blur">
                <p className="font-extrabold text-[#102418]">
                  Secure Inventory Access
                </p>
                <p className="mt-1 text-sm font-medium leading-relaxed text-[#5E6761]">
                  Pastikan hanya pemilik akun yang dapat mengakses dashboard
                  FutureStock.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function PasswordInput({
  label,
  value,
  onChange,
  show,
  onToggleShow,
  placeholder,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  show: boolean;
  onToggleShow: () => void;
  placeholder: string;
  disabled: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-extrabold text-[#102418]">
        {label}
      </label>

      <div className="relative">
        <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/70" />

        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          required
          placeholder={placeholder}
          autoComplete="new-password"
          className="w-full rounded-2xl border border-emerald-900/10 bg-white px-4 py-3.5 pl-11 pr-12 text-sm font-semibold text-[#102418] outline-none transition placeholder:text-[#8A948D] focus:border-primary/40 focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60"
        />

        <button
          type="button"
          onClick={onToggleShow}
          disabled={disabled}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8A948D] transition hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
          aria-label={show ? "Sembunyikan password" : "Tampilkan password"}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}