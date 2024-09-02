import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Turso Per User Starter",
  description: "Database per user starter with Turso, Kinde, and SQLite",
  openGraph: {
    title: 'Title webtsite',
    description: 'this is the desciption',
    images: 'url/image.png'
  },
  twitter: {
    card: 'summary_large_image',
    site: '',
    title: 'Title webtsite',
    description: 'this is the desciption',
    images: 'url/image.png'
  }

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`bg-rich-black overscroll-none ${inter.className}`}>
        {children}
      </body>
    </html>
  );
}
