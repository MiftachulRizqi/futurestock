import { Bot, Sparkles } from "lucide-react";
import { GlassPanel } from "@/components/shared/glass-panel";
import { AnimatedContainer } from "@/components/shared/animated-container";

export function DashboardHero() {
  return (
    <AnimatedContainer>
      <GlassPanel className="p-6 md:p-8">
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-0 right-32 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />

        <div className="relative grid gap-8 lg:grid-cols-[1.4fr_0.7fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.25em] text-primary">
              <Sparkles className="h-4 w-4" />
              AI Inventory Command Center
            </div>

            <h2 className="mt-6 max-w-3xl text-3xl font-bold tracking-tight text-foreground md:text-5xl">
              Prediksi stok, pantau inventaris, dan cegah dead stock secara
              real-time.
            </h2>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
              FutureStock membantu toko kelontong, UMKM retail, minimarket
              kecil, dan warung modern mengambil keputusan stok lebih cepat
              berbasis data produk real dari database.
            </p>
          </div>

          <div className="rounded-3xl border border-primary/20 bg-card/60 p-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-primary">
              <Bot className="h-8 w-8" />
            </div>

            <p className="mt-5 text-lg font-semibold text-foreground">
              AI Stock Intelligence
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Sistem membaca stok minimum, nilai inventaris, dan produk berisiko
              untuk menghasilkan rekomendasi operasional.
            </p>
          </div>
        </div>
      </GlassPanel>
    </AnimatedContainer>
  );
}