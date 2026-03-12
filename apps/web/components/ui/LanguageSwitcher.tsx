"use client";

import { useTranslation } from "react-i18next";
import { Globe, ChevronDown, Check, Sparkles } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LANGUAGES = [
  { code: 'ko', label: '한국어' },
  { code: 'en', label: 'English' },
  { code: 'ja', label: '日本語' },
  { code: 'google', label: '언어선택', icon: <Sparkles className="w-3 h-3 text-fitcore-green" /> }
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageChange = (lng: string) => {
    const googleElement = document.getElementById('google_translate_element');
    
    if (lng === 'google') {
      if (googleElement) {
        googleElement.style.visibility = 'visible';
        googleElement.style.opacity = '1';
        googleElement.scrollIntoView({ behavior: 'smooth' });
      }
      setIsOpen(false);
      return;
    }
    
    // Hide google element when switching back to built-in languages
    if (googleElement) {
      googleElement.style.visibility = 'hidden';
      googleElement.style.opacity = '0';
    }
    
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  if (!mounted) return null;

  const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0]!;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl hover:bg-black/60 transition-all group"
      >
        <Globe className="w-4 h-4 text-gray-400 group-hover:text-fitcore-green transition-colors" />
        <span className="text-xs font-bold text-white uppercase tracking-tighter">
          {currentLang.label}
        </span>
        <ChevronDown className={`w-3 h-3 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 4, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[100]"
          >
            <div className="p-1.5 space-y-1">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    (i18n.language === lang.code) || (lang.code === 'google' && document.getElementById('google_translate_element')?.style.visibility === 'visible' && i18n.language !== 'en' && i18n.language !== 'ja' && i18n.language !== 'ko')
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-blue-500'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {lang.icon}
                    {lang.label}
                  </div>
                  {i18n.language === lang.code && <Check className="w-4 h-4" />}
                  {lang.code === 'google' && <div className="ml-auto bg-fitcore-green/20 text-[8px] px-1.5 py-0.5 rounded text-fitcore-green uppercase font-black">AI</div>}
                </button>
              ))}
            </div>
            
            <div className="bg-gray-50 p-2 border-t border-gray-100">
              <p className="text-[9px] text-gray-400 font-bold uppercase text-center tracking-widest">Powered by Gemini & Google</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
