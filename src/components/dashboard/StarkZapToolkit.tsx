import React, { useState } from 'react';
import { Zap, ArrowRight, RefreshCw, Key, ShieldCheck, ExternalLink, Activity, Info, LogIn, Mail, Twitter, Github, MousePointer2, CreditCard, Bitcoin, Globe, Lock, Layers } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * StarkZapToolkit: The premium Starknet native UX expansion for Grinta Protocol.
 * Employs the official orange/dark aesthetic from StarkZap branding.
 */
export default function StarkZapToolkit() {
    const { t } = useTranslation();
    const [selectedTool, setSelectedTool] = useState<'social' | 'gasless' | 'staking' | 'zap'>('social');

    return (
        <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
            {/* Elegant Branding Header */}
            <div className="relative group overflow-hidden rounded-[48px] bg-[#0A0A0A] border border-orange-500/10 p-12 shadow-2xl transition-all hover:border-orange-500/20">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-orange-500/10 transition-all duration-1000"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                    <div className="w-24 h-24 rounded-3xl bg-orange-500 flex items-center justify-center shadow-[0_0_50px_rgba(249,115,22,0.3)]">
                        <Zap size={48} className="text-black fill-black" />
                    </div>
                    <div className="text-center md:text-left">
                        <div className="flex items-center gap-3 mb-2 justify-center md:justify-start">
                            <span className="px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-[10px] font-black text-orange-500 uppercase tracking-[0.3em]">Official SDK Integration</span>
                        </div>
                        <h2 className="text-5xl font-black text-white uppercase tracking-tighter mb-4 leading-none font-syncopate">StarkZap Core</h2>
                        <p className="text-grinta-text-secondary text-lg max-w-xl font-medium leading-relaxed opacity-70">
                            Bring Bitcoin, Stablecoins, and DeFi to your app in minutes. One TypeScript SDK for wallets, tokens, staking, and gasless transactions.
                        </p>
                    </div>
                </div>
            </div>

            {/* Feature Navigator - StarkZap Style */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <FeatureTab
                    active={selectedTool === 'social'}
                    onClick={() => setSelectedTool('social')}
                    icon={<LogIn size={20} />}
                    label="Social Login"
                    desc="No seed phrases"
                />
                <FeatureTab
                    active={selectedTool === 'gasless'}
                    onClick={() => setSelectedTool('gasless')}
                    icon={<MousePointer2 size={20} />}
                    label="Gasless"
                    desc="Paymaster flows"
                />
                <FeatureTab
                    active={selectedTool === 'staking'}
                    onClick={() => setSelectedTool('staking')}
                    icon={<Bitcoin size={20} />}
                    label="BTC Staking"
                    desc="Native yield"
                />
                <FeatureTab
                    active={selectedTool === 'zap'}
                    onClick={() => setSelectedTool('zap')}
                    icon={<Layers size={20} />}
                    label="Atomic Zap"
                    desc="One-click DeFi"
                />
            </div>

            {/* Main Interactive Canvas */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8">
                    {selectedTool === 'social' && (
                        <div className="bg-[#0A0A0A] border border-white/5 rounded-[40px] p-10 shadow-2xl animate-in slide-in-from-left-8 duration-500">
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Web2 Experience</h3>
                                    <p className="text-grinta-text-secondary text-sm font-medium">Connect users via their favorite social platforms.</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-orange-500/10 text-orange-500">
                                    <Key size={24} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <SocialButton icon={<Mail size={18} />} label="Continue with Email" color="bg-white/5 hover:bg-white/10" />
                                <SocialButton icon={<Globe size={18} />} label="Continue with Google" color="bg-white/5 hover:bg-white/10" />
                                <SocialButton icon={<Twitter size={18} />} label="Continue with Twitter" color="bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 text-[#1DA1F2]" />
                                <SocialButton icon={<Github size={18} />} label="Continue with Github" color="bg-white/5 hover:bg-white/10" />
                            </div>

                            <div className="mt-10 p-6 rounded-3xl bg-orange-500/5 border border-orange-500/10">
                                <div className="flex gap-4 items-start">
                                    <div className="mt-1 p-2 rounded-lg bg-orange-500/20 text-orange-500">
                                        <ShieldCheck size={16} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white mb-1">Passkey Protection</h4>
                                        <p className="text-xs text-grinta-text-secondary leading-relaxed">Integrated with Cartridge Controller. Biometric encryption for every transaction without sacrificing self-custody.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {selectedTool === 'gasless' && (
                        <div className="bg-[#0A0A0A] border border-white/5 rounded-[40px] p-10 shadow-2xl animate-in slide-in-from-right-8 duration-500">
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Gasless Protocol</h3>
                                    <p className="text-grinta-text-secondary text-sm font-medium">Hide fee complexity from your users.</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-purple-500/10 text-purple-400">
                                    <Lock size={24} />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                                            <CreditCard size={20} />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-white">AVNU Paymaster</div>
                                            <div className="text-[10px] font-bold text-grinta-text-secondary uppercase">Sponsoring active</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
                                        <span className="text-[10px] font-black text-orange-500 uppercase">Live</span>
                                    </div>
                                </div>
                                <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 opacity-50">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/20">
                                            <CreditCard size={20} />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-white/30">Custom Token Paymaster</div>
                                            <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Pay with GRIT (Alpha)</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {selectedTool === 'staking' && (
                        <div className="bg-[#0A0A0A] border border-white/5 rounded-[40px] p-10 shadow-2xl animate-in fade-in zoom-in duration-500">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Bitcoin Staking</h3>
                                <Bitcoin size={32} className="text-[#F7931A]" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-8 rounded-[32px] bg-gradient-to-br from-[#F7931A]/10 to-transparent border border-[#F7931A]/20">
                                    <div className="text-[10px] font-black text-[#F7931A] uppercase tracking-widest mb-2">Native Yield</div>
                                    <div className="text-4xl font-black text-white mb-4">4.8% <span className="text-sm text-grinta-text-secondary">APY</span></div>
                                    <button className="w-full py-3 rounded-2xl bg-[#F7931A] text-black font-black text-xs uppercase tracking-widest hover:scale-105 transition-all">Start Staking</button>
                                </div>
                                <div className="space-y-4">
                                    <div className="p-4 bg-white/5 rounded-2xl flex items-center justify-between">
                                        <span className="text-xs font-bold text-grinta-text-secondary uppercase">Min. Deposit</span>
                                        <span className="text-xs font-black text-white">0.001 BTC</span>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-2xl flex items-center justify-between">
                                        <span className="text-xs font-bold text-grinta-text-secondary uppercase">Unlock Period</span>
                                        <span className="text-xs font-black text-white">None (Liquid)</span>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-2xl flex items-center justify-between">
                                        <span className="text-xs font-bold text-grinta-text-secondary uppercase">Safety Score</span>
                                        <span className="text-xs font-black text-orange-500">9.8/10</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {selectedTool === 'zap' && (
                        <div className="bg-[#0A0A0A] border border-white/5 rounded-[40px] p-10 shadow-2xl animate-in fade-in duration-500">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                                    <RefreshCw className="text-orange-500" /> Atomic Engine
                                </h3>
                                <span className="text-[10px] font-bold text-orange-500/80 bg-orange-500/10 px-3 py-1 rounded-full uppercase">Starknet Sepolia</span>
                            </div>
                            <div className="space-y-3">
                                {[
                                    { from: 'USDC', to: 'WBTC', via: 'AVNU / Ekubo', rate: '1.000x' },
                                    { from: 'STRK', to: 'WBTC', via: 'JediSwap', rate: '0.998x' },
                                    { from: 'ETH', to: 'WBTC', via: '10KSwap', rate: '0.999x' }
                                ].map((z, idx) => (
                                    <div key={idx} className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between hover:bg-orange-500/5 hover:border-orange-500/20 transition-all group">
                                        <div className="flex items-center gap-4">
                                            <div className="font-black text-white text-xs">{z.from}</div>
                                            <ArrowRight size={14} className="text-grinta-text-secondary" />
                                            <div className="text-orange-500 font-black text-xs">WBTC</div>
                                        </div>
                                        <div className="flex items-center gap-8">
                                            <div className="text-right">
                                                <div className="text-[9px] font-bold text-grinta-text-secondary uppercase mb-0.5">Router</div>
                                                <div className="text-[10px] font-bold text-white uppercase">{z.via}</div>
                                            </div>
                                            <button className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-black hover:scale-110 transition-all">
                                                <Zap size={16} fill="black" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Sidebar - System Stats */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-[#0A0A0A] border border-white/5 rounded-[40px] p-8 shadow-xl">
                        <h4 className="text-[10px] font-black text-grinta-text-secondary uppercase tracking-[0.2em] mb-6">Security & Network</h4>
                        <div className="space-y-6">
                            <StatRow label="Starknet Latency" value="12ms" />
                            <StatRow label="Node Provider" value="Blast / RPC" />
                            <StatRow label="Paymaster Credits" value="1,240.50" color="text-orange-500" />
                            <div className="h-px bg-white/5 w-full"></div>
                            <div className="flex items-center gap-3 p-4 bg-orange-500/5 rounded-2xl border border-orange-500/10">
                                <Info size={16} className="text-orange-500" />
                                <p className="text-[10px] text-grinta-text-secondary font-medium leading-relaxed">
                                    StarkZap SDK v2.4.0 detected. All modules operating within normal parameters.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-500/20 to-transparent border border-orange-500/20 rounded-[40px] p-8 group">
                        <Activity size={24} className="text-orange-500 mb-4 animate-pulse" />
                        <h4 className="text-sm font-black text-white uppercase tracking-widest mb-2">Live Activity</h4>
                        <p className="text-[10px] text-grinta-text-secondary leading-relaxed mb-6">Monitoring cross-chain zaps on Starknet Mainnet and Sepolia.</p>
                        <div className="space-y-2">
                            {[1, 2].map(i => (
                                <div key={i} className="flex items-center gap-2 text-[8px] font-bold text-grinta-text-secondary uppercase font-mono">
                                    <div className="w-1 h-1 rounded-full bg-orange-500"></div>
                                    <span>ZAP_0x2b...f9 detected via AVNU</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FeatureTab({ active, onClick, icon, label, desc }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, desc: string }) {
    return (
        <button
            onClick={onClick}
            className={`p-6 rounded-[32px] border transition-all text-left flex flex-col gap-3 group relative overflow-hidden ${active
                ? 'bg-orange-500 border-orange-500 shadow-[0_20px_40px_rgba(249,115,22,0.2)]'
                : 'bg-[#0A0A0A] border-white/5 hover:border-orange-500/30'}`}
        >
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${active ? 'bg-black text-orange-500' : 'bg-white/5 text-grinta-text-secondary group-hover:text-orange-500'}`}>
                {icon}
            </div>
            <div>
                <div className={`text-xs font-black uppercase tracking-tighter ${active ? 'text-black' : 'text-white'}`}>{label}</div>
                <div className={`text-[9px] font-bold uppercase tracking-wider opacity-60 ${active ? 'text-black' : 'text-grinta-text-secondary'}`}>{desc}</div>
            </div>
        </button>
    );
}

function SocialButton({ icon, label, color }: { icon: React.ReactNode, label: string, color: string }) {
    return (
        <button className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-xs transition-all ${color} active:scale-95`}>
            {icon}
            <span>{label}</span>
        </button>
    );
}

function StatRow({ label, value, color = "text-white" }: { label: string, value: string, color?: string }) {
    return (
        <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-grinta-text-secondary uppercase">{label}</span>
            <span className={`text-[11px] font-black font-mono ${color}`}>{value}</span>
        </div>
    );
}
