"use client";

import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import { useEffect, useState } from "react";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const changeLanguage = (lng: string) => {
    if (lng === 'google') {
      const element = document.getElementById('google_translate_element');
      if (element) {
        element.style.visibility = 'visible';
        alert('구글 자동번역 창이 활성화되었습니다. (화면 하단 확인)');
      }
      return;
    }
    i18n.changeLanguage(lng);
  };

  if (!mounted) return null;

  return (
    <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="px-2 text-gray-400">
        <Globe className="w-4 h-4" />
      </div>
      <select
        value={i18n.language}
        onChange={(e) => changeLanguage(e.target.value)}
        className="bg-transparent text-xs font-bold text-gray-700 dark:text-gray-300 outline-none pr-2 cursor-pointer"
      >
        <option value="ko">한국어</option>
        <option value="en">English</option>
        <option value="ja">日本語</option>
        <option value="google">언어선택</option>
      </select>
    </div>
  );
}
