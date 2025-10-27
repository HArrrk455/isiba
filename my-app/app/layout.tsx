// app/layout.tsx

import type { Metadata } from "next";
// ★修正: 'next/font/google' や 'geist/font' ではなく、'geist/font/sans' と 'geist/font/mono' からインポートする
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import "./globals.css";

// 変数への代入はそのまま
const geistSans = GeistSans;
const geistMono = GeistMono;

export const metadata: Metadata = {
  title: "Aquarium Color Extractor",
  description: "Extracts colors from an image to generate a fish for an aquarium.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        // .variable プロパティはローダーが自動で提供するため、そのまま使用
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}