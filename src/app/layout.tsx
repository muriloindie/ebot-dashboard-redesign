import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@fontsource/bungee/400.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { AppearanceProvider } from "@/components/theme/AppearanceProvider";
import { DemoProvider } from "@/components/state/DemoProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Ê-Bot Dashboard",
  description: "Painel operacional Ê-Bot: atendimentos, CRM, automações e API no WhatsApp."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider><AppearanceProvider><DemoProvider>{children}</DemoProvider></AppearanceProvider></ThemeProvider>
      </body>
    </html>
  );
}

