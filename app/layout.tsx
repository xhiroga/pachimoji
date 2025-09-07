import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GoogleAnalytics from "../components/GoogleAnalytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "パチ文字メーカー | 3D文字作成ツール",
    template: "%s | パチ文字メーカー",
  },
  description:
    "パチンコでよく見る豪華な文字を簡単に作成できる無料のオンライン3Dツール。チラシ、ポスター、SNS投稿用の派手な文字デザインが誰でも簡単に作れます。装甲明朝、玉ねぎ楷書など日本語フォント対応。",
  keywords: [
    "3D文字作成",
    "パチンコ文字",
    "3Dテキストエディター",
    "日本語フォント",
    "チラシデザイン",
    "ポスターデザイン",
    "装甲明朝",
    "玉ねぎ楷書",
    "Noto Sans JP",
    "3D text",
    "pachinko style",
    "Japanese fonts",
    "online 3d editor",
    "text effects",
    "SNS画像",
  ],
  authors: [{ name: "パチ文字メーカー" }],
  creator: "パチ文字メーカー",
  publisher: "パチ文字メーカー",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    alternateLocale: "en_US",
    title: "パチ文字メーカー | 3D文字作成ツール",
    description:
      "パチンコでよく見る豪華な文字を簡単に作成できる無料のオンライン3Dツール。チラシ、ポスター、SNS投稿用の派手な文字デザインが誰でも簡単に作れます。",
    url: "https://pachimoji.sawara.dev",
    siteName: "パチ文字メーカー",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "パチ文字メーカー - 3D文字作成ツール",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "パチ文字メーカー | 3D文字作成ツール",
    description:
      "パチンコでよく見る豪華な文字を簡単に作成できる無料のオンライン3Dツール。チラシ、ポスター、SNS投稿用の派手な文字デザインが誰でも簡単に作れます。",
    images: ["/og-image.png"],
    creator: "@pachimoji",
  },
  alternates: {
    canonical: "https://pachimoji.sawara.dev",
  },
  category: "Design Tools",
  classification: "3D Text Editor",
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
