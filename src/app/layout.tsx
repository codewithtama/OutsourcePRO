import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "OutsourcePro - Enterprise ERP",
  description: "Enterprise ERP for outsourcing companies",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-[#f8f9fa] text-[#202124]`}>
        {children}
      </body>
    </html>
  );
}
