import React, { useState } from 'react';
import { DollarSign, Percent, Bitcoin, ShieldAlert, Copy, ExternalLink, Check } from 'lucide-react';
import { useVaults } from '../context/VaultContext';
import { config } from '../config/contracts';

export default function RightPanel() {
  const [copied, setCopied] = useState(false);
  const { market } = useVaults();

  const gritTokenAddress = config.safeEngineAddress;
  const shortAddress = `${gritTokenAddress.slice(0, 6)}...${gritTokenAddress.slice(-4)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(gritTokenAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-80 space-y-6 animate-in fade-in duration-1000">

      {/* System Status Info */}
      <div className="px-6 py-2 flex items-center justify-between text-[10px] font-bold text-grinta-text-secondary uppercase tracking-[0.2em]">
        <span>System Status</span>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-grinta-accent animate-pulse"></div>
          <span className="text-grinta-accent">Live Simulation</span>
        </div>
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

      {/* Card 1: BTC Price */}
      <div className="bg-grinta-card border border-grinta-card-border rounded-3xl p-6 backdrop-blur-md relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_2px_rgba(255,255,255,0.15)] group">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-full h-1/2 bg-[#F7931A]/5 blur-[40px] pointer-events-none"></div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-[#F7931A] bg-black/20">
            <Bitcoin size={20} />
          </div>
          <div>
            <div className="text-sm font-medium text-grinta-text-secondary mb-1">BTC Price</div>
            <div className="text-2xl font-bold text-white font-mono">
              ${market.btcPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      </div>

      {/* Card 2: Redemption Rate */}
      <div className="bg-grinta-card border border-grinta-card-border rounded-3xl p-6 backdrop-blur-md relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_2px_rgba(255,255,255,0.15)]">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-full h-1/2 bg-blue-500/5 blur-[40px] pointer-events-none"></div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-grinta-text-secondary bg-black/20">
            <Percent size={20} />
          </div>
          <div>
            <div className="text-sm font-medium text-grinta-text-secondary mb-1">Redemption Rate</div>
            <div className="text-2xl font-bold text-white font-mono">
              {market.redemptionRate > 0 ? '+' : ''}{market.redemptionRate.toFixed(4)}%
            </div>
          </div>
        </div>
      </div>

      {/* Card 3: Redemption Price */}
      <div className="bg-grinta-card border border-grinta-card-border rounded-3xl p-6 backdrop-blur-md relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_2px_rgba(255,255,255,0.15)]">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-full h-1/2 bg-grinta-accent/5 blur-[40px] pointer-events-none"></div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-grinta-text-secondary bg-black/20">
            <DollarSign size={20} />
          </div>
          <div>
            <div className="text-sm font-medium text-grinta-text-secondary mb-1">Redemption Price</div>
            <div className="text-2xl font-bold text-white font-mono">
              {market.redemptionPrice.toFixed(4)} USD
            </div>
          </div>
        </div>
      </div>

      {/* Card 4: Liquidation Ratio */}
      <div className="bg-grinta-card border border-grinta-card-border rounded-3xl p-6 backdrop-blur-md relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_2px_rgba(255,255,255,0.15)]">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-full h-1/2 bg-red-500/5 blur-[40px] pointer-events-none"></div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-grinta-text-secondary bg-black/20">
            <ShieldAlert size={20} />
          </div>
          <div>
            <div className="text-sm font-medium text-grinta-text-secondary mb-1">Liquidation Ratio</div>
            <div className="text-2xl font-bold text-white font-mono">{market.liquidationRatio.toFixed(2)}%</div>
          </div>
        </div>
      </div>

    </div>
  );
}
