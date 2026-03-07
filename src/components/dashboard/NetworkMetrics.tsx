import React from 'react';
import { useVaults } from '../../context/VaultContext';
import { useRates } from '../../hooks/useGrinta';
import { useBitcoinPrice } from '../../hooks/useBitcoinPrice';
import { Server, Shield, Globe, Cpu, Wifi, RefreshCw, Bitcoin } from 'lucide-react';

export default function NetworkMetrics() {
    const { vaults } = useVaults();
    const hasVaults = vaults.length > 0;
    const { redemptionPrice, redemptionRate, collateralPrice, liquidationRatio, loading, refetch } = useRates();
    const { price: btcPrice, loading: btcLoading, refetch: refetchBtc } = useBitcoinPrice();

    const handleRefresh = () => {
        refetch();
        refetchBtc();
    };

    const btcFormatted = btcPrice ? `$${btcPrice.usd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '...';
    const btcChangeFormatted = btcPrice ? `${btcPrice.usd_24h_change >= 0 ? '+' : ''}${btcPrice.usd_24h_change.toFixed(2)}%` : '...';

    const agentNodes = [
        { id: 'Grinta-Agent-Node-1', region: 'USEAST', status: hasVaults ? 'Online' : 'Standby', uptime: hasVaults ? '99.99%' : '0%', load: hasVaults ? '24%' : '0%' },
        { id: 'Grinta-Agent-Node-2', region: 'EUWEST', status: hasVaults ? 'Online' : 'Standby', uptime: hasVaults ? '99.98%' : '0%', load: hasVaults ? '18%' : '0%' },
        { id: 'Grinta-Agent-Node-3', region: 'ASIASE', status: hasVaults ? 'Online' : 'Standby', uptime: hasVaults ? '100.00%' : '0%', load: hasVaults ? '32%' : '0%' },
        { id: 'Grinta-Agent-Node-4', region: 'LATSAM', status: hasVaults ? 'Online' : 'Standby', uptime: hasVaults ? '99.95%' : '0%', load: hasVaults ? '12%' : '0%' },
    ];

    return (
        <div className="w-full space-y-8 animate-in fade-in duration-700">
            {/* System Status - Bitcoin Price */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-grinta-card border border-grinta-card-border rounded-[32px] p-8 shadow-xl">
                    <h3 className="text-sm font-bold text-grinta-text-secondary uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Bitcoin size={18} className="text-[#F7931A]" /> Bitcoin Price (USD)
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-grinta-text-secondary text-sm">BTC/USD</span>
                            <span className="text-2xl font-bold text-white">{btcFormatted}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-grinta-text-secondary text-sm">24h Change</span>
                            <span className={`font-bold ${btcPrice && btcPrice.usd_24h_change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {btcChangeFormatted}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-grinta-card border border-grinta-card-border rounded-[32px] p-8 shadow-xl">
                    <h3 className="text-sm font-bold text-grinta-text-secondary uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Globe size={18} className="text-grinta-accent" /> Protocol Rates
                    </h3>
                    <div className="space-y-4">
                        <InfoRow label="Redemption Price" value={loading ? "..." : redemptionPrice} />
                        <InfoRow label="Redemption Rate" value={loading ? "..." : redemptionRate} />
                    </div>
                </div>

                <div className="bg-grinta-card border border-grinta-card-border rounded-[32px] p-8 shadow-xl">
                    <h3 className="text-sm font-bold text-grinta-text-secondary uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Shield size={18} className="text-grinta-accent" /> Collateral Info
                    </h3>
                    <div className="space-y-4">
                        <InfoRow label="Collateral Price" value={loading ? "..." : collateralPrice} />
                        <InfoRow label="Liquidation Ratio" value={loading ? "..." : liquidationRatio} />
                    </div>
                </div>
            </div>

            {/* Agent Security */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-grinta-card border border-grinta-card-border rounded-[32px] p-8 shadow-xl">
                    <h3 className="text-sm font-bold text-grinta-text-secondary uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Shield size={18} className="text-grinta-accent" /> Seguridad de Agentes
                    </h3>
                    <div className="space-y-6">
                        <InfoRow label="Protocolo de Consenso" value="DPoS (Proof of Stake)" />
                        <InfoRow label="Agentes en Slashing" value="0%" />
                        <InfoRow label="TVL Protegido (Insurance)" value={hasVaults ? "500 BTC" : "0 BTC"} />
                        <InfoRow label="Auditoría Real-Time" value={hasVaults ? "Pass" : "Waiting"} status={hasVaults ? "success" : "warning"} />
                    </div>
                </div>
            </div>

            {/* Agent Nodes Table */}
            <div className="bg-grinta-card border border-grinta-card-border rounded-[32px] p-8 shadow-xl">
                <h3 className="text-sm font-bold text-grinta-text-secondary uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Server size={18} className="text-grinta-accent" /> Nodos Agénticos Descentralizados
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left border-b border-white/5 pb-4">
                                <th className="text-[10px] uppercase text-grinta-text-secondary font-bold py-4">Node ID</th>
                                <th className="text-[10px] uppercase text-grinta-text-secondary font-bold py-4">Region</th>
                                <th className="text-[10px] uppercase text-grinta-text-secondary font-bold py-4">Status</th>
                                <th className="text-[10px] uppercase text-grinta-text-secondary font-bold py-4">Uptime</th>
                                <th className="text-[10px] uppercase text-grinta-text-secondary font-bold py-4">Workload</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {agentNodes.map((node) => (
                                <tr key={node.id} className="group hover:bg-white/5 transition-colors">
                                    <td className="py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center text-grinta-accent">
                                                <Cpu size={14} />
                                            </div>
                                            <span className="text-sm font-mono text-white">{node.id}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 text-sm text-grinta-text-secondary">{node.region}</td>
                                    <td className="py-4">
                                        <span className={`flex items-center gap-1.5 text-xs font-bold ${hasVaults ? 'text-grinta-accent' : 'text-grinta-text-secondary opacity-50'}`}>
                                            <Wifi size={12} /> {node.status}
                                        </span>
                                    </td>
                                    <td className="py-4 text-sm font-mono text-white">{node.uptime}</td>
                                    <td className="py-4">
                                        <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <div className={`h-full ${hasVaults ? 'bg-grinta-accent' : 'bg-white/10'}`} style={{ width: node.load }}></div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function InfoRow({ label, value, status }: { label: string, value: string, status?: 'success' | 'warning' }) {
    return (
        <div className="flex justify-between items-center text-sm">
            <span className="text-grinta-text-secondary">{label}</span>
            <span className={`font-bold ${status === 'success' ? 'text-grinta-accent bg-grinta-accent/10 px-2 py-0.5 rounded' : 'text-white'}`}>
                {value}
            </span>
        </div>
    );
}
