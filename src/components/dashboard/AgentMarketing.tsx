import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Share2, Zap, Terminal, Sparkles, MessageSquare, Megaphone, CheckCircle2, CloudLightning, Activity, Clock, Play, Pause, Globe } from 'lucide-react';
import { generatePost } from '../../../agents/campaign/templates';
import { useRates, useMarketPrice } from '../../hooks/useGrinta';
import { useVaults } from '../../context/VaultContext';

const AUTO_POST_INTERVAL = 15 * 60; // 15 minutes in seconds

export default function AgentMarketing() {
    const { market } = useVaults();
    const { redemptionPrice, redemptionRate, loading: ratesLoading } = useRates();
    const { price: marketPrice, priceRaw: marketPriceRaw } = useMarketPrice();

    const [currentDay, setCurrentDay] = useState(1);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isExecuting, setIsExecuting] = useState(false);
    const [isAutoPilot, setIsAutoPilot] = useState(true);
    const [timeLeft, setTimeLeft] = useState(AUTO_POST_INTERVAL);
    const [publishedPosts, setPublishedPosts] = useState<{ id: string, text: string, time: string, phase: string }[]>([]);

    const post = useMemo(() => generatePost(currentIndex, currentDay), [currentIndex, currentDay]);

    const handlePublish = useCallback(async () => {
        if (isExecuting) return;
        setIsExecuting(true);
        const apiKey = import.meta.env.VITE_MOLTX_API_KEY;

        // Construct enriched post with live metrics and URL
        const rPriceValue = parseFloat(redemptionPrice.split(' ')[0] || '1.0000');
        const enrichedPost = `${post}\n\n📊 Protocol Status:\n• Market Price: $${parseFloat(marketPrice).toFixed(4)}\n• Redemption Price: $${rPriceValue.toFixed(4)}\n• Redemption Rate: ${redemptionRate}\n• BTC Index: $${(market.btcPrice || 0).toLocaleString()}\n\n🔗 Open Safe: https://grinta-prototype-ui.vercel.app/`;

        try {
            const response = await fetch('https://moltx.io/v1/posts', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: enrichedPost })
            });

            const data = await response.json();

            if (response.ok) {
                const newPost = {
                    id: data.id || `0x${Math.random().toString(16).slice(2, 6)}`,
                    text: enrichedPost,
                    time: new Date().toLocaleTimeString(),
                    phase: currentDay <= 10 ? 'RESEARCH' : currentDay <= 20 ? 'FEEDBACK' : 'ACTIVATION'
                };

                setPublishedPosts(prev => [newPost, ...prev].slice(0, 5));
                setCurrentIndex(prev => prev + 1);
                if (currentIndex > 0 && currentIndex % 3 === 0) {
                    setCurrentDay(d => Math.min(30, d + 1));
                }

                // Reset countdown
                setTimeLeft(AUTO_POST_INTERVAL);
            }
        } catch (error) {
            console.error("MoltX Execution Failed:", error);
        } finally {
            setIsExecuting(false);
        }
    }, [post, currentIndex, currentDay, isExecuting, market.btcPrice, redemptionPrice, redemptionRate, marketPrice]);

    // Auto-Pilot Timer Logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isAutoPilot && !isExecuting) {
            interval = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        handlePublish();
                        return AUTO_POST_INTERVAL;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isAutoPilot, isExecuting, handlePublish]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="bg-[#0A0A0A] border border-grinta-accent/30 rounded-[40px] p-10 shadow-[0_0_50px_rgba(0,255,65,0.1)] relative overflow-hidden group transition-all hover:border-grinta-accent/50">
            {/* Background Aesthetic */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-grinta-accent/5 blur-[100px] rounded-full group-hover:bg-grinta-accent/10 transition-all"></div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Control Panel */}
                <div className="lg:col-span-12 xl:col-span-7 space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-grinta-accent border border-grinta-accent/50 flex items-center justify-center text-black shadow-[0_0_30px_rgba(0,255,65,0.3)]">
                                <Megaphone size={28} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-none mb-2">Agentic HUB Automation</h3>
                                <div className="flex items-center gap-3">
                                    <span className={`w-2 h-2 rounded-full ${isAutoPilot ? 'bg-grinta-accent animate-ping' : 'bg-red-500'}`}></span>
                                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isAutoPilot ? 'text-grinta-accent' : 'text-red-500'}`}>
                                        {isAutoPilot ? 'Auto-Pilot Active' : 'Manual Mode'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <div className="text-[9px] font-black text-grinta-text-secondary uppercase mb-1">Next Propagate</div>
                                <div className="text-lg font-black text-white font-mono flex items-center gap-2">
                                    <Clock size={16} className="text-grinta-accent" />
                                    {formatTime(timeLeft)}
                                </div>
                            </div>
                            <button
                                onClick={() => setIsAutoPilot(!isAutoPilot)}
                                className={`p-3 rounded-xl border transition-all ${isAutoPilot ? 'bg-grinta-accent/10 border-grinta-accent/20 text-grinta-accent' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}
                            >
                                {isAutoPilot ? <Pause size={20} /> : <Play size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Active Message Queue */}
                    <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[32px] relative group/queue overflow-hidden">
                        <div className="absolute top-3 right-3 flex gap-2">
                            <span className="px-2 py-1 rounded-lg bg-grinta-accent/10 border border-grinta-accent/20 text-[8px] font-black text-grinta-accent uppercase">15m cycle</span>
                        </div>
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="text-[10px] font-black text-grinta-text-secondary uppercase tracking-[0.3em]">Enriched Queue Message</h4>
                            <span className="px-3 py-1 rounded-full bg-white/5 text-[9px] font-bold text-white/40 uppercase">Day {currentDay}/30</span>
                        </div>

                        <div className="min-h-[120px] border-l-2 border-grinta-accent/30 pl-6 space-y-4">
                            <p className="text-base font-medium text-white leading-relaxed italic opacity-90">
                                "{post}"
                            </p>
                            <div className="pt-4 grid grid-cols-2 gap-4 border-t border-white/5">
                                <div className="text-[10px] text-grinta-accent font-bold uppercase">
                                    Market: ${parseFloat(marketPrice).toFixed(4)}
                                </div>
                                <div className="text-[10px] text-grinta-accent font-bold uppercase text-right">
                                    Redemption: ${ratesLoading ? '0.0000' : parseFloat(redemptionPrice.split(' ')[0] || '1.0000').toFixed(4)}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex items-center gap-4">
                            <button
                                onClick={handlePublish}
                                disabled={isExecuting}
                                className={`flex-1 group/exec flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all ${isExecuting ? 'bg-white/10 text-white/30' : 'bg-grinta-accent text-black hover:scale-[1.02] active:scale-95 shadow-[0_10px_30px_rgba(0,255,65,0.2)]'}`}
                            >
                                {isExecuting ? <Activity className="animate-spin" size={18} /> : <CloudLightning size={18} fill="black" />}
                                <span>{isExecuting ? 'Propagating...' : 'Force Publish Now'}</span>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <MarketingStat icon={<MessageSquare size={14} />} label="Reach" value="1.2k" color="text-blue-400" />
                        <MarketingStat icon={<Zap size={14} />} label="Conv." value="4.2%" color="text-grinta-accent" />
                        <MarketingStat icon={<Sparkles size={14} />} label="Mood" value="Bullish" color="text-yellow-400" />
                    </div>
                </div>

                {/* Live History Feed */}
                <div className="lg:col-span-12 xl:col-span-5 flex flex-col">
                    <h4 className="text-[10px] font-black text-grinta-text-secondary uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                        <CheckCircle2 size={12} className="text-grinta-accent" /> Published Feed
                    </h4>
                    <div className="flex-1 space-y-4 max-h-[450px] overflow-y-auto pr-2 grinta-scrollbar">
                        {publishedPosts.length === 0 ? (
                            <div className="flex-1 border border-dashed border-white/5 rounded-[32px] flex flex-col items-center justify-center p-12 opacity-20 h-full">
                                <CloudLightning size={40} className="mb-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-center">No posts published yet<br />Auto-pilot starting soon</span>
                            </div>
                        ) : (
                            publishedPosts.map((p) => (
                                <div key={p.id} className="p-5 rounded-3xl bg-white/[0.03] border border-white/5 animate-in slide-in-from-right-4 transition-all hover:bg-white/[0.05]">
                                    <div className="flex items-center justify-between mb-3 text-[9px] font-bold uppercase tracking-widest border-b border-white/5 pb-2">
                                        <span className="text-grinta-accent">{p.id}</span>
                                        <span className="text-grinta-text-secondary opacity-40">{p.time}</span>
                                    </div>
                                    <p className="text-[10px] text-grinta-text-secondary leading-normal font-mono mb-3 whitespace-pre-line">
                                        {p.text}
                                    </p>
                                    <div className="mt-3 flex gap-2">
                                        <span className="px-2 py-0.5 rounded-md bg-grinta-accent/10 text-[8px] font-black text-grinta-accent border border-grinta-accent/20 uppercase">{p.phase}</span>
                                        <span className="text-[8px] font-bold text-white/20 uppercase ml-auto flex items-center gap-1"><Share2 size={8} /> On-Chain</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function MarketingStat({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string, color: string }) {
    return (
        <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl hover:bg-white/[0.03] transition-all group/stat">
            <div className={`mb-2 ${color} opacity-60 group-hover/stat:scale-110 transition-transform`}>{icon}</div>
            <div className="text-[9px] font-black text-grinta-text-secondary uppercase tracking-widest mb-1">{label}</div>
            <div className="text-sm font-black text-white font-mono">{value}</div>
        </div>
    );
}
