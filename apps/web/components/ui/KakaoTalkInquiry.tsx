"use client";

import { MessageSquare } from "lucide-react";

export function KakaoTalkInquiry() {
  const handleInquiry = () => {
    alert('카카오톡 상담원과 연결합니다. (데모 모드)');
  };

  return (
    <div 
      onClick={handleInquiry}
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
  );
}
