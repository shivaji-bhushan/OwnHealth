import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppSimulator from "@/components/WhatsAppSimulator";

export const metadata: Metadata = {
  title: "Own Health | Decentralized AI Healthcare Platform",
  description:
    "AI-powered lab test analysis, natural lifestyle protocols, instant doctor WhatsApp alerts, and Web3 IPFS/Sepolia blockchain record immutability.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-clinical-100 selection:text-clinical-900">
        <Navbar />
        <main className="flex-1">{children}</main>
        <WhatsAppSimulator />
        <Footer />
      </body>
    </html>
  );
}
