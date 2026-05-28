import Link from "next/link";
import { ShoppingBasket } from "lucide-react";
import { loginAction } from "./actions";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary">
                <ShoppingBasket className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-xl font-bold">FutureStock</p>
                <p className="text-sm text-primary">AI Inventory SaaS</p>
              </div>
            </div>

            <h1 className="text-3xl font-bold">Masuk ke dashboard</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Kelola stok, transaksi, dan insight AI toko kamu.
            </p>

            <form action={loginAction} className="mt-8 space-y-4">
              <Input label="Email" name="email" type="email" />
              <Input label="Password" name="password" type="password" />

              <button
                type="submit"
                className="h-11 w-full rounded-xl bg-primary font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                Masuk
              </button>
            </form>

            <p className="mt-6 text-sm text-muted-foreground">
              Belum punya akun?{" "}
              <Link href="/register" className="text-primary">
                Daftar
              </Link>
            </p>
          </div>
        </section>

        <section className="hidden bg-[radial-gradient(circle_at_top,rgba(53,138,155,0.25),transparent_35%),linear-gradient(135deg,var(--background),var(--background))] p-10 lg:flex lg:items-end">
          <div className="rounded-3xl border border-border bg-card/5 p-8 backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.3em] text-primary">
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
      <span className="text-sm text-foreground">{label}</span>
      <input
        name={name}
        type={type}
        required
        className="mt-2 h-11 w-full rounded-xl border border-border bg-card/5 px-4 text-sm text-foreground outline-none transition focus:border-primary/40"
      />
    </label>
  );
}