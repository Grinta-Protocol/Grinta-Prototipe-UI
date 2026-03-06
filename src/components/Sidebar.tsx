import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Bot, BarChart3, Wallet, Send, Twitter, Disc, PlusCircle, Folder, Globe, Activity } from 'lucide-react';
import { useVaults } from '../context/VaultContext';

export default function Sidebar() {
  const location = useLocation();
  const { setStep, startNewFlow, balanceL2, vaults } = useVaults();

  const menuItems = [
    { name: 'Dashboard', icon: BarChart3, path: '/app' },
    { name: `Mis Vaults (${vaults.length})`, icon: LayoutDashboard, path: '/app/vaults' },
    { name: 'Métricas de Red', icon: Globe, path: '/app/metrics' },
    { name: 'Billetera', icon: Wallet, path: '/app/wallet' },
  ];

  const isolatedItems = [
    { name: 'Manage Safe', icon: Activity, path: '/app/manage' },
  ];

  return (
    <aside className="w-64 h-screen bg-[#050708] border-r border-white/5 flex flex-col justify-between fixed left-0 top-0 z-20 overflow-y-auto">
      <div>
        {/* Logo */}
        <Link to="/" className="p-8 flex items-center hover:opacity-80 transition-opacity">
          <span className="text-2xl font-extrabold tracking-tighter uppercase font-syncopate">Grinta</span>
        </Link>

        {/* Navigation */}
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

          {/* Isolated Section: Manage Safe */}
          <div className="pt-6 pb-2 px-2">
            <h3 className="text-[10px] font-bold text-grinta-text-secondary uppercase tracking-widest mb-3 px-2">Core Protocol</h3>
            {isolatedItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                    ? 'bg-grinta-accent/10 text-grinta-accent border border-grinta-accent/20'
                    : 'text-grinta-text-secondary hover:bg-white/5 hover:text-white'
                    }`}
                >
                  <Icon size={18} className={isActive ? 'text-grinta-accent' : ''} />
                  <span className="font-medium text-sm">{item.name}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-grinta-accent animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]"></div>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Separator */}
          <div className="my-6 border-t border-white/5 mx-2"></div>

          {/* New Vault CTA */}
          <button
            onClick={() => {
              if (vaults.length > 0) {
                startNewFlow();
              } else {
                setStep('connect');
              }
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-grinta-accent text-black font-bold text-sm hover:brightness-110 transition-all shadow-[0_0_15px_rgba(74,222,128,0.2)]"
          >
            <PlusCircle size={18} />
            <span>Nuevo Vault</span>
          </button>
        </nav>
      </div>

      {/* Footer Cards */}
      <div className="p-4 space-y-3">
        {/* Feedback Card */}
        <a
          href="https://x.com/intent/post?text=@GrintaProtocol%20Feedback:%20"
          target="_blank"
          rel="noopener noreferrer"
          className="block p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-grinta-accent/30 hover:bg-white/10 transition-all group"
        >
          <div className="flex items-center gap-3 mb-2">
            <Twitter size={16} className="text-grinta-text-secondary group-hover:text-grinta-accent" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">Feedback</span>
          </div>
          <p className="text-[11px] text-grinta-text-secondary leading-tight">
            Share your thoughts on X and help us improve the protocol.
          </p>
        </a>

        {/* Donation Card */}
        <div className="p-4 rounded-2xl bg-grinta-accent/5 border border-grinta-accent/10">
          <div className="flex items-center gap-3 mb-2">
            <Disc size={16} className="text-grinta-accent" />
            <span className="text-xs font-bold text-grinta-accent uppercase tracking-wider">Support us</span>
          </div>
          <p className="text-[10px] text-grinta-text-secondary leading-tight mb-3">
            Donate to help the development of Grinta Protocol.
          </p>
          <button
            onClick={() => {
              navigator.clipboard.writeText('0x040033d6A1F5E78a127898fB39F9B583a2D904B7275D4be21663Eca8Fa915951');
              alert('Address copied to clipboard!');
            }}
            className="w-full py-2 bg-grinta-accent/10 border border-grinta-accent/20 rounded-lg text-[10px] font-bold text-grinta-accent hover:bg-grinta-accent/20 transition-colors uppercase"
          >
            Copy Argent Address
          </button>
        </div>
      </div>
    </aside>
  );
}
