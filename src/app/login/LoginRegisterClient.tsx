"use client";

import Image from "next/image";
import { useActionState, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Boxes,
  Eye,
  EyeOff,
  Leaf,
  LockKeyhole,
  Mail,
  Send,
  ShieldCheck,
  ShoppingBasket,
  Sparkles,
  Store,
  UserRound,
} from "lucide-react";
import { forgotPasswordAction, loginAction, registerAction } from "./actions";
import { initialAuthActionState } from "./authTypes";

type AuthMode = "login" | "register" | "forgot";

type LoginRegisterClientProps = {
  next: string;
  initialMode: AuthMode;
};

export default function LoginRegisterClient({
  next,
  initialMode,
}: LoginRegisterClientProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  const [loginState, loginFormAction, loginPending] = useActionState(
    loginAction,
    initialAuthActionState
  );

  const [registerState, registerFormAction, registerPending] = useActionState(
    registerAction,
    initialAuthActionState
  );

  const [forgotState, forgotFormAction, forgotPending] = useActionState(
    forgotPasswordAction,
    initialAuthActionState
  );

  const isLogin = mode === "login";
  const isRegister = mode === "register";
  const isForgot = mode === "forgot";
  const isPending = loginPending || registerPending || forgotPending;

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("mode", mode);

    if (!url.searchParams.get("next")) {
      url.searchParams.set("next", next);
    }

    window.history.replaceState(null, "", url.toString());
  }, [mode, next]);

  const activeError = useMemo(() => {
    if (isLogin && loginState.status === "error") return loginState.message;
    if (isRegister && registerState.status === "error") {
      return registerState.message;
    }
    if (isForgot && forgotState.status === "error") return forgotState.message;

    return "";
  }, [isLogin, isRegister, isForgot, loginState, registerState, forgotState]);

  const formWrapperHeight = isForgot
    ? "min-h-[500px]"
    : isRegister
      ? "min-h-[610px]"
      : "min-h-[450px]";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F7FBF7] px-4 py-8 text-[#102418] md:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(46,125,59,0.14),transparent_30%),radial-gradient(circle_at_90%_20%,rgba(196,224,188,0.34),transparent_32%),radial-gradient(circle_at_50%_100%,rgba(226,239,220,0.65),transparent_38%),linear-gradient(135deg,#fbfefb,#f0f8f1,#ffffff)]" />
      <div className="absolute -left-24 top-24 h-80 w-80 rounded-full bg-emerald-200/35 blur-3xl" />
      <div className="absolute -right-28 bottom-20 h-96 w-96 rounded-full bg-lime-200/35 blur-3xl" />
      <div className="absolute left-1/2 top-8 h-40 w-40 -translate-x-1/2 rounded-full bg-white/80 blur-3xl" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full max-w-6xl overflow-hidden rounded-[38px] border border-white/80 bg-white/65 shadow-[0_40px_120px_rgba(16,36,24,0.16)] backdrop-blur-2xl lg:grid-cols-[1.02fr_0.98fr]">
          <section className="relative order-2 px-5 py-8 md:px-10 md:py-10 lg:order-1 lg:px-12 lg:py-12">
            <div className="absolute left-8 top-8 hidden h-16 w-16 rounded-full bg-emerald-50 lg:block" />
            <div className="absolute bottom-8 right-8 hidden h-24 w-24 rounded-full border border-emerald-100 lg:block" />

            <div className="relative mx-auto w-full max-w-md">
              <div className="mb-7">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-primary shadow-sm">
                  <ShieldCheck className="h-4 w-4" />
                  FutureStock Auth
                </div>

                <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-[#102418] md:text-4xl">
                  {isRegister
                    ? "Buat akun toko"
                    : isForgot
                      ? "Lupa password?"
                      : "Masuk ke workspace"}
                </h1>

                <p className="text-sm font-medium leading-relaxed text-[#5E6761] md:text-base">
                  {isRegister
                    ? "Daftar untuk mulai mengelola produk, transaksi, stok, laporan, dan prediksi inventory dalam satu sistem."
                    : isForgot
                      ? "Masukkan email aktif yang terdaftar. Link reset password akan dikirim ke email tersebut."
                      : "Masuk untuk memantau stok, transaksi, prediksi AI, dead stock, laporan, dan performa bisnis Anda."}
                </p>
              </div>

              {!isForgot && (
                <div className="mb-7 grid grid-cols-2 rounded-2xl border border-primary/15 bg-primary/10 p-1.5 shadow-inner">
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    disabled={isPending}
                    className={`rounded-xl px-4 py-2.5 text-sm font-extrabold transition ${
                      isLogin
                        ? "bg-white text-primary shadow-sm"
                        : "text-[#6A746E] hover:text-primary"
                    } disabled:cursor-not-allowed disabled:opacity-60`}
                  >
                    Masuk
                  </button>

                  <button
                    type="button"
                    onClick={() => setMode("register")}
                    disabled={isPending}
                    className={`rounded-xl px-4 py-2.5 text-sm font-extrabold transition ${
                      isRegister
                        ? "bg-white text-primary shadow-sm"
                        : "text-[#6A746E] hover:text-primary"
                    } disabled:cursor-not-allowed disabled:opacity-60`}
                  >
                    Daftar
                  </button>
                </div>
              )}

              <div className={`relative overflow-hidden ${formWrapperHeight}`}>
                <form
                  action={loginFormAction}
                  className={`absolute inset-0 flex flex-col gap-4 transition-all duration-500 ease-in-out ${
                    isLogin
                      ? "translate-x-0 opacity-100"
                      : "-translate-x-8 pointer-events-none opacity-0"
                  }`}
                >
                  <input type="hidden" name="next" value={next} />

                  <AuthField
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="contoh@email.com"
                    icon={<Mail className="h-4 w-4" />}
                    disabled={isPending}
                    error={loginState.fieldErrors?.email}
                  />

                  <AuthField
                    label="Password"
                    name="password"
                    type={showLoginPassword ? "text" : "password"}
                    placeholder="Masukkan password"
                    icon={<LockKeyhole className="h-4 w-4" />}
                    disabled={isPending}
                    error={loginState.fieldErrors?.password}
                    labelRight={
                      <button
                        type="button"
                        onClick={() => setMode("forgot")}
                        disabled={isPending}
                        className="text-xs font-extrabold text-primary transition hover:text-primary/80 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Lupa password?
                      </button>
                    }
                    rightElement={
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword((prev) => !prev)}
                        disabled={isPending}
                        className="flex items-center justify-center text-[#8A948D] transition hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
                        aria-label={
                          showLoginPassword
                            ? "Sembunyikan password"
                            : "Tampilkan password"
                        }
                      >
                        {showLoginPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    }
                  />

                  {activeError && isLogin ? (
                    <AlertMessage tone="error">{activeError}</AlertMessage>
                  ) : null}

                  <div className="mt-8 space-y-3">
                    <button
                      type="submit"
                      disabled={isPending}
                      className="group inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-primary px-5 py-3.5 text-sm font-extrabold uppercase tracking-wide text-white shadow-[0_18px_38px_rgba(34,120,63,0.28)] transition hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-[0_22px_48px_rgba(34,120,63,0.34)] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {loginPending ? "Memproses..." : "Masuk ke Dashboard"}

                      {!loginPending && (
                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                      )}
                    </button>

                    <p className="text-center text-sm font-semibold text-[#5E6761]">
                      Belum punya akun?{" "}
                      <button
                        type="button"
                        onClick={() => setMode("register")}
                        disabled={isPending}
                        className="font-extrabold text-primary transition hover:text-primary/80 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Daftar sekarang
                      </button>
                    </p>
                  </div>
                </form>

                <form
                  action={registerFormAction}
                  className={`absolute inset-0 space-y-4 transition-all duration-500 ease-in-out ${
                    isRegister
                      ? "translate-x-0 opacity-100"
                      : "translate-x-8 pointer-events-none opacity-0"
                  }`}
                >
                  <input type="hidden" name="next" value={next} />

                  <AuthField
                    label="Nama Lengkap"
                    name="full_name"
                    placeholder="Nama pemilik toko"
                    icon={<UserRound className="h-4 w-4" />}
                    disabled={isPending}
                    error={registerState.fieldErrors?.full_name}
                  />

                  <AuthField
                    label="Nama Toko"
                    name="store_name"
                    placeholder="Contoh: Toko Sumber Makmur"
                    icon={<Store className="h-4 w-4" />}
                    disabled={isPending}
                    error={registerState.fieldErrors?.store_name}
                  />

                  <AuthField
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="contoh@email.com"
                    icon={<Mail className="h-4 w-4" />}
                    disabled={isPending}
                    error={registerState.fieldErrors?.email}
                  />

                  <AuthField
                    label="Password"
                    name="password"
                    type={showRegisterPassword ? "text" : "password"}
                    placeholder="Minimal 6 karakter"
                    icon={<LockKeyhole className="h-4 w-4" />}
                    disabled={isPending}
                    error={registerState.fieldErrors?.password}
                    rightElement={
                      <button
                        type="button"
                        onClick={() =>
                          setShowRegisterPassword((prev) => !prev)
                        }
                        disabled={isPending}
                        className="flex items-center justify-center text-[#8A948D] transition hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
                        aria-label={
                          showRegisterPassword
                            ? "Sembunyikan password"
                            : "Tampilkan password"
                        }
                      >
                        {showRegisterPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    }
                  />

                  <AlertMessage tone="info">
                    Setelah akun dibuat, sistem akan menyiapkan workspace toko
                    untuk pengelolaan inventory FutureStock.
                  </AlertMessage>

                  {activeError && isRegister ? (
                    <AlertMessage tone="error">{activeError}</AlertMessage>
                  ) : null}

                  <button
                    type="submit"
                    disabled={isPending}
                    className="group inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-primary px-5 py-3.5 text-sm font-extrabold uppercase tracking-wide text-white shadow-[0_18px_38px_rgba(34,120,63,0.28)] transition hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-[0_22px_48px_rgba(34,120,63,0.34)] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {registerPending ? "Mendaftarkan..." : "Buat Akun"}

                    {!registerPending && (
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    )}
                  </button>

                  <p className="text-center text-sm font-semibold text-[#5E6761]">
                    Sudah punya akun?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("login")}
                      disabled={isPending}
                      className="font-extrabold text-primary transition hover:text-primary/80 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Masuk
                    </button>
                  </p>
                </form>

                <form
                  action={forgotFormAction}
                  className={`absolute inset-0 flex flex-col gap-3 transition-all duration-500 ease-in-out ${
                    isForgot
                      ? "translate-x-0 opacity-100"
                      : "translate-x-8 pointer-events-none opacity-0"
                  }`}
                >
                  <div className="rounded-3xl border border-primary/15 bg-primary/10 px-5 py-4 shadow-sm">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-primary shadow-sm">
                      <Send className="h-5 w-5" />
                    </div>

                    <h2 className="text-lg font-extrabold text-[#102418]">
                      Reset password akun
                    </h2>

                    <p className="mt-1 text-sm font-medium leading-relaxed text-[#5E6761]">
                      Link reset akan dikirim ke email aktif yang terdaftar di
                      akun FutureStock Anda.
                    </p>

                    {forgotState.status !== "success" && (
                      <AlertMessage className="mt-3" tone="info">
                        Gunakan email yang bisa diakses agar link reset password
                        dapat diterima melalui inbox atau folder spam.
                      </AlertMessage>
                    )}
                  </div>

                  <AuthField
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="contoh@email.com"
                    icon={<Mail className="h-4 w-4" />}
                    disabled={isPending}
                    error={forgotState.fieldErrors?.email}
                  />

                  {forgotState.status === "success" ? (
                    <AlertMessage tone="success">
                      Link reset password telah dikirim. Silakan cek inbox atau
                      folder spam email Anda.
                    </AlertMessage>
                  ) : null}

                  {activeError && isForgot ? (
                    <AlertMessage tone="error">{activeError}</AlertMessage>
                  ) : null}

                  <div className="mt-3 space-y-3">
                    <button
                      type="submit"
                      disabled={isPending}
                      className="group inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-primary px-5 py-3.5 text-sm font-extrabold uppercase tracking-wide text-white shadow-[0_18px_38px_rgba(34,120,63,0.28)] transition hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-[0_22px_48px_rgba(34,120,63,0.34)] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {forgotPending ? "Mengirim..." : "Kirim Link Reset"}

                      {!forgotPending && (
                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setMode("login")}
                      disabled={isPending}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-primary/20 bg-white px-5 py-3 text-sm font-bold text-primary transition hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Kembali ke Login
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </section>

          <aside className="relative order-1 overflow-hidden bg-primary px-6 py-10 text-white md:px-10 lg:order-2 lg:px-12 lg:py-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.30),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(16,36,24,0.32),transparent_38%),linear-gradient(135deg,#5ca767,#2f7d3b,#1f5f2e)]" />
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10" />
            <div className="absolute -bottom-28 -left-24 h-72 w-72 rounded-full bg-white/10" />
            <div className="absolute right-8 top-1/2 h-28 w-28 rounded-full border border-white/15" />
            <div className="absolute left-10 top-24 h-16 w-16 rounded-full bg-white/10" />
            <div className="absolute right-12 top-10 h-36 w-44 bg-[radial-gradient(circle,rgba(255,255,255,0.55)_1.2px,transparent_1.2px)] [background-size:14px_14px] opacity-25" />

            <div className="relative z-10 flex h-full min-h-[360px] flex-col">
              <div>
                <div className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full bg-white/15 px-4 py-2.5 ring-1 ring-white/20 backdrop-blur">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-primary">
                    <ShoppingBasket className="h-3.5 w-3.5" />
                  </div>

                  <p className="whitespace-nowrap text-xs font-extrabold uppercase tracking-wide text-white">
                    FutureStock Smart Inventory
                  </p>
                </div>

                <h2 className="mb-3 max-w-none text-3xl font-extrabold leading-[1.08] text-white md:text-4xl lg:text-[52px]">
                  {isRegister ? (
                    <span className="block text-white">
                      Bangun workspace inventory.
                    </span>
                  ) : isForgot ? (
                    <>
                      <span className="block whitespace-nowrap text-white">
                        Pulihkan akses
                      </span>
                      <span className="block whitespace-nowrap text-white">
                        akun Anda.
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="block whitespace-nowrap text-white">
                        Masuk dan
                      </span>
                      <span className="block whitespace-nowrap text-white">
                        kelola stok.
                      </span>
                    </>
                  )}
                </h2>

                <p className="max-w-md text-sm font-semibold leading-relaxed text-white/90 md:text-base">
                  {isRegister
                    ? "Akun digunakan untuk membuat workspace toko, mengelola produk, transaksi, dan laporan inventory."
                    : isForgot
                      ? "Gunakan email aktif yang terdaftar untuk mendapatkan link reset password dengan aman."
                      : "Pantau stok, transaksi, analytics, dead stock, dan prediksi kebutuhan inventory dalam satu sistem."}
                </p>
              </div>

              <div className="flex flex-1 items-center justify-center py-8">
                <div className="relative w-full max-w-[430px]">
                  <div className="absolute inset-x-8 bottom-2 h-20 rounded-full bg-black/20 blur-2xl" />

                  <div className="relative overflow-hidden rounded-[34px] bg-white/14 p-5 ring-1 ring-white/20 backdrop-blur">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),transparent_38%)]" />
                    <Image
                      src="/images/auth-inventory-illustration.png"
                      alt="Ilustrasi FutureStock"
                      width={1200}
                      height={1200}
                      priority
                      unoptimized
                      className="relative z-10 mx-auto max-h-[330px] w-full object-contain drop-shadow-[0_24px_35px_rgba(0,0,0,0.28)]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <MiniFeature
                  icon={<BarChart3 className="h-4 w-4" />}
                  title="Forecast"
                />
                <MiniFeature icon={<Boxes className="h-4 w-4" />} title="Stock" />
                <MiniFeature icon={<Leaf className="h-4 w-4" />} title="Eco" />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function AuthField({
  label,
  name,
  type = "text",
  placeholder,
  icon,
  disabled,
  error,
  rightElement,
  labelRight,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  icon: React.ReactNode;
  disabled: boolean;
  error?: string;
  rightElement?: React.ReactNode;
  labelRight?: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <label className="block text-sm font-extrabold text-[#102418]">
          {label}
        </label>
        {labelRight}
      </div>

      <div className="relative">
        <div
          className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 ${
            error ? "text-red-500" : "text-primary/70"
          }`}
        >
          {icon}
        </div>

        <input
          className={`w-full rounded-2xl border bg-white px-4 py-3.5 pl-11 pr-12 text-sm font-semibold text-[#102418] outline-none transition placeholder:text-[#8A948D] focus:ring-4 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60 ${
            error
              ? "border-red-200 focus:border-red-300 focus:ring-red-500/10"
              : "border-emerald-900/10 focus:border-primary/40 focus:ring-primary/10"
          }`}
          type={type}
          name={name}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={Boolean(error)}
        />

        {rightElement ? (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function AlertMessage({
  children,
  tone,
  className = "",
}: {
  children: React.ReactNode;
  tone: "info" | "success" | "error";
  className?: string;
}) {
  const toneClass =
    tone === "success"
      ? "border-emerald-100 bg-emerald-50 text-emerald-700"
      : tone === "error"
        ? "border-red-100 bg-red-50 text-red-700"
        : "border-amber-100 bg-amber-50 text-amber-700";

  return (
    <div
      className={`rounded-2xl border px-4 py-3 text-xs font-semibold leading-relaxed ${toneClass} ${className}`}
    >
      {children}
    </div>
  );
}

function MiniFeature({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="rounded-2xl bg-white/15 p-4 ring-1 ring-white/20 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white text-primary">
        {icon}
      </div>
      <p className="text-sm font-extrabold text-white">{title}</p>
    </div>
  );
}