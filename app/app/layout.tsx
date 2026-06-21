import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Glissa — аренда яхт в Крыму",
  description: "Аренда яхт в Крыму. Моторные, парусные яхты и катамараны. Опытные капитаны. Мгновенное бронирование онлайн.",
  keywords: "аренда яхт, яхта в аренду, яхтенная прогулка, прокат яхт, Ялта, Крым",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col antialiased" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
