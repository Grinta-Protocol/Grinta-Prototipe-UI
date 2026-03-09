import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, Percent, Bitcoin, ShieldAlert, Copy, ExternalLink, Check, Globe, ChevronDown, FileText, Twitter, Disc, Send } from 'lucide-react';
import { useVaults } from '../context/VaultContext';
import { useRates } from '../hooks/useGrinta';
import { useBitcoinPrice } from '../hooks/useBitcoinPrice';
import { config } from '../config/contracts';
import WalletConnect from './WalletConnect';
import { useTranslation } from 'react-i18next';

export default function RightPanel() {
  const { t, i18n } = useTranslation();
  const [langOpen, setLangOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const { market } = useVaults();
  const { redemptionPrice, redemptionRate, collateralPrice, liquidationRatio, loading } = useRates();
  const { price: btcPrice } = useBitcoinPrice();

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

  const gritTokenAddress = config.gritTokenAddress;
  const shortAddress = `${gritTokenAddress.slice(0, 6)}...${gritTokenAddress.slice(-4)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(gritTokenAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const btcFormatted = btcPrice ? `$${btcPrice.usd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '...';

  return (
    <div className="w-80 space-y-6 animate-in fade-in duration-1000">

      {/* Language & Wallet Cluster - Elevated z-index */}
      <div className="flex items-center justify-between bg-grinta-bg/80 backdrop-blur-xl p-1.5 rounded-full border border-white/10 shadow-2xl w-full relative z-[60]">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-1.5 h-8 px-3 rounded-full bg-white/5 border border-white/5 text-white font-extrabold text-[10px] hover:bg-white/10 transition-all"
          >
            <Globe size={12} className="text-grinta-accent" />
            <span>{currentLang.label}</span>
            <ChevronDown size={10} className={`transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`} />
          </button>

          {langOpen && (
            <div className="absolute top-full left-0 mt-2 w-24 bg-[#0D0F10] border border-white/10 rounded-2xl p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl z-[70]">
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

        {/* Separator */}
        <div className="h-4 w-[1px] bg-white/10"></div>

        <WalletConnect variant="nav" />
      </div>

      {/* GRIT Token Highlight Card */}
      <div className="bg-grinta-card border border-grinta-accent/30 rounded-3xl p-6 backdrop-blur-md relative overflow-hidden shadow-[0_0_30px_rgba(74,222,128,0.15),inset_0_1px_2px_rgba(255,255,255,0.15)] group">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-grinta-accent/5 pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-grinta-accent flex items-center justify-center shadow-[0_0_15px_rgba(74,222,128,0.4)]">
              <div className="w-4 h-4 bg-black rounded-sm rotate-45"></div>
            </div>
            <div className="text-lg font-bold text-white tracking-wide">GRIT Token</div>
          </div>

          <div className="flex items-center justify-between bg-black/40 border border-white/10 rounded-xl p-3">
            <span className="font-mono text-sm text-grinta-text-secondary">{shortAddress}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-grinta-text-secondary hover:text-white transition-colors"
                title="Copy Address"
              >
                {copied ? <Check size={14} className="text-grinta-accent" /> : <Copy size={14} />}
              </button>
            </div>
          </div>
        </div>
      </div>


      {/* GRINTA OFFICIAL PAPER */}
      <Link
        to="/app/papel"
        className="block p-5 rounded-[28px] bg-white/5 border border-white/5 hover:border-grinta-accent/30 hover:bg-white/10 transition-all group relative overflow-hidden shadow-lg"
      >
        <div className="absolute top-4 right-4 text-grinta-text-secondary group-hover:text-grinta-accent group-hover:scale-110 transition-all">
          <ExternalLink size={16} />
        </div>
        <div className="flex items-center gap-3 mb-2">
          <FileText size={16} className="text-grinta-accent" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">{t('sidebar.official_paper')}</span>
        </div>
        <p className="text-[11px] text-grinta-text-secondary leading-tight">
          {t('sidebar.official_paper_desc')}
        </p>
      </Link>

      {/* FEEDBACK */}
      <a
        href="https://x.com/intent/post?text=Grinta%20seems%20to%20me%20something...%20&url=https://x.com/reflecterlabs/status/2030450172182909259&hashtags=GrintaProtocol,Starknet,BTCFi"
        target="_blank"
        rel="noopener noreferrer"
        className="block p-5 rounded-[28px] bg-white/5 border border-white/5 hover:border-grinta-accent/30 hover:bg-white/10 transition-all group relative overflow-hidden shadow-lg"
      >
        <div className="absolute top-4 right-4 text-grinta-text-secondary group-hover:text-grinta-accent group-hover:scale-110 transition-all">
          <Twitter size={16} />
        </div>
        <div className="flex items-center gap-3 mb-2">
          <Twitter size={16} className="text-grinta-text-secondary group-hover:text-grinta-accent" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">{t('sidebar.feedback')}</span>
        </div>
        <p className="text-[11px] text-grinta-text-secondary leading-tight">
          {t('sidebar.feedback_desc')}
        </p>
      </a>

      {/* JOIN TELEGRAM COMMUNITY */}
      <a
        href="https://t.me/reflecterlabsproducts/2"
        target="_blank"
        rel="noopener noreferrer"
        className="block p-5 rounded-[28px] bg-[#24A1DE]/5 border border-[#24A1DE]/20 hover:border-[#24A1DE]/50 hover:bg-[#24A1DE]/10 transition-all group relative overflow-hidden shadow-lg"
      >
        <div className="absolute top-4 right-4 text-grinta-text-secondary group-hover:text-[#24A1DE] group-hover:scale-110 transition-all">
          <Send size={16} />
        </div>
        <div className="flex items-center gap-3 mb-2">
          <Send size={16} className="text-[#24A1DE]" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">{t('sidebar.join_telegram')}</span>
        </div>
        <p className="text-[11px] text-grinta-text-secondary leading-tight">
          {t('sidebar.telegram_desc')}
        </p>
      </a>

    </div>
  );
}
