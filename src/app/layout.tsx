import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getProducts } from "@/services/product-service";
import GlobalProvider from "@/components/providers/global-provider";
import { ToastProvider } from "@/components/feedback/toast";
import { GlobalLoadingOverlay } from "@/components/feedback/global-loading-overlay";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FutureStock",
  description: "AI Smart Inventory Forecasting Dashboard",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const products = await getProducts();

  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <GlobalProvider products={products}>
          {children}
          <ToastProvider />
          <GlobalLoadingOverlay />
        </GlobalProvider>
      </body>
    </html>
  );
}