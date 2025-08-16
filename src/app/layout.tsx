import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CharaRef - Anime Character Color Reference",
  description: "Discover and share color palettes from your favorite anime characters. Upload your own character color schemes for artists and designers.",
  keywords: ["anime", "characters", "colors", "palette", "reference", "art", "design", "CharaRef"],
  authors: [{ name: "CharaRef Team" }],
  openGraph: {
    title: "CharaRef - Anime Character Color Reference",
    description: "Discover and share color palettes from your favorite anime characters",
    url: "https://chararef.com",
    siteName: "CharaRef",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CharaRef - Anime Character Color Reference",
    description: "Discover and share color palettes from your favorite anime characters",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
