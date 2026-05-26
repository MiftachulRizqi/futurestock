import Link from "next/link";
import { ShoppingBasket } from "lucide-react";
import { loginAction } from "./actions";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500">
                <ShoppingBasket className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xl font-bold">FutureStock</p>
                <p className="text-sm text-cyan-300">AI Inventory SaaS</p>
              </div>
            </div>

            <h1 className="text-3xl font-bold">Masuk ke dashboard</h1>
            <p className="mt-2 text-sm text-slate-400">
              Kelola stok, transaksi, dan insight AI toko kamu.
            </p>

            <form action={loginAction} className="mt-8 space-y-4">
              <Input label="Email" name="email" type="email" />
              <Input label="Password" name="password" type="password" />

              <button
                type="submit"
                className="h-11 w-full rounded-xl bg-cyan-400 font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                Masuk
              </button>
            </form>

            <p className="mt-6 text-sm text-slate-400">
              Belum punya akun?{" "}
              <Link href="/register" className="text-cyan-300">
                Daftar
              </Link>
            </p>
          </div>
        </section>

        <section className="hidden bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.25),transparent_35%),linear-gradient(135deg,#020617,#0f172a)] p-10 lg:flex lg:items-end">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.3em] text-violet-300">
              FutureStock AI
            </p>
            <h2 className="mt-4 text-4xl font-bold">
              Forecasting stok real-time untuk toko modern.
            </h2>
          </div>
        </section>
      </div>
    </main>
  );
}

function Input({
  label,
  name,
  type = "text",
}: {
  label: string;
  name: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm text-slate-300">{label}</span>
      <input
        name={name}
        type={type}
        required
        className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition focus:border-cyan-400/40"
      />
    </label>
  );
}