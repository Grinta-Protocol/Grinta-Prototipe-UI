import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BarChart3, Wallet, Twitter, Disc, PlusCircle, FileText } from 'lucide-react';
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
          className="p-8 flex items-center hover:opacity-80 transition-opacity"
        >
          <span className="text-2xl font-extrabold tracking-tighter uppercase font-syncopate text-white">Grinta</span>
        </Link>

        <nav className="mt-4 px-3 space-y-1">
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
                  ? 'bg-white/5 text-white'
                  : 'text-grinta-text-secondary hover:bg-white/5 hover:text-white'
                  }`}
              >
                <Icon size={18} className={isActive ? 'text-grinta-accent' : ''} />
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            );
          })}

          <div className="my-6 border-t border-white/5 mx-2"></div>

          <button
            onClick={() => {
              if (isConnected) {
                startNewFlow();
              } else {
                setStep('connect');
              }
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-grinta-accent text-black font-bold text-sm hover:brightness-110 transition-all shadow-[0_0_15px_rgba(74,222,128,0.2)]"
          >
            <PlusCircle size={18} />
            <span>{t('sidebar.new_vault')}</span>
          </button>
        </nav>
      </div>

      <div className="p-4 space-y-3">
        <Link
          to="/app/papel"
          onClick={(e) => handleNavigation(e, '/app/papel')}
          className="block p-4 rounded-2xl bg-[#00FF41]/10 border border-[#00FF41]/20 hover:border-[#00FF41]/50 hover:bg-[#00FF41]/20 transition-all group"
        >
          <div className="flex items-center gap-3 mb-2">
            <FileText size={16} className="text-[#00FF41]" />
            <span className="text-xs font-bold text-[#00FF41] uppercase tracking-wider">{t('sidebar.official_paper')}</span>
          </div>
          <p className="text-[11px] text-gray-400 leading-tight">
            {t('sidebar.official_paper_desc')}
          </p>
        </Link>

        <a
          href="https://x.com/intent/post?text=Grinta%20seems%20to%20me%20something...%20&url=https://x.com/reflecterlabs/status/2030450172182909259&hashtags=GrintaProtocol,Starknet,BTCFi"
          target="_blank"
          rel="noopener noreferrer"
          className="block p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-grinta-accent/30 hover:bg-white/10 transition-all group"
        >
          <div className="flex items-center gap-3 mb-2">
            <Twitter size={16} className="text-grinta-text-secondary group-hover:text-grinta-accent" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">{t('sidebar.feedback')}</span>
          </div>
          <p className="text-[11px] text-grinta-text-secondary leading-tight">
            {t('sidebar.feedback_desc')}
          </p>
        </a>

        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-grinta-accent/30 transition-all group">
          <div className="flex items-center gap-3 mb-2">
            <Disc size={16} className="text-grinta-text-secondary group-hover:text-grinta-accent" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">{t('sidebar.support')}</span>
          </div>
          <p className="text-[11px] text-grinta-text-secondary leading-tight mb-3">
            {t('sidebar.support_desc')}
          </p>
          <button
            onClick={() => {
              navigator.clipboard.writeText('0x038d8939cb8b6f293630d3bfa90e8e097cfe16a03ee2c7186c5f597cbdac9c70');
              alert(t('sidebar.copied'));
            }}
            className="w-full py-2 bg-white/10 border border-white/10 rounded-lg text-[10px] font-bold text-white group-hover:bg-grinta-accent group-hover:text-black group-hover:border-grinta-accent transition-colors uppercase"
          >
            {t('sidebar.copy_address')}
          </button>
        </div>
      </div>
    </aside>
  );
}
