import React, { useState, ReactNode, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVaults } from '../../context/VaultContext';
import { Activity, Zap, Database, ChevronLeft, ChevronRight, LayoutDashboard, TrendingUp, Loader2, ExternalLink, Eye, ShieldCheck, Cpu, Share2, Terminal, BarChart3, Target, Bitcoin, Percent, DollarSign, ShieldAlert } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ScatterChart, Scatter, ZAxis, Cell, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { useReadContract } from '@starknet-react/core';
import { config } from '../../config/contracts';
import { useTranslation } from 'react-i18next';
import { useRates } from '../../hooks/useGrinta';
import { useBitcoinPrice } from '../../hooks/useBitcoinPrice';

export default function Overview() {
    const { market, vaults, setStep, setActiveVaultId } = useVaults();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { redemptionPrice, redemptionRate, collateralPrice, liquidationRatio, loading: ratesLoading } = useRates();
    const { price: btcPriceData } = useBitcoinPrice();

    const btcFormatted = btcPriceData ? `$${btcPriceData.usd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '...';

    const { data: safeCountData, isLoading: isLoadingCount } = useReadContract({
        address: config.safeEngineAddress as `0x${string}`,
        abi: config.abis.safeEngine,
        functionName: 'get_safe_count',
        args: [],
        watch: true,
    });

    const totalProtocolVaults = safeCountData ? Number(safeCountData) : 0;

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const sortedVaults = [...vaults].sort((a, b) => {
        const dateA = a.createdAt instanceof Date ? a.createdAt.getTime() : new Date(a.createdAt).getTime();
        const dateB = b.createdAt instanceof Date ? b.createdAt.getTime() : new Date(b.createdAt).getTime();
        return dateB - dateA;
    });

    const totalPages = Math.ceil(sortedVaults.length / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentVaults = sortedVaults.slice(startIndex, startIndex + itemsPerPage);

    const totalUserDeposits = vaults.reduce((acc, v) => acc + v.amount, 0);
    const averageApy = 12.5; // From spec
    const hasVaults = vaults.length > 0;

    // Memoized Logic for Solvency Chart
    const currentDebt = useMemo(() => vaults.reduce((acc, v) => acc + (v.debt || 0), 0), [vaults]);
    const btcPrice = market.btcPrice || 70266;
    const liqRatio = (market.liquidationRatio || 150) / 100;
    const debtCapacity = useMemo(() => (market.tvl * btcPrice) / liqRatio, [market.tvl, btcPrice, liqRatio]);

    const solvencyHistory = useMemo(() => Array.from({ length: 20 }, (_, i) => {
        const factor = 1 + (Math.sin(i * 0.5) * 0.05);
        const cap = debtCapacity * factor;
        const debt = currentDebt * (1 + (Math.cos(i * 0.5) * 0.02));
        return { time: i, capacity: cap, debt: debt };
    }), [debtCapacity, currentDebt]);

    // Memoized Quantum Agent Clusters
    const agentClusters = useMemo(() => Array.from({ length: 40 }, (_, i) => ({
        x: 40 + Math.random() * 50,
        y: 160 + Math.random() * 200,
        z: Math.random() * 100,
        id: i
    })), []);

    // Radar Data for Agent Performance vs Manual
    const radarData = [
        { subject: 'Yield Velocity', A: 95, B: 60, fullMark: 100 },
        { subject: 'Risk Buffer', A: 85, B: 75, fullMark: 100 },
        { subject: 'Flash Cap', A: 99, B: 20, fullMark: 100 },
        { subject: 'Resilience', A: 92, B: 45, fullMark: 100 },
        { subject: 'Eff. Ratio', A: 88, B: 70, fullMark: 100 },
    ];

    // Neural Feed Messages
    const [neuralLog, setNeuralLog] = useState([
        { id: 1, text: "AGENT-0x42: Arbitrage opportunity detected in Starknet pool", type: 'info' },
        { id: 2, text: "SYSTEM: Rebalancing safe #8821 for 180% CR", type: 'success' },
        { id: 3, text: "MARKET: Flash Mint liquidity injection: 50,000 GRIT", type: 'zap' },
    ]);

    React.useEffect(() => {
        const interval = setInterval(() => {
            const msgs = [
                "Neural Pathfinding: Optimized yield for manual vault #22",
                "Agentic Proposal: Adjusting PID Integral factor to 0.045",
                "Flash Arbitrage: +0.0012 BTC captured via L2 Loop",
                "Security: Safety Buffer auto-expanding on volatility spike",
                "Network: 4Claw Oracle heart-beat verified"
            ];
            const newMsg = { id: Date.now(), text: msgs[Math.floor(Math.random() * msgs.length)], type: 'info' };
            setNeuralLog(prev => [newMsg, ...prev.slice(0, 4)]);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full space-y-6 animate-in fade-in duration-700">
            {/* Market Ticker Style Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-1">
                <div className="flex items-center gap-3 p-4 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-white/[0.05] transition-all group">
                    <div className="w-10 h-10 rounded-full bg-[#F7931A]/10 flex items-center justify-center text-[#F7931A]">
                        <Bitcoin size={18} />
                    </div>
                    <div>
                        <div className="text-[10px] font-bold text-grinta-text-secondary uppercase tracking-wider mb-0.5">BTC Price</div>
                        <div className="text-lg font-black text-white font-mono">{btcFormatted}</div>
                    </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-white/[0.05] transition-all">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                        <Percent size={18} />
                    </div>
                    <div>
                        <div className="text-[10px] font-bold text-grinta-text-secondary uppercase tracking-wider mb-0.5">Redemption Rate</div>
                        <div className="text-lg font-black text-white font-mono">{ratesLoading ? '...' : redemptionRate}</div>
                    </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-white/[0.05] transition-all">
                    <div className="w-10 h-10 rounded-full bg-grinta-accent/10 flex items-center justify-center text-grinta-accent">
                        <DollarSign size={18} />
                    </div>
                    <div>
                        <div className="text-[10px] font-bold text-grinta-text-secondary uppercase tracking-wider mb-0.5">Redemption Price</div>
                        <div className="text-lg font-black text-white font-mono">{ratesLoading ? '...' : parseFloat(redemptionPrice.split(' ')[0] || '0').toFixed(4)}</div>
                    </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-white/[0.05] transition-all">
                    <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                        <ShieldAlert size={18} />
                    </div>
                    <div>
                        <div className="text-[10px] font-bold text-grinta-text-secondary uppercase tracking-wider mb-0.5">Liquidation Ratio</div>
                        <div className="text-lg font-black text-white font-mono">{ratesLoading ? '...' : liquidationRatio}</div>
                    </div>
                </div>
            </div>

            {/* Header Section */}
            <div className="px-2 pt-6 pb-4">
                <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-3 leading-none">{t('overview.neural_dashboard_title')}</h1>
                <p className="text-grinta-text-secondary text-base max-w-2xl font-medium leading-relaxed opacity-80">
                    {t('overview.neural_dashboard_desc')}
                </p>
            </div>

            <div className="h-4"></div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    label={t('overview.tvl')}
                    value={`${market.tvl.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} BTC`}
                    icon={<Activity size={20} className="text-grinta-accent" />}
                    trend={hasVaults ? t('overview.tvl_trend_active') : t('overview.tvl_trend_inactive')}
                />
                <MetricCard
                    label={t('overview.apy')}
                    value={`${hasVaults ? averageApy : 0}%`}
                    icon={<TrendingUp size={20} className="text-blue-400" />}
                    trend={hasVaults ? t('overview.apy_trend_active') : t('overview.apy_trend_inactive')}
                />
                <MetricCard
                    label={t('overview.flash_mints')}
                    value={market.flashMints24h.toLocaleString()}
                    icon={<Zap size={20} className="text-yellow-400" />}
                    trend={hasVaults ? t('overview.flash_trend_active') : t('overview.flash_trend_inactive')}
                />
                <MetricCard
                    label={t('overview.total_vaults')}
                    value={isLoadingCount ? '...' : totalProtocolVaults.toString()}
                    icon={isLoadingCount ? <Loader2 size={20} className="text-purple-400 animate-spin" /> : <Database size={20} className="text-purple-400" />}
                    trend={totalProtocolVaults > 0 ? t('overview.agents_trend_active') : t('overview.agents_trend_inactive')}
                />
            </div>

            {/* Middle Row: Participation & Peg Health */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Participation */}
                <div className="bg-grinta-card border border-grinta-card-border rounded-[32px] p-8 relative overflow-hidden shadow-2xl flex flex-col justify-center">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Zap size={80} className="text-grinta-accent" />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-grinta-text-secondary text-sm font-bold uppercase tracking-widest mb-2">{t('overview.participation')}</h3>
                        <div className="flex items-baseline gap-3">
                            <span className="text-5xl font-extrabold text-white">{totalUserDeposits.toFixed(2)}</span>
                            <span className="text-2xl font-bold text-grinta-accent">BTC</span>
                        </div>
                        <p className="text-grinta-text-secondary text-sm mt-4">{t('overview.assigned_in', { count: vaults.length })}</p>
                    </div>
                </div>

                {/* Peg Health - Real PID Chart */}
                <div className="bg-grinta-card border border-grinta-card-border rounded-[32px] p-8 relative overflow-hidden shadow-2xl">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-grinta-text-secondary text-sm font-bold uppercase tracking-widest mb-1">{t('overview.peg_health')}</h3>
                            <p className="text-[10px] text-grinta-text-secondary opacity-60">{t('overview.pid_active')}</p>
                        </div>
                        <div className="text-right">
                            <div className="text-[10px] text-grinta-text-secondary uppercase mb-1">{t('overview.redemption_price')}</div>
                            <div className="text-xl font-bold text-grinta-accent font-mono">
                                {market.redemptionPrice.toFixed(4)} <span className="text-xs">USD</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-32 w-full relative group">
                        <div className="absolute inset-x-0 h-[1px] bg-white/10 top-1/2"></div>

                        <svg className="w-full h-full overflow-visible" viewBox="0 0 400 100" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#00FF41" stopOpacity="0.2" />
                                    <stop offset="100%" stopColor="#00FF41" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <path
                                d={`M 0 100 ${market.redemptionPriceHistory.map((val, i) => {
                                    const x = (i / (market.redemptionPriceHistory.length - 1)) * 400;
                                    const y = 100 - ((val - 0.995) / 0.01) * 100;
                                    return `L ${x} ${y}`;
                                }).join(' ')} L 400 100 Z`}
                                fill="url(#lineGradient)"
                            />
                            <path
                                d={`M ${market.redemptionPriceHistory.map((val, i) => {
                                    const x = (i / (market.redemptionPriceHistory.length - 1)) * 400;
                                    const y = 100 - ((val - 0.995) / 0.01) * 100;
                                    return i === 0 ? `0 ${y}` : `L ${x} ${y}`;
                                }).join(' ')}`}
                                fill="none"
                                stroke="#00FF41"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>

                        <div className="absolute left-0 inset-y-0 flex flex-col justify-between text-[8px] text-grinta-text-secondary font-mono py-1">
                            <span>1.005</span>
                            <span>0.995</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Systemic Intelligence Layer: Solvency & Quantum Field */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Solvency Chart */}
                <div className="bg-grinta-card border border-grinta-card-border rounded-[32px] p-8 relative overflow-hidden shadow-2xl">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-grinta-accent/10 text-grinta-accent">
                                <ShieldCheck size={20} />
                            </div>
                            <div>
                                <h3 className="text-grinta-text-secondary text-[11px] font-black uppercase tracking-widest mb-1">Systemic Solvency</h3>
                                <p className="text-[9px] text-grinta-text-secondary opacity-40 uppercase tracking-wider font-bold">Debt Capacity Limit</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-[18px] font-black text-white font-mono">{currentDebt.toLocaleString()} <span className="text-[10px] text-grinta-accent">GRIT</span></div>
                        </div>
                    </div>

                    <div className="h-[180px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={solvencyHistory}>
                                <defs>
                                    <linearGradient id="capacityGrad" x1="0" y1="0" x2="0" y2="100%">
                                        <stop offset="5%" stopColor="#888" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#888" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="debtGrad" x1="0" y1="0" x2="0" y2="100%">
                                        <stop offset="5%" stopColor="#00FF41" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#00FF41" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="time" hide />
                                <YAxis hide domain={['dataMin - 1000', 'dataMax + 5000']} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                    itemStyle={{ fontSize: '10px', fontWeight: 'bold' }}
                                    labelStyle={{ display: 'none' }}
                                />
                                <Area type="monotone" dataKey="capacity" stroke="#333" strokeWidth={2} strokeDasharray="5 5" fill="url(#capacityGrad)" name="Cap" />
                                <Area type="monotone" dataKey="debt" stroke="#00FF41" strokeWidth={3} fill="url(#debtGrad)" name="Debt" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Quantum Field Chart */}
                <div className="bg-grinta-card border border-grinta-card-border rounded-[32px] p-8 relative overflow-hidden shadow-2xl">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400">
                                <Cpu size={20} />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-grinta-text-secondary text-[11px] font-black uppercase tracking-widest">Quantum Stability Field</h3>
                                    <span className="px-1.5 py-0.5 rounded bg-grinta-accent/10 border border-grinta-accent/20 text-[7px] font-black text-grinta-accent uppercase tracking-tighter">{t('overview.coming_soon')}</span>
                                </div>
                                <p className="text-[9px] text-grinta-text-secondary opacity-40 uppercase tracking-wider font-bold">{t('overview.quantum_clusters')}</p>
                            </div>
                        </div>
                        <div className="p-2 rounded-xl bg-white/5 text-white/20">
                            <Share2 size={16} />
                        </div>
                    </div>

                    <div className="h-[180px] w-full relative">
                        {/* Grid Effect Background */}
                        <div className="absolute inset-x-0 inset-y-0 opacity-[0.03] pointer-events-none"
                            style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                                <XAxis type="number" dataKey="x" hide domain={[0, 100]} />
                                <YAxis type="number" dataKey="y" hide domain={[0, 500]} />
                                <ZAxis type="number" dataKey="z" range={[20, 200]} />
                                <Tooltip
                                    cursor={{ strokeDasharray: '3 3' }}
                                    contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                    itemStyle={{ fontSize: '9px', fontWeight: 'bold' }}
                                />
                                <Scatter name="Agent State" data={agentClusters}>
                                    {agentClusters.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.y > 250 ? '#00FF41' : entry.y > 180 ? '#F7931A' : '#EF4444'}
                                            fillOpacity={0.6}
                                            className="animate-pulse"
                                            style={{ filter: `blur(${entry.z < 30 ? '1px' : '0px'})` }}
                                        />
                                    ))}
                                </Scatter>
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Neural Intelligence Row: Radar & Live Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Radar Chart (Data Science View) */}
                <div className="lg:col-span-12 xl:col-span-8 bg-grinta-card border border-grinta-card-border rounded-[32px] p-8 relative overflow-hidden shadow-2xl">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400">
                                <Target size={20} />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-grinta-text-secondary text-[11px] font-black uppercase tracking-widest">{t('overview.intelligence_efficiency_title', 'Intelligence Efficiency')}</h3>
                                    <span className="px-1.5 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-[7px] font-black text-purple-400 uppercase tracking-tighter">{t('overview.coming_soon')}</span>
                                </div>
                                <p className="text-[9px] text-grinta-text-secondary opacity-40 uppercase tracking-wider font-bold">{t('overview.performance_benchmark')}</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-grinta-accent"></span>
                                <span className="text-[8px] font-bold text-grinta-text-secondary uppercase">Agentic</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                                <span className="text-[8px] font-bold text-grinta-text-secondary uppercase">Manual</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                <PolarGrid stroke="rgba(255,255,255,0.05)" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 'bold' }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar
                                    name="Agentic"
                                    dataKey="A"
                                    stroke="#00FF41"
                                    fill="#00FF41"
                                    fillOpacity={0.2}
                                />
                                <Radar
                                    name="Manual"
                                    dataKey="B"
                                    stroke="#A855F7"
                                    fill="#A855F7"
                                    fillOpacity={0.1}
                                />
                                <Tooltip contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px' }} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Neural Pulse Feed (Live Feed) */}
                <div className="lg:col-span-12 xl:col-span-4 bg-grinta-card border border-grinta-card-border rounded-[32px] p-8 relative overflow-hidden shadow-2xl flex flex-col">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 rounded-2xl bg-grinta-accent/10 text-grinta-accent border border-grinta-accent/20">
                            <Terminal size={20} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-grinta-text-secondary text-[11px] font-black uppercase tracking-widest">Neural Pulse</h3>
                                <span className="px-1.5 py-0.5 rounded bg-grinta-accent/10 border border-grinta-accent/20 text-[7px] font-black text-grinta-accent uppercase tracking-tighter">{t('overview.coming_soon')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-grinta-accent animate-ping"></span>
                                <span className="text-[9px] text-grinta-accent font-bold uppercase tracking-widest">Live Engine</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 space-y-3 overflow-hidden">
                        {neuralLog.map((log) => (
                            <div key={log.id} className="p-3 rounded-xl bg-white/[0.03] border border-white/5 animate-in slide-in-from-right-4 duration-500">
                                <div className="flex items-start gap-3">
                                    <div className={`mt-1 w-1 h-3 rounded-full ${log.type === 'zap' ? 'bg-yellow-400' : log.type === 'success' ? 'bg-blue-400' : 'bg-grinta-accent'}`}></div>
                                    <p className="text-[10px] font-mono text-grinta-text-secondary leading-tight line-clamp-2">
                                        <span className="text-white/40">[{new Date(log.id).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span> {log.text}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/5">
                        <div className="flex justify-between items-center text-[8px] font-bold text-grinta-text-secondary uppercase tracking-widest">
                            <span>{t('overview.engine_latency')}: 12ms</span>
                            <span className="text-grinta-accent">{t('overview.protocol_online')}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Neural Ticker Tape */}
            <div className="py-4">
                <div className="tape-wrapper max-w-5xl mx-auto rounded-full shadow-2xl relative overflow-hidden text-[#000]">
                    <div className="tape-text py-2">
                        GRINTA PROTOCOL ✦ WBTC x BTCFi ✦ PID CONTROLLER ✦ GRINTA PROTOCOL ✦ WBTC x BTCFi ✦ PID CONTROLLER ✦ GRINTA PROTOCOL ✦ WBTC x BTCFi ✦ PID CONTROLLER ✦ GRINTA PROTOCOL ✦ WBTC x BTCFi ✦ PID CONTROLLER ✦
                    </div>
                </div>
            </div>

            {/* Total Protocol Vaults Module */}
            <div className="bg-grinta-card border border-grinta-card-border rounded-[32px] p-8 relative overflow-hidden shadow-2xl">
                <div className="relative z-10 w-full">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-grinta-text-secondary text-sm font-bold uppercase tracking-widest mb-2">{t('overview.protocol_vaults_list')}</h3>
                            <p className="text-grinta-text-secondary text-xs opacity-60">{t('overview.prepared')}</p>
                        </div>
                        <button
                            onClick={() => {
                                setStep('main_dashboard');
                                navigate('/app/vaults');
                            }}
                            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white hover:bg-white/10 transition-all flex items-center gap-2 uppercase tracking-widest"
                        >
                            <LayoutDashboard size={14} /> {t('new_vault.vault_view.my_vaults')}
                        </button>
                    </div>

                    <div className="space-y-4 mb-8">
                        <div className="grid grid-cols-5 px-6 text-[10px] font-bold text-grinta-text-secondary uppercase tracking-[0.2em] mb-2">
                            <span>{t('overview.id')}</span>
                            <span>{t('dashboard.collateral')}</span>
                            <span>{t('dashboard.yield')}</span>
                            <span>{t('overview.grit')}</span>
                            <span className="text-right">{t('overview.action')}</span>
                        </div>
                        <div className="space-y-2">
                            {currentVaults.length > 0 ? (
                                currentVaults.map((v) => (
                                    <div key={v.id} className="grid grid-cols-5 px-6 py-4 bg-white/5 border border-white/5 rounded-2xl items-center hover:bg-white/10 hover:border-white/10 transition-all group">
                                        <span className="text-xs font-mono text-grinta-accent font-bold">#{v.id}</span>
                                        <span className="text-xs font-bold text-white">{v.amount.toFixed(4)} BTC</span>
                                        <span className="text-xs font-bold text-grinta-accent">{v.yieldEarned.toFixed(6)} BTC</span>
                                        <span className="text-xs font-bold text-blue-400">{(v.debt || 0).toFixed(1)} GRIT</span>
                                        <div className="flex justify-end">
                                            <button
                                                onClick={() => {
                                                    setActiveVaultId(v.id);
                                                    setStep('vault_view');
                                                }}
                                                className="p-2 rounded-lg bg-grinta-accent/10 border border-grinta-accent/20 text-grinta-accent hover:bg-grinta-accent hover:text-black transition-all"
                                                title="View Vault"
                                            >
                                                <Eye size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-12 flex flex-col items-center justify-center bg-white/[0.02] border border-dashed border-white/10 rounded-2xl">
                                    <div className="w-10 h-10 rounded-full bg-blue-400/10 flex items-center justify-center mb-4">
                                        {isLoadingCount ? (
                                            <Loader2 size={20} className="text-blue-400 animate-spin" />
                                        ) : (
                                            <Activity size={20} className="text-blue-400 animate-pulse" />
                                        )}
                                    </div>
                                    <span className="text-xs font-bold text-white/20 uppercase tracking-widest">
                                        {t('overview.scanning_vaults')}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between border-t border-white/5 pt-6">
                        <div className="text-xs text-grinta-text-secondary">
                            Page <span className="text-white font-bold">{currentPage}</span> {t('overview.of')} <span className="text-white font-bold">{totalPages}</span>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-xl bg-white/5 border border-white/10 text-white disabled:opacity-20 hover:bg-white/10 transition-all font-bold"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-xl bg-white/5 border border-white/10 text-white disabled:opacity-20 hover:bg-white/10 transition-all font-bold"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const MetricCard = React.memo(({ label, value, icon, trend }: { label: string, value: string, icon: ReactNode, trend: string }) => {
    return (
        <div className="bg-grinta-card border border-grinta-card-border rounded-2xl p-6 hover:border-white/20 transition-all group shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors">
                    {icon}
                </div>
                <span className="text-[10px] font-bold text-grinta-text-secondary uppercase tracking-tighter bg-white/5 px-2 py-1 rounded">
                    {trend}
                </span>
            </div>
            <div className="text-sm font-medium text-grinta-text-secondary mb-1">{label}</div>
            <div className="text-xl font-bold text-white">{value}</div>
        </div>
    );
});

MetricCard.displayName = 'MetricCard';
