import React, { useState } from 'react';
import { ShieldCheck, MoreVertical, ArrowDownUp, Info, ChevronDown } from 'lucide-react';

export default function SafeActions() {
  const [activeTab, setActiveTab] = useState('new_safe');
  const [amount, setAmount] = useState('0.0');

  const tabs = [
    { id: 'new_safe', label: 'New SAFE' },
    { id: 'safe', label: 'SAFE' }
  ];

  const isSafe = activeTab === 'safe';
  
  // Dynamic classes based on active tab
  const glowBg = isSafe ? 'bg-[#F7931A]' : 'bg-grinta-accent';
  const textAccent = isSafe ? 'text-[#F7931A]' : 'text-grinta-accent';
  const tabActiveShadow = isSafe ? 'shadow-[0_0_15px_rgba(247,147,26,0.2)]' : 'shadow-[0_0_15px_rgba(74,222,128,0.2)]';
  const buttonShadow = isSafe ? 'shadow-[0_0_20px_rgba(247,147,26,0.3)]' : 'shadow-[0_0_20px_rgba(74,222,128,0.3)]';

  return (
    <div className="relative w-full max-w-2xl mx-auto mt-8">
      {/* Background Glow */}
      <div className={`absolute -inset-10 ${glowBg}/20 blur-[100px] rounded-full pointer-events-none transition-colors duration-500`}></div>

      {/* Main Card */}
      <div className="relative bg-grinta-card border border-grinta-card-border rounded-[32px] p-8 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_2px_rgba(255,255,255,0.15)] overflow-hidden transition-colors duration-500">
        
        {/* Glass Shine Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none"></div>

        {/* Inner Glow */}
        <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1/2 ${glowBg}/10 blur-[80px] pointer-events-none transition-colors duration-500`}></div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8 relative z-10">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold tracking-tight">Manage Safe</h1>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-medium text-grinta-text-secondary">
              <ShieldCheck size={14} className={textAccent} />
              Audited
            </div>
          </div>
          <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-grinta-text-secondary hover:text-white hover:bg-white/5 transition-colors">
            <MoreVertical size={18} />
          </button>
        </div>

        {/* APY Info */}
        <div className="flex items-center gap-2 mb-6 text-sm relative z-10">
          <span className="text-grinta-text-secondary">Borrow APY</span>
          <span className={`font-semibold ${textAccent}`}>3.5%</span>
          <Info size={14} className="text-grinta-text-secondary" />
        </div>

        {/* Tabs */}
        <div className="flex p-1 bg-black/40 rounded-2xl mb-8 border border-white/5 relative z-10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
                activeTab === tab.id 
                  ? `${glowBg} text-black ${tabActiveShadow}` 
                  : 'text-grinta-text-secondary hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="relative z-10">
          {activeTab === 'new_safe' ? (
            <div className="relative space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Collateral Input */}
              <div>
                <label className="block text-sm font-medium text-grinta-text-secondary mb-2">Select Collateral</label>
                <div className="flex items-center justify-between bg-grinta-input border border-white/5 rounded-2xl p-4 hover:border-white/10 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#F7931A] flex items-center justify-center text-white font-bold text-xs">
                      ₿
                    </div>
                    <span className="font-semibold text-lg">WBTC</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium bg-white/10 px-2 py-1 rounded-md text-grinta-text-secondary">Balance: 0.00</span>
                    <ChevronDown size={18} className="text-grinta-text-secondary" />
                  </div>
                </div>
              </div>

              {/* Swap Button */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <button className={`w-12 h-12 rounded-full ${glowBg} text-black flex items-center justify-center ${buttonShadow} hover:scale-105 transition-transform`}>
                  <ArrowDownUp size={20} />
                </button>
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-sm font-medium text-grinta-text-secondary mb-2">Enter amount</label>
                <div className="flex items-center justify-between bg-grinta-input border border-white/5 rounded-2xl p-4 hover:border-white/10 transition-colors">
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-grinta-text-secondary mb-1">Max</span>
                    <input 
                      type="text" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="bg-transparent border-none outline-none text-3xl font-bold text-white w-full placeholder:text-white/20"
                      placeholder="0.0"
                    />
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs font-medium text-grinta-text-secondary">~$0.00</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-lg">GRIT</span>
                      <ChevronDown size={18} className="text-grinta-text-secondary" />
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <button className={`w-full mt-8 py-5 rounded-2xl ${glowBg} text-black font-bold text-lg hover:brightness-110 transition-all ${buttonShadow}`}>
                NEW SAFE
              </button>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Latest SAFE (Mock Data) */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-[#F7931A]/30 transition-colors group cursor-pointer">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#F7931A]/20 flex items-center justify-center text-[#F7931A]">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <span className="font-bold text-lg block">SAFE #1042</span>
                      <span className="text-xs text-grinta-text-secondary">Opened 2 days ago</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold bg-grinta-accent/20 text-grinta-accent px-2.5 py-1 rounded-md flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-grinta-accent animate-pulse"></div>
                    Healthy
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 p-4 bg-black/20 rounded-xl mb-4">
                  <div>
                    <div className="text-xs text-grinta-text-secondary mb-1">Collateral</div>
                    <div className="font-semibold flex items-center gap-1.5 text-lg">
                      <span className="text-[#F7931A]">₿</span> 0.50 WBTC
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-grinta-text-secondary mb-1">Debt</div>
                    <div className="font-semibold text-lg">32,450 GRIT</div>
                  </div>
                </div>
                
                <button className="w-full py-3 rounded-xl border border-white/10 text-sm font-semibold hover:bg-white/10 transition-colors group-hover:border-[#F7931A]/50 group-hover:text-[#F7931A]">
                  Close SAFE
                </button>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
