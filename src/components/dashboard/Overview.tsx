import React from 'react';
import { useVaults } from '../../context/VaultContext';
import { Activity, Zap, Users, TrendingUp } from 'lucide-react';

export default function Overview() {
    const { market, vaults } = useVaults();

    const totalUserDeposits = vaults.reduce((acc, v) => acc + v.amount, 0);
    const averageApy = 12.5; // From spec

    const hasVaults = vaults.length > 0;

    return (
        <div className="w-full space-y-8 animate-in fade-in duration-700">
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    label="TVL Global"
                    value={`${market.tvl.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} BTC`}
                    icon={<Activity size={20} className="text-grinta-accent" />}
                    trend={hasVaults ? "+0.1 BTC / 3s" : "En Espera"}
                />
                <MetricCard
                    label="APY Promedio"
                    value={`${hasVaults ? averageApy : 0}%`}
                    icon={<TrendingUp size={20} className="text-blue-400" />}
                    trend={hasVaults ? "Estable" : "Sin Actividad"}
                />
                <MetricCard
                    label="Flash-Mints (24h)"
                    value={market.flashMints24h.toLocaleString()}
                    icon={<Zap size={20} className="text-yellow-400" />}
                    trend={hasVaults ? "En aumento" : "Postergado"}
                />
                <MetricCard
                    label="Agentes Activos"
                    value={hasVaults ? "156" : "0"}
                    icon={<Users size={20} className="text-purple-400" />}
                    trend={hasVaults ? "Operativos" : "En Pausa"}
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

            {/* Peg Health - Real PID Chart */}
            <div className="bg-grinta-card border border-grinta-card-border rounded-[32px] p-8 relative overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-grinta-text-secondary text-sm font-bold uppercase tracking-widest mb-1">Salud del Peg (GRIT/USD)</h3>
                        <p className="text-[10px] text-grinta-text-secondary opacity-60">Controlador PID: Estabilización algorítmica activa</p>
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] text-grinta-text-secondary uppercase mb-1">Redemption Price</div>
                        <div className="text-xl font-bold text-grinta-accent font-mono">
                            {market.redemptionPrice.toFixed(4)} <span className="text-xs">USD</span>
                        </div>
                    </div>
                </div>

                <div className="h-48 w-full relative group">
                    {/* Horizontal Reference Line at 1.000 */}
                    <div className="absolute inset-x-0 h-[1px] bg-white/10 top-1/2"></div>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
                        <div className="text-[9px] bg-grinta-accent/10 text-grinta-accent px-2 py-0.5 rounded border border-grinta-accent/20 font-mono backdrop-blur-sm mr-4">
                            1.000 Target
                        </div>
                    </div>

                    {/* SVG Line Chart */}
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 400 100" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#00FF41" stopOpacity="0.2" />
                                <stop offset="100%" stopColor="#00FF41" stopOpacity="0" />
                            </linearGradient>
                        </defs>

                        {/* Area Fill */}
                        <path
                            d={`M 0 100 ${market.redemptionPriceHistory.map((val, i) => {
                                const x = (i / (market.redemptionPriceHistory.length - 1)) * 400;
                                // Map 0.995 - 1.005 to 100 - 0 (height 100 scale)
                                const y = 100 - ((val - 0.995) / 0.01) * 100;
                                return `L ${x} ${y}`;
                            }).join(' ')} L 400 100 Z`}
                            fill="url(#lineGradient)"
                        />

                        {/* Line */}
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

                        {/* Current Point Dot */}
                        <circle
                            cx="400"
                            cy={100 - ((market.redemptionPrice - 0.995) / 0.01) * 100}
                            r="4"
                            fill="#00FF41"
                            className="animate-pulse"
                        />
                    </svg>

                    {/* Grid labels */}
                    <div className="absolute left-0 inset-y-0 flex flex-col justify-between text-[8px] text-grinta-text-secondary font-mono py-1">
                        <span>1.005</span>
                        <span>0.995</span>
                    </div>
                </div>

                <div className="flex justify-between mt-6">
                    <div className="flex items-center gap-6">
                        <div className="space-y-1">
                            <span className="text-[9px] text-grinta-text-secondary uppercase block">Desviación</span>
                            <span className="text-xs font-bold text-white font-mono">
                                {((market.redemptionPrice - 1) * 100).toFixed(4)}%
                            </span>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[9px] text-grinta-text-secondary uppercase block">Rate (PID)</span>
                            <span className={`text-xs font-bold font-mono ${market.redemptionRate >= 0 ? 'text-grinta-accent' : 'text-red-400'}`}>
                                {market.redemptionRate.toFixed(4)}%
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-grinta-text-secondary font-mono">
                        <div className={`w-2 h-2 rounded-full ${hasVaults ? 'bg-grinta-accent animate-pulse' : 'bg-red-500'}`}></div>
                        {hasVaults ? 'SISTEMA OPERATIVO' : 'STANDBY'}
                    </div>
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
