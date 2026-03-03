import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Bot, BarChart3, Wallet, Send, Twitter, Disc } from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { name: 'Manage Safe', icon: LayoutDashboard, path: '/app' },
    { name: 'AI Agents', icon: Bot, path: '/app/agents' },
  ];

  return (
    <aside className="w-64 h-screen bg-[#050708] border-r border-white/5 flex flex-col justify-between fixed left-0 top-0 z-20">
      <div>
        {/* Logo */}
        <Link to="/" className="p-6 flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-grinta-accent flex items-center justify-center">
            <div className="w-4 h-4 bg-black rounded-sm rotate-45"></div>
          </div>
          <span className="text-xl font-bold tracking-wide">Grinta</span>
        </Link>

        {/* Navigation */}
        <nav className="mt-4 px-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            // Exact match for /app, otherwise startsWith for subroutes
            const isActive = item.path === '/app' 
              ? location.pathname === '/app' || location.pathname === '/app/'
              : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-white/5 text-white' 
                    : 'text-grinta-text-secondary hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-grinta-accent' : ''} />
                <span className="font-medium text-sm">{item.name}</span>
                {item.name === 'AI Agents' && (
                  <span className="ml-auto text-[10px] font-bold bg-grinta-accent/20 text-grinta-accent px-2 py-0.5 rounded-full">
                    NEW
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Social Links */}
      <div className="p-6 flex items-center gap-3">
        <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-grinta-text-secondary hover:text-white hover:border-white/30 transition-colors">
          <Send size={16} />
        </button>
        <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-grinta-text-secondary hover:text-white hover:border-white/30 transition-colors">
          <Twitter size={16} />
        </button>
        <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-grinta-text-secondary hover:text-white hover:border-white/30 transition-colors">
          <Disc size={16} />
        </button>
      </div>
    </aside>
  );
}
