import React from 'react';
import { useVaults } from '../../context/VaultContext';
import { Activity, Zap, Users, TrendingUp } from 'lucide-react';

export default function Overview() {
    const { market, vaults } = useVaults();

    const totalUserDeposits = vaults.reduce((acc, v) => acc + v.amount, 0);
    const averageApy = 12.5; // From spec

    return (
        <div className="w-full space-y-8 animate-in fade-in duration-700">
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    label="TVL Global"
                    value={`${market.tvl.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} BTC`}
                    icon={<Activity size={20} className="text-grinta-accent" />}
                    trend="+0.1 BTC / 3s"
                />
                <MetricCard
                    label="APY Promedio"
                    value={`${averageApy}%`}
                    icon={<TrendingUp size={20} className="text-blue-400" />}
                    trend="Estable"
                />
                <MetricCard
                    label="Flash-Mints (24h)"
                    value={market.flashMints24h.toLocaleString()}
                    icon={<Zap size={20} className="text-yellow-400" />}
                    trend="En aumento"
                />
                <MetricCard
                    label="Agentes Activos"
                    value="156"
                    icon={<Users size={20} className="text-purple-400" />}
                    trend="Operativos"
                />
            </div>

            {/* User Participation */}
            <div className="bg-grinta-card border border-grinta-card-border rounded-[32px] p-8 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Zap size={120} className="text-grinta-accent" />
                </div>
                <div className="relative z-10">
                    <h3 className="text-grinta-text-secondary text-sm font-bold uppercase tracking-widest mb-2">Tu Participación</h3>
                    <div className="flex items-baseline gap-3">
                        <span className="text-5xl font-extrabold text-white">{totalUserDeposits.toFixed(2)}</span>
                        <span className="text-2xl font-bold text-grinta-accent">BTC</span>
                    </div>
                    <p className="text-grinta-text-secondary text-sm mt-4">Asignado en {vaults.length} Vaults activos</p>
                </div>
            </div>

            {/* Peg Health Simulation (Placeholder for Chart) */}
            <div className="bg-grinta-card border border-grinta-card-border rounded-[32px] p-8 relative overflow-hidden shadow-2xl">
                <h3 className="text-grinta-text-secondary text-sm font-bold uppercase tracking-widest mb-6">Salud del Peg (GRIT/USD)</h3>
                <div className="h-48 w-full flex items-center justify-center relative">
                    <div className="absolute inset-x-0 h-[1px] bg-white/10 top-1/2"></div>
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center">
                        <div className="text-[10px] bg-grinta-accent/20 text-grinta-accent px-2 py-1 rounded border border-grinta-accent/30 font-mono">
                            1.000 USD
                        </div>
                    </div>
                    {/* Simulated mini-chart-like animation */}
                    <div className="flex items-end gap-1 h-32 w-full px-4">
                        {Array.from({ length: 40 }).map((_, i) => {
                            const height = 40 + Math.random() * 20;
                            return (
                                <div
                                    key={i}
                                    className="flex-1 bg-grinta-accent/20 rounded-t-sm animate-pulse"
                                    style={{
                                        height: `${height}%`,
                                        animationDelay: `${i * 0.1}s`,
                                        animationDuration: '2s'
                                    }}
                                ></div>
                            );
                        })}
                    </div>
                </div>
                <div className="flex justify-between mt-4 text-[10px] text-grinta-text-secondary font-mono">
                    <span>-5m</span>
                    <span className="text-grinta-accent">LIVE</span>
                </div>
            </div>
        </div>
    );
}

function MetricCard({ label, value, icon, trend }: { label: string, value: string, icon: React.ReactNode, trend: string }) {
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
