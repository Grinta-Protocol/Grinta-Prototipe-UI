import React, { useState } from 'react';
import { Search, Bell, MessageSquare, Wallet, ChevronDown, LogOut } from 'lucide-react';
import { useAccount, useConnect, useDisconnect } from '@starknet-react/core';

export default function TopBar() {
  const [isWalletDropdownOpen, setIsWalletDropdownOpen] = useState(false);
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';

  return (
    <header className="h-20 flex items-center justify-between px-8 bg-transparent z-10 relative">
      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <div className="relative flex items-center w-full h-10 rounded-full bg-white/5 border border-white/10 px-4 focus-within:border-grinta-accent/50 transition-colors">
          <Search size={16} className="text-grinta-text-secondary" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-transparent border-none outline-none text-sm text-white placeholder:text-grinta-text-secondary ml-3"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 ml-auto">
        <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-grinta-text-secondary hover:text-white transition-colors">
          <Bell size={18} />
        </button>
        <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-grinta-text-secondary hover:text-white transition-colors">
          <MessageSquare size={18} />
        </button>

        {/* Wallet Connection */}
        {isConnected && address ? (
          <button
            onClick={() => disconnect()}
            className="h-10 px-6 rounded-full bg-white/10 border border-grinta-accent/30 text-white font-semibold text-sm flex items-center gap-2 hover:bg-white/15 transition-colors"
          >
            <Wallet size={16} className="text-grinta-accent" />
            <span>{shortAddress}</span>
            <LogOut size={14} className="text-grinta-text-secondary" />
          </button>
        ) : (
          <div
            className="relative"
            onMouseEnter={() => setIsWalletDropdownOpen(true)}
            onMouseLeave={() => setIsWalletDropdownOpen(false)}
          >
            <button className="h-10 px-6 rounded-full bg-grinta-accent text-black font-semibold text-sm flex items-center gap-2 hover:bg-grinta-accent-hover transition-colors shadow-[0_0_15px_rgba(74,222,128,0.3)]">
              <Wallet size={16} />
              <span>Connect Wallet</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${isWalletDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isWalletDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-grinta-card border border-grinta-card-border rounded-2xl p-2 shadow-xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2">
                {connectors.map((connector) => (
                  <button
                    key={connector.id}
                    onClick={() => connect({ connector })}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-xl transition-colors text-white font-medium text-sm"
                  >
                    {connector.name || connector.id}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
