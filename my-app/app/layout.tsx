// layout.tsx
import type { Metadata } from "next";
// Geistフォントの正しいインポート名 (next/font/google からの場合)
import { Inter, Space_Mono } from "next/font/google"; 
import "./globals.css";

// 読み込みエラーを避けるため、標準的なフォント（Inter, Space Mono）を使用
const inter = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: "400",
});

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
      {/* 修正: 確実に動作するフォント変数を適用 */}
      <body
        className={`${inter.variable} ${spaceMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}