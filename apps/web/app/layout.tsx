import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { MessageSquare } from "lucide-react";
import { KakaoTalkInquiry } from "@/components/ui/KakaoTalkInquiry";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "FITCORE - AI Health Coach",
  description: "Your unified AI health and fitness coach.",
};

import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${inter.variable} font-sans bg-fitcore-navy text-white selection:bg-fitcore-green selection:text-black min-h-screen antialiased`}>
        <Providers>
          {children}
        </Providers>
        {/* Google Translate Fallback for other languages */}
        <div id="google_translate_element" style={{ position: 'fixed', bottom: '20px', left: '20px', zIndex: 9999, opacity: 1, visibility: 'hidden' }}></div>
        <Script id="google-translate-script" strategy="afterInteractive">
          {`
            function googleTranslateElementInit() {
              new google.translate.TranslateElement({
                pageLanguage: 'ko',
                includedLanguages: 'ko,en,ja,id,th,vi,zh-CN,es,fr', // High demand languages + fallback
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE
              }, 'google_translate_element');
            }
          `}
        </Script>
        <Script 
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" 
          strategy="afterInteractive"
        />
        <KakaoTalkInquiry />

        {/* PortOne SDK for Payments */}
        <Script 
          src="https://cdn.iamport.kr/v1/iamport.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
