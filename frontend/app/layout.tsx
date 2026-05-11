import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "./language-provider";

const sansFont = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const monoFont = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:
      "AI Video Denoiser | Remove Background Noise from MP4 (DeepFilterNet3)",
    template: "%s | ClearVoice AI",
  },
  description:
    "Free online AI video denoising for creators. Upload an MP4 and reduce wind, AC hum, and street noise using DeepFilterNet3—built for Reels, TikTok, and YouTube Shorts.",
  keywords: [
    "video denoise",
    "AI denoise",
    "remove background noise",
    "MP4 denoise",
    "DeepFilterNet",
    "DeepFilterNet3",
    "speech enhancement",
    "影片降噪",
    "AI 降噪",
    "消除雜訊",
    "短影音",
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "zh_TW",
    alternateLocale: ["en_US"],
    url: siteUrl,
    siteName: "ClearVoice AI",
    title: "AI Video Denoiser | ClearVoice AI",
    description:
      "Creators: make dialogue clearer. AI-powered MP4 denoising with DeepFilterNet3—no install, browser upload.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ClearVoice AI — AI video denoiser",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Video Denoiser | ClearVoice AI",
    description:
      "Remove background noise from your videos with DeepFilterNet3. Upload MP4, download cleaner audio.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body
        className={`${sansFont.variable} ${monoFont.variable} antialiased bg-[#0a0a0a] text-[#ededed]`}
      >
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
