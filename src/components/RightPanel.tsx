import React, { useState, useEffect } from 'react';
import { DollarSign, Percent, Bitcoin, ShieldAlert, Copy, ExternalLink, Check, RefreshCw } from 'lucide-react';

export default function RightPanel() {
  const [copied, setCopied] = useState(false);
  const [btcPrice, setBtcPrice] = useState<string>('Loading...');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const gritTokenAddress = "0x02f4f6c374c20ddf3ea5e59cc70f2ad4c2bfb5786ca6c146266f89f7da575421";
  const shortAddress = "0x02f4...5421";

  const fetchBtcPrice = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd', {
        headers: {
          'x-cg-demo-api-key': 'CG-nJgDsRzkgN5LSveHxQNisW8G'
        }
      });
      const data = await response.json();
      if (data.bitcoin && data.bitcoin.usd) {
        setBtcPrice(`$${data.bitcoin.usd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
      } else {
        setBtcPrice('Error');
      }
    } catch (error) {
      console.error('Failed to fetch BTC price:', error);
      setBtcPrice('Error');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchBtcPrice();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(gritTokenAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-80 space-y-6">
      
      {/* GRIT Token Highlight Card */}
      <div className="bg-grinta-card border border-grinta-accent/30 rounded-3xl p-6 backdrop-blur-md relative overflow-hidden shadow-[0_0_30px_rgba(74,222,128,0.15),inset_0_1px_2px_rgba(255,255,255,0.15)] group">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-grinta-accent/5 pointer-events-none"></div>
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-grinta-accent/20 blur-3xl rounded-full group-hover:bg-grinta-accent/30 transition-colors duration-500"></div>
        
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
              <a 
                href={`https://sepolia.voyager.online/contract/${gritTokenAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-grinta-text-secondary hover:text-grinta-accent transition-colors"
                title="View on Voyager"
              >
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Card 1: Redemption Price */}
      <div className="bg-grinta-card border border-grinta-card-border rounded-3xl p-6 backdrop-blur-md relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_2px_rgba(255,255,255,0.15)]">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-full h-1/2 bg-grinta-accent/5 blur-[40px] pointer-events-none"></div>
        
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-grinta-text-secondary bg-black/20">
            <DollarSign size={20} />
          </div>
          <div>
            <div className="text-sm font-medium text-grinta-text-secondary mb-1">Redemption Price</div>
            <div className="text-2xl font-bold text-white">$1.00</div>
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
            <div className="text-2xl font-bold text-white">0%/s</div>
          </div>
        </div>
      </div>

      {/* Card 3: BTC Price */}
      <div className="bg-grinta-card border border-grinta-card-border rounded-3xl p-6 backdrop-blur-md relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_2px_rgba(255,255,255,0.15)] group">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-full h-1/2 bg-[#F7931A]/5 blur-[40px] pointer-events-none"></div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-[#F7931A] bg-black/20">
              <Bitcoin size={20} />
            </div>
            <div>
              <div className="text-sm font-medium text-grinta-text-secondary mb-1">BTC Price</div>
              <div className="text-2xl font-bold text-white">{btcPrice}</div>
            </div>
          </div>
          
          <button 
            onClick={fetchBtcPrice}
            disabled={isRefreshing}
            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-grinta-text-secondary hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50"
            title="Refresh Price"
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin text-[#F7931A]' : ''} />
          </button>
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
            <div className="text-2xl font-bold text-white">150.00%</div>
          </div>
        </div>
      </div>

    </div>
  );
}
