import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BarChart3, Wallet, Twitter, Disc, PlusCircle, FileText, Github, Send, ExternalLink, Linkedin } from 'lucide-react';
import { useAccount } from '@starknet-react/core';
import { useVaults } from '../context/VaultContext';
import { useTranslation } from 'react-i18next';

export default function Sidebar() {
  const { t } = useTranslation();
  const location = useLocation();
  const { isConnected } = useAccount();
  const { step, setStep, startNewFlow, vaults } = useVaults();

  const isFlowActive = ['connect', 'fund', 'deposit', 'create_vault'].includes(step);

  const handleNavigation = (e: React.MouseEvent, path: string) => {
    if (step === 'vault_view') {
      setStep('main_dashboard');
      return;
    }

    if (isFlowActive) {
      if (!window.confirm(t('sidebar.leave_warning'))) {
        e.preventDefault();
        return;
      }
      setStep('main_dashboard');
    }
  };

  const menuItems = [
    { name: t('sidebar.dashboard'), icon: BarChart3, path: '/app' },
    { name: `${t('sidebar.my_vaults')} (${vaults.length})`, icon: LayoutDashboard, path: '/app/vaults' },
    { name: t('sidebar.wallet'), icon: Wallet, path: '/app/wallet' },
  ];

  return (
    <aside className="w-64 h-screen bg-[#050708] border-r border-white/5 flex flex-col justify-between fixed left-0 top-0 z-20 overflow-y-auto">
      <div>
        <Link
          to="/"
          onClick={(e) => handleNavigation(e, '/')}
          className="p-10 pb-6 flex items-center hover:opacity-80 transition-opacity"
        >
          <span className="text-2xl font-extrabold tracking-tighter uppercase font-syncopate text-white">Grinta</span>
        </Link>

        <nav className="mt-8 px-3 space-y-1">
          <button
            onClick={() => {
              if (isConnected) {
                startNewFlow();
              } else {
                setStep('connect');
              }
            }}
            className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl bg-grinta-accent text-black font-extrabold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_25px_rgba(74,222,128,0.3)] mb-8"
          >
            <PlusCircle size={20} />
            <span>{t('sidebar.new_vault')}</span>
          </button>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.path === '/app'
              ? location.pathname === '/app' || location.pathname === '/app/'
              : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={(e) => handleNavigation(e, item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                  ? 'bg-white/5 text-white shadow-inner'
                  : 'text-grinta-text-secondary hover:bg-white/5 hover:text-white'
                  }`}
              >
                <Icon size={18} className={isActive ? 'text-grinta-accent' : ''} />
                <span className="font-bold text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-6 mt-auto">
        <div className="mb-4">
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 mb-4">
            <p className="text-[10px] text-grinta-text-secondary leading-relaxed font-medium">
              {t('sidebar.made_by')}{' '}
              <a
                href="https://www.reflecterlabs.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-grinta-accent underline transition-colors inline-flex items-center gap-0.5"
              >
                Reflecter Labs <ExternalLink size={8} />
              </a>
            </p>
          </div>

          <div className="flex items-center justify-between px-2">
            <a href="https://github.com/reflecterlabs" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 text-grinta-text-secondary hover:text-white hover:bg-white/10 transition-all">
              <Github size={16} />
            </a>
            <a href="https://x.com/reflecterlabs" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 text-grinta-text-secondary hover:text-white hover:bg-white/10 transition-all">
              <Twitter size={16} />
            </a>
            <a href="https://t.me/reflecterlabsproducts/1" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 text-grinta-text-secondary hover:text-white hover:bg-white/10 transition-all">
              <Send size={16} />
            </a>
            <a href="https://www.linkedin.com/company/reflecterlabslat" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 text-grinta-text-secondary hover:text-white hover:bg-white/10 transition-all">
              <Linkedin size={16} />
            </a>
          </div>
        </div>
      </div>

    </aside>
  );
}
