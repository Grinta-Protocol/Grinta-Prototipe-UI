import React, { useState } from 'react';
import { useAccount } from '@starknet-react/core';
import { Lock, ArrowLeft, Activity, Megaphone, Terminal, ShieldCheck, Gauge, Globe, Zap, AlertTriangle, CloudLightning } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AgentMarketing from './AgentMarketing';
import { motion, AnimatePresence } from 'framer-motion';

const AUTHORIZED_WALLETS = [
    "0x028607Cc6A079F47b175A30cC4f58147d76F96A669937ef771CB5A7b001f06ef",
    "0x072F0D2391F7ce9103D31a64b6A36e0Fe8d32f908D2e183A02d9D46403b21ce2"
];

export default function AgentHubAdmin() {
    const { address } = useAccount();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<'marketing' | 'monitoring'>('marketing');

    const isAuthorized = React.useMemo(() => {
        if (!address) return false;
        const userAddr = address.toLowerCase().replace(/^0x0+/, '0x');
        return AUTHORIZED_WALLETS.some(auth =>
            auth.toLowerCase().replace(/^0x0+/, '0x') === userAddr
        );
    }, [address]);

    if (!isAuthorized) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
                <div className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-8 shadow-[0_0_50px_rgba(239,68,68,0.1)]">
                    <Lock size={40} />
                </div>
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">
                    {t('admin.access_denied', 'Access Denied')}
                </h2>
                <p className="text-grinta-text-secondary max-w-md mb-8 font-medium">
                    {t('admin.restricted_desc', 'This orchestration layer is isolated. Only authorized Grinta Protocol operators can access the Agentic Hub Control.')}
                </p>
                <button
                    onClick={() => navigate('/app/')}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white hover:bg-white/10 transition-all uppercase tracking-widest"
                >
                    <ArrowLeft size={16} /> {t('admin.return_to_dash', 'Return to Dashboard')}
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Control Center Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="px-3 py-1 rounded-full bg-grinta-accent/10 border border-grinta-accent/20 text-[10px] font-black text-grinta-accent uppercase tracking-widest">
                            {t('admin.control_center', 'Control Center v2.0')}
                        </div>
                        <ShieldCheck size={14} className="text-grinta-accent" />
                    </div>
                    <h1 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">
                        Agentic <span className="text-grinta-accent">Nexus</span>
                    </h1>
                </div>

                {/* Modular Navigation Bar */}
                <div className="flex items-center gap-2 bg-[#0A0A0A] p-2 rounded-2xl border border-white/5">
                    <TabButton
                        active={activeTab === 'marketing'}
                        onClick={() => setActiveTab('marketing')}
                        icon={<Megaphone size={16} />}
                        label={t('admin.tab_marketing', 'Propagation')}
                    />
                    <TabButton
                        active={activeTab === 'monitoring'}
                        onClick={() => setActiveTab('monitoring')}
                        icon={<Activity size={16} />}
                        label={t('admin.tab_monitoring', 'System Stats')}
                    />
                    <div className="w-px h-6 bg-white/10 mx-2"></div>
                    <button
                        onClick={() => navigate('/app/')}
                        className="p-2.5 rounded-xl bg-white/5 text-white hover:bg-grinta-accent hover:text-black transition-all group"
                        title={t('admin.return_to_dash', 'Return to App')}
                    >
                        <ArrowLeft size={18} />
                    </button>
                </div>
            </div>

            {/* Main Dynamic View */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                >
                    {activeTab === 'marketing' ? (
                        <AgentMarketing />
                    ) : (
                        <SystemMonitoringView />
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${active
                ? 'bg-grinta-accent text-black shadow-[0_0_20px_rgba(0,255,65,0.2)]'
                : 'text-grinta-text-secondary hover:text-white hover:bg-white/5'
                }`}
        >
            {icon}
            <span className="hidden sm:inline">{label}</span>
        </button>
    );
}

function SystemMonitoringView() {
    const { t } = useTranslation();

    return (
        <div className="space-y-8">
            {/* System Pulse Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    label={t('admin.mcp_latency', 'MCP Latency')}
                    value="24.8ms"
                    trend="-12%"
                    trendColor="text-grinta-accent"
                    icon={<Gauge className="text-grinta-accent" size={20} />}
                />
                <MetricCard
                    label={t('admin.mcp_interactions', 'Daily Traces')}
                    value="12.4k"
                    trend="+5.2%"
                    trendColor="text-blue-400"
                    icon={<Globe className="text-blue-400" size={20} />}
                />
                <MetricCard
                    label={t('admin.system_p99', 'P99 Latency')}
                    value="142ms"
                    trend="+2ms"
                    trendColor="text-yellow-400"
                    icon={<Zap className="text-yellow-400" size={20} />}
                />
                <MetricCard
                    label={t('admin.error_rate', 'Error Rate')}
                    value="0.04%"
                    trend="-0.01%"
                    trendColor="text-grinta-accent"
                    icon={<Activity className="text-red-500" size={20} />}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Active Spans Table */}
                <div className="lg:col-span-2 bg-[#0A0A0A] border border-white/5 rounded-[32px] p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-1">{t('admin.active_spans', 'Real-time Trace Log')}</h3>
                            <p className="text-[10px] text-grinta-text-secondary font-bold uppercase tracking-widest">{t('admin.capture_via_mcp', 'Captured via Nexus MCP Reflection')}</p>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping"></span>
                            <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">Live Monitoring</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {[
                            { name: 'mcp.tool_call.swap_wbtc', duration: '45ms', status: 'Success', time: '2s ago' },
                            { name: 'mcp.list_tools', duration: '12ms', status: 'Success', time: '5s ago' },
                            { name: 'mcp.call.get_vault_health', duration: '28ms', status: 'Success', time: '12s ago' },
                            { name: 'mcp.tool_call.open_safe', duration: '312ms', status: 'Pending', time: 'Just now' },
                            { name: 'mcp.resource.read_prices', duration: '89ms', status: 'Error', time: '45s ago' }
                        ].map((trace, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-lg ${trace.status === 'Error' ? 'bg-red-500/10 text-red-500' : 'bg-grinta-accent/10 text-grinta-accent'}`}>
                                        <Terminal size={14} />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-white font-mono">{trace.name}</div>
                                        <div className="text-[9px] text-grinta-text-secondary font-bold uppercase tracking-widest">{trace.time}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-8">
                                    <div className="text-right">
                                        <div className="text-[10px] font-black text-white font-mono">{trace.duration}</div>
                                        <div className={`text-[8px] font-black uppercase tracking-widest ${trace.status === 'Error' ? 'text-red-500' :
                                            trace.status === 'Pending' ? 'text-yellow-500' : 'text-grinta-accent'
                                            }`}>{trace.status}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Network Health */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-[#0A0A0A] border border-white/5 rounded-[32px] p-8 h-full">
                        <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-6">{t('admin.infra_health', 'Infra Snapshot')}</h3>

                        <div className="space-y-8">
                            <HealthRow label="Starknet RPC" status="Operational" />
                            <HealthRow label="4claw Gateway" status="Operational" />
                            <HealthRow label="MoltX Protocol" status="Slow (210ms)" warning />
                            <HealthRow label="Metrics Engine" status="Operational" />

                            <div className="mt-10 p-5 rounded-2xl bg-grinta-accent/5 border border-grinta-accent/10 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-2">
                                    <CloudLightning size={24} className="text-grinta-accent/20 group-hover:scale-125 transition-transform" />
                                </div>
                                <h4 className="text-[10px] font-black text-grinta-accent uppercase tracking-[0.2em] mb-2">{t('admin.nexus_intelligence', 'Nexus Intelligence')}</h4>
                                <div className="space-y-3 mb-4">
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-[8px] font-black opacity-40 uppercase tracking-widest">
                                            <span>Performance (LCP)</span>
                                            <span className="text-grinta-accent">1.2s</span>
                                        </div>
                                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                            <div className="w-[85%] h-full bg-grinta-accent"></div>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-[8px] font-black opacity-40 uppercase tracking-widest">
                                            <span>Error Density</span>
                                            <span className="text-blue-400">0.01%</span>
                                        </div>
                                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                            <div className="w-[5%] h-full bg-blue-400"></div>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-[10px] text-grinta-text-secondary leading-relaxed uppercase font-bold tracking-widest">
                                    {t('admin.nexus_status', 'Session replay active. Profiler capturing call-stacks across 14 modules.')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MetricCard({ label, value, trend, trendColor, icon }: { label: string, value: string, trend: string, trendColor: string, icon: React.ReactNode }) {
    return (
        <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-all group">
            <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-2xl bg-white/5 group-hover:bg-white/10 transition-colors">
                    {icon}
                </div>
                <span className={`text-[10px] font-black ${trendColor} bg-opacity-10 px-2 py-0.5 rounded-lg`}>
                    {trend}
                </span>
            </div>
            <div className="text-[10px] font-black text-grinta-text-secondary uppercase tracking-widest mb-1">{label}</div>
            <div className="text-3xl font-black text-white font-mono">{value}</div>
        </div>
    );
}

function HealthRow({ label, status, warning = false }: { label: string, status: string, warning?: boolean }) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${warning ? 'bg-yellow-500' : 'bg-grinta-accent'}`}></div>
                <span className="text-[11px] font-black text-white uppercase tracking-tighter">{label}</span>
            </div>
            <span className={`text-[9px] font-bold uppercase tracking-widest ${warning ? 'text-yellow-500' : 'text-grinta-text-secondary'}`}>
                {status}
            </span>
        </div>
    );
}
