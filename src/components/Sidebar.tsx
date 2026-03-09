import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BarChart3, Wallet, Twitter, Disc, PlusCircle, FileText, Github, Send, ExternalLink, Linkedin } from 'lucide-react';
import { useAccount } from '@starknet-react/core';
import { useVaults } from '../context/VaultContext';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
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

    if (onClose) onClose();
  };

  const menuItems = [
    { name: t('sidebar.dashboard'), icon: BarChart3, path: '/app' },
    { name: `${t('sidebar.my_vaults')} (${vaults.length})`, icon: LayoutDashboard, path: '/app/vaults' },
    { name: t('sidebar.wallet'), icon: Wallet, path: '/app/wallet' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside className={`w-64 h-screen bg-[#050708] border-r border-white/5 flex flex-col justify-between fixed left-0 top-0 z-50 overflow-y-auto transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div>
          <div className="flex items-center justify-between p-10 pb-6">
            <Link
              to="/"
              onClick={(e) => handleNavigation(e, '/')}
              className="flex items-center hover:opacity-80 transition-opacity"
            >
              <span className="text-2xl font-extrabold tracking-tighter uppercase font-syncopate text-white">Grinta</span>
            </Link>

            <button onClick={onClose} className="lg:hidden p-2 text-white/50 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>

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
          <div className="mb-4 space-y-4">
            <div className="p-4 rounded-2xl bg-grinta-accent/5 border border-grinta-accent/20">
              <div className="flex items-center gap-2 mb-3">
                <Disc size={14} className="text-grinta-accent opacity-80" />
                <span className="text-[10px] font-black text-white uppercase tracking-wider">Donate Grinta (Mainnet)</span>
              </div>

              <div className="space-y-2">
                <div className="bg-black/40 border border-white/5 rounded-xl p-2 flex items-center justify-between group/copy hover:border-white/10 transition-colors pointer-events-auto">
                  <div>
                    <div className="text-[7px] font-black text-grinta-text-secondary uppercase tracking-widest flex items-center gap-1">Starknet</div>
                    <div className="font-mono text-[9px] text-white/80 tracking-tighter">0x015E...7896</div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText('0x015E2c1491356cdF0621c573a82bc2A9Dd40790EE57f0c5e3705DFF400D97896');
                      alert('Copied Starknet address');
                    }}
                    className="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-grinta-text-secondary hover:text-white transition-colors"
                    title="Copy Starknet Address"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
                  </button>
                </div>

                <div className="bg-black/40 border border-white/5 rounded-xl p-2 flex items-center justify-between group/copy hover:border-white/10 transition-colors pointer-events-auto">
                  <div>
                    <div className="text-[7px] font-black text-grinta-text-secondary uppercase tracking-widest flex items-center gap-1">EVM</div>
                    <div className="font-mono text-[9px] text-white/80 tracking-tighter">0xc4eA...79df</div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText('0xc4eAb635B40bF49907375c3C7bd2495e3fDe79df');
                      alert('Copied EVM address');
                    }}
                    className="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-grinta-text-secondary hover:text-white transition-colors"
                    title="Copy EVM Address"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
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
    </>
  );
}
