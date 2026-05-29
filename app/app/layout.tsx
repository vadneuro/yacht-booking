import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "АрендаЯхтЯлта — шахматка бронирования",
  description: "Управление бронированием яхт в Ялте",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className="h-full">
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
