import React from 'react';
import WalletConnect from './WalletConnect';

export default function TopBar() {
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
        <WalletConnect variant="nav" />
      </div>
    </header>
  );
}
