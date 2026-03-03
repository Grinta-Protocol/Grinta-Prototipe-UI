import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function ListSafe() {
  return (
    <div className="relative w-full max-w-2xl mx-auto mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Main Card */}
      <div className="bg-grinta-card border border-grinta-card-border rounded-3xl p-8 backdrop-blur-md relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_2px_rgba(255,255,255,0.15)]">
        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-full h-1/2 bg-[#F7931A]/5 blur-[40px] pointer-events-none"></div>
        
        <h2 className="text-2xl font-bold text-white mb-6">Your SAFEs</h2>

        <div className="space-y-4">
          {/* Latest SAFE (Mock Data) */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-[#F7931A]/30 transition-colors group cursor-pointer">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#F7931A]/20 flex items-center justify-center text-[#F7931A]">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <span className="font-bold text-lg block text-white">SAFE #1042</span>
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
                <div className="font-semibold flex items-center gap-1.5 text-lg text-white">
                  <span className="text-[#F7931A]">₿</span> 0.50 WBTC
                </div>
              </div>
              <div>
                <div className="text-xs text-grinta-text-secondary mb-1">Debt</div>
                <div className="font-semibold text-lg text-white">32,450 GRIT</div>
              </div>
            </div>
            
            <button className="w-full py-3 rounded-xl border border-white/10 text-sm font-semibold text-white hover:bg-white/10 transition-colors group-hover:border-[#F7931A]/50 group-hover:text-[#F7931A]">
              Manage SAFE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
