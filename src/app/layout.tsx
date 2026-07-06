import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@fontsource/bungee/400.css";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Ê-Bot Clinical Dashboard",
  description: "Prototype dashboard for Ê-Bot Clinical healthcare operations."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
