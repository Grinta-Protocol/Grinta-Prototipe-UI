import React from 'react';
import { Server, Shield, Globe, Cpu, Wifi } from 'lucide-react';

export default function NetworkMetrics() {
    const agentNodes = [
        { id: 'Grinta-Agent-Node-1', region: 'USEAST', status: 'Online', uptime: '99.99%', load: '24%' },
        { id: 'Grinta-Agent-Node-2', region: 'EUWEST', status: 'Online', uptime: '99.98%', load: '18%' },
        { id: 'Grinta-Agent-Node-3', region: 'ASIASE', status: 'Online', uptime: '100.00%', load: '32%' },
        { id: 'Grinta-Agent-Node-4', region: 'LATSAM', status: 'Online', uptime: '99.95%', load: '12%' },
    ];

    return (
        <div className="w-full space-y-8 animate-in fade-in duration-700">
            {/* Infrastructure Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-grinta-card border border-grinta-card-border rounded-[32px] p-8 shadow-xl">
                    <h3 className="text-sm font-bold text-grinta-text-secondary uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Globe size={18} className="text-grinta-accent" /> Estado del Rollup (L2)
                    </h3>
                    <div className="space-y-6">
                        <InfoRow label="Tiempo de Bloque" value="0.5s" />
                        <InfoRow label="Costo Promedio Tx" value="$0.001" />
                        <InfoRow label="Finalidad L1" value="~12 min" />
                        <InfoRow label="Estado del Sequencer" value="Operativo" status="success" />
                    </div>
                </div>

                <div className="bg-grinta-card border border-grinta-card-border rounded-[32px] p-8 shadow-xl">
                    <h3 className="text-sm font-bold text-grinta-text-secondary uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Shield size={18} className="text-grinta-accent" /> Seguridad de Agentes
                    </h3>
                    <div className="space-y-6">
                        <InfoRow label="Protocolo de Consenso" value="DPoS (Delegated Proof of Stake)" />
                        <InfoRow label="Agentes en Slashing" value="0%" />
                        <InfoRow label="TVL Protegido (Insurance)" value="500 BTC" />
                        <InfoRow label="Auditoría Real-Time" value="Pass" status="success" />
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
                                        <span className="flex items-center gap-1.5 text-xs text-grinta-accent font-bold">
                                            <Wifi size={12} /> {node.status}
                                        </span>
                                    </td>
                                    <td className="py-4 text-sm font-mono text-white">{node.uptime}</td>
                                    <td className="py-4">
                                        <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-grinta-accent" style={{ width: node.load }}></div>
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
