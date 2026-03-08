import React, { useState, ReactNode } from 'react';
import { useVaults } from '../../context/VaultContext';
import { Activity, Zap, Database, ChevronLeft, ChevronRight, LayoutDashboard, TrendingUp, Loader2 } from 'lucide-react';
import { useReadContract } from '@starknet-react/core';
import { config } from '../../config/contracts';
import { useTranslation } from 'react-i18next';

export default function Overview() {
    const { market, vaults } = useVaults();
    const { t } = useTranslation();

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

    interface ProtocolVault {
        id: string;
        amount: string;
        owner: string;
    }

    // This will be populated by the Smart Contract return in the next stage
    const protocolVaults: ProtocolVault[] = [];

    const totalPages = Math.ceil(protocolVaults.length / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentVaults = protocolVaults.slice(startIndex, startIndex + itemsPerPage);

    const totalUserDeposits = vaults.reduce((acc, v) => acc + v.amount, 0);
    const averageApy = 12.5; // From spec

    const hasVaults = vaults.length > 0;

    return (
        <div className="w-full space-y-6 animate-in fade-in duration-700">
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

            {/* Total Protocol Vaults Module */}
            <div className="bg-grinta-card border border-grinta-card-border rounded-[32px] p-8 relative overflow-hidden shadow-2xl">
                <div className="relative z-10 w-full">
                    <h3 className="text-grinta-text-secondary text-sm font-bold uppercase tracking-widest mb-2">{t('overview.protocol_vaults_list')}</h3>
                    <p className="text-grinta-text-secondary text-xs opacity-80 mb-8">{t('overview.prepared')}</p>

                    <div className="space-y-4 mb-8">
                        <div className="grid grid-cols-3 px-6 text-[10px] font-bold text-grinta-text-secondary uppercase tracking-[0.2em] mb-2">
                            <span>ID</span>
                            <span>Collateral</span>
                            <span className="text-right">Owner</span>
                        </div>
                        <div className="space-y-2">
                            {currentVaults.length > 0 ? (
                                currentVaults.map((v) => (
                                    <div key={v.id} className="grid grid-cols-3 px-6 py-4 bg-white/5 border border-white/5 rounded-2xl items-center hover:bg-white/10 hover:border-white/10 transition-all group">
                                        <span className="text-xs font-mono text-grinta-accent font-bold">#{v.id}</span>
                                        <span className="text-xs font-bold text-white">{v.amount} BTC</span>
                                        <span className="text-[10px] font-mono text-white/30 text-right group-hover:text-white/60 transition-colors">{v.owner}</span>
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
                                        {isLoadingCount ? t('overview.loading_data') : t('overview.scanning_vaults')}
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

function MetricCard({ label, value, icon, trend }: { label: string, value: string, icon: ReactNode, trend: string }) {
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
}
