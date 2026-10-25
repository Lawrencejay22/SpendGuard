import type { Metadata, Viewport } from "next";
import "./globals.css";
import { WalletProvider } from "@/components/wallet-provider";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export const metadata: Metadata = {
  title: "SpendGuard — Your money. Your limits. Your control.",
  description:
    "A spending-protection wallet for Stellar Hackathon. Every payment automatically saves 10% on-chain, enforced by Paiflow on Stellar Testnet.",
  keywords: ["Stellar", "Paiflow", "SpendGuard", "Fintech", "Wallet", "Soroban", "Smart Contracts"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#0B1014] text-[#F2F7F5] font-sans antialiased">
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}
