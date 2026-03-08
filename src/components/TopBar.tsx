import React, { useState, useRef, useEffect } from 'react';
import WalletConnect from './WalletConnect';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown } from 'lucide-react';

export default function TopBar() {
  const { t, i18n } = useTranslation();
  const [langOpen, setLangOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setLangOpen(false);
  };

  const languages = [
    { code: 'en', label: 'EN' },
    { code: 'es', label: 'ES' },
    { code: 'pt', label: 'PT' }
  ];

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

  return (
    <header className="h-20 flex items-center px-8 gap-8 bg-transparent z-10 relative">
      {/* Central Area: Moving Tape */}
      <div className="flex-1 flex items-center justify-center">
        <div className="tape-wrapper max-w-2xl mx-auto rounded-full shadow-lg">
          <div className="tape-text">
            GRINTA PROTOCOL ✦ WBTC x BTCFi ✦ PID CONTROLLER ✦ GRINTA PROTOCOL ✦ WBTC x BTCFi ✦ PID CONTROLLER ✦ GRINTA PROTOCOL ✦ WBTC x BTCFi ✦ PID CONTROLLER ✦ GRINTA PROTOCOL ✦ WBTC x BTCFi ✦ PID CONTROLLER ✦
          </div>
        </div>
      </div>

      {/* Right Area: Wallet Connection & Language */}
      <div className="w-80 flex items-center justify-end gap-4">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-2 h-10 px-4 rounded-full bg-white/5 border border-white/10 text-white font-bold text-xs hover:bg-white/10 transition-all"
          >
            <Globe size={14} className="text-grinta-accent" />
            <span>{currentLang.label}</span>
            <ChevronDown size={12} className={`transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`} />
          </button>

          {langOpen && (
            <div className="absolute top-full right-0 mt-2 w-24 bg-[#0D0F10] border border-white/10 rounded-2xl p-2 shadow-2xl backdrop-blur-xl z-50">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`w-full text-left px-4 py-2 hover:bg-white/5 rounded-xl transition-colors font-bold text-xs ${i18n.language === lang.code ? 'text-grinta-accent' : 'text-white'}`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <WalletConnect variant="nav" />
      </div>
    </header>
  );
}
