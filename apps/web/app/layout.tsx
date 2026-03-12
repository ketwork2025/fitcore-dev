import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { MessageSquare } from "lucide-react";

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
        {/* KakaoTalk Floating Inquiry Button */}
        <div 
          onClick={() => alert('카카오톡 상담원과 연결합니다. (데모 모드)')}
          className="fixed bottom-6 right-6 z-[9999] group cursor-pointer"
        >
          <div className="flex items-center gap-3 bg-[#FEE500] text-[#3c1e1e] px-4 py-3 rounded-2xl font-black shadow-[0_8px_30px_rgb(254,229,0,0.3)] hover:scale-105 transition-all duration-300 border border-[#fee500]/50 h-[56px]">
            <span className="text-sm">카카오톡 채팅문의</span>
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 fill-current" />
            </div>
          </div>
          <div className="absolute -top-2 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FEE500] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FEE500]"></span>
          </div>
        </div>

        {/* PortOne SDK for Payments */}
        <Script 
          src="https://cdn.iamport.kr/v1/iamport.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
