import React from 'react';
import { Bot, Zap } from 'lucide-react';

export default function AiAgents() {
  return (
    <div className="relative w-full max-w-2xl mx-auto mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Main Card */}
      <div className="bg-grinta-card border border-grinta-card-border rounded-3xl p-8 backdrop-blur-md relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_2px_rgba(255,255,255,0.15)]">
        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-full h-1/2 bg-grinta-accent/5 blur-[40px] pointer-events-none"></div>
        
        <div className="flex items-center gap-4 mb-6 relative z-10">
          <div className="w-12 h-12 rounded-full bg-grinta-accent/20 flex items-center justify-center text-grinta-accent">
            <Bot size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">AI Agents Hub</h2>
            <p className="text-sm text-grinta-text-secondary">Autonomous Protocol Orchestration</p>
          </div>
        </div>

        <div className="bg-black/20 border border-white/10 rounded-2xl p-6 mb-8 relative z-10">
          <div className="flex items-start gap-4">
            <div className="mt-1 text-grinta-accent">
              <Zap size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Future Orchestration</h3>
              <p className="text-sm text-grinta-text-secondary leading-relaxed">
                This section will orchestrate autonomous agents for x402 and moltx protocols in the future. 
                Agents will be able to manage your SAFEs, optimize collateral, and execute complex DeFi strategies automatically based on your risk profile.
              </p>
            </div>
          </div>
        </div>

        <button className="w-full py-5 rounded-2xl bg-grinta-accent text-black font-bold text-lg hover:brightness-110 transition-all shadow-[0_0_20px_rgba(74,222,128,0.3)] relative z-10">
          CREATE AGENT
        </button>
      </div>
    </div>
  );
}
