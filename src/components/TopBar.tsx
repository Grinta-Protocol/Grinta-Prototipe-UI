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
    <header className="h-20 flex items-center px-8 gap-8 bg-transparent z-10 relative">
      {/* Central Area: Moving Tape */}
      <div className="flex-1 flex items-center justify-center">
        <div className="tape-wrapper max-w-2xl mx-auto rounded-full shadow-lg">
          <div className="tape-text">
            GRINTA PROTOCOL ✦ WBTC x BTCFi ✦ PID CONTROLLER ✦ GRINTA PROTOCOL ✦ WBTC x BTCFi ✦ PID CONTROLLER ✦ GRINTA PROTOCOL ✦ WBTC x BTCFi ✦ PID CONTROLLER ✦ GRINTA PROTOCOL ✦ WBTC x BTCFi ✦ PID CONTROLLER ✦
          </div>
        </div>
      </div>

      {/* Right Area: Wallet Connection */}
      <div className="w-80 flex items-center justify-end">
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
          <div className="relative">
            <button
              onClick={() => setIsWalletDropdownOpen(!isWalletDropdownOpen)}
              className="h-10 px-6 rounded-full bg-grinta-accent text-black font-semibold text-sm flex items-center gap-2 hover:bg-grinta-accent-hover transition-colors shadow-[0_0_15px_rgba(74,222,128,0.3)]"
            >
              <Wallet size={16} />
              <span>Connect Wallet</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${isWalletDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isWalletDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-grinta-card border border-grinta-card-border rounded-2xl p-2 shadow-xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2 z-50">
                {connectors.map((connector) => {
                  let displayName = connector.name || connector.id;
                  if (displayName.toLowerCase().includes('argent')) {
                    displayName = 'Ready Wallet';
                  }

                  return (
                    <button
                      key={connector.id}
                      onClick={() => {
                        connect({ connector });
                        setIsWalletDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-xl transition-colors text-white font-medium text-sm text-left"
                    >
                      <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold text-grinta-accent">
                        {connector.id.charAt(0).toUpperCase()}
                      </div>
                      {displayName}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
