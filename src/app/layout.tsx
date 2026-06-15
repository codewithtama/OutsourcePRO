import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "OutsourcePro Enterprise ERP",
  description: "Enterprise ERP for outsourcing companies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${outfit.variable} font-sans antialiased bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50`}>
        {children}
      </body>
    </html>
  );
}
