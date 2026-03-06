import React from 'react';
import { useVaults } from '../../context/VaultContext';
import { Wallet, ArrowDownRight, ArrowUpRight, Bitcoin, CreditCard, ChevronRight } from 'lucide-react';

export default function WalletView() {
    const { balanceL1, balanceL2, vaults } = useVaults();

    const totalUserYield = vaults.reduce((acc, v) => acc + v.yieldEarned, 0);
    const totalVaultDeposits = vaults.reduce((acc, v) => acc + v.amount, 0);

    return (
        <div className="w-full space-y-8 animate-in fade-in duration-700">
            {/* Wallet Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <BalanceCard
                    label="BTC en L1 (Simulado)"
                    amount={balanceL1}
                    unit="BTC"
                    icon={<Bitcoin size={24} className="text-[#F7931A]" />}
                    color="border-orange-500/20"
                />
                <BalanceCard
                    label="BTC en Vaults (L2)"
                    amount={totalVaultDeposits}
                    unit="BTC"
                    icon={<CreditCard size={24} className="text-grinta-accent" />}
                    color="border-grinta-accent/20"
                />
                <BalanceCard
                    label="BTC Disponible (L2)"
                    amount={balanceL2}
                    unit="BTC"
                    icon={<Wallet size={24} className="text-blue-400" />}
                    color="border-blue-500/20"
                />
            </div>

            {/* Yield Claim Card */}
            <div className="bg-grinta-card border border-grinta-card-border rounded-[32px] p-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-grinta-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                    <div>
                        <h3 className="text-sm font-bold text-grinta-text-secondary uppercase tracking-widest mb-2">Rendimiento Acumulado</h3>
                        <div className="flex items-baseline gap-3">
                            <span className="text-5xl font-extrabold text-white">+{totalUserYield.toFixed(6)}</span>
                            <span className="text-2xl font-bold text-grinta-accent">BTC</span>
                        </div>
                        <p className="text-grinta-text-secondary text-sm mt-4">Disponible para reclamar instantáneamente a L2.</p>
                    </div>

                    <button
                        disabled={totalUserYield <= 0}
                        className="px-8 py-5 bg-grinta-accent text-black font-bold text-lg rounded-[20px] hover:scale-105 transition-all shadow-[0_10px_30px_rgba(74,222,128,0.3)] disabled:opacity-50 disabled:grayscale disabled:scale-100 flex items-center gap-3"
                    >
                        RECLAMAR YIELD
                        <ArrowUpRight size={24} />
                    </button>
                </div>
            </div>

            {/* Recent History (Simulated) */}
            <div className="bg-grinta-card border border-grinta-card-border rounded-[32px] p-8 shadow-xl">
                <h3 className="text-sm font-bold text-grinta-text-secondary uppercase tracking-widest mb-6 flex items-center gap-2">
                    Historial de Transacciones
                </h3>
                <div className="space-y-2">
                    {vaults.map((v, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-grinta-accent/10 flex items-center justify-center text-grinta-accent">
                                    <ArrowDownRight size={20} />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-white">Depósito en Vault {v.id}</div>
                                    <div className="text-[10px] text-grinta-text-secondary uppercase tracking-wide">Exitoso • L2 Network</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-bold text-white">-{v.amount.toFixed(2)} BTC</div>
                                <div className="text-[10px] text-grinta-text-secondary">Justo ahora</div>
                            </div>
                        </div>
                    ))}

                    <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                                <ArrowDownRight size={20} />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-white">Bridge L1 → L2</div>
                                <div className="text-[10px] text-grinta-text-secondary uppercase tracking-wide">Exitoso • Bridge Protocol</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm font-bold text-white">+10.00 BTC</div>
                            <div className="text-[10px] text-grinta-text-secondary">Hace 2 horas</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function BalanceCard({ label, amount, unit, icon, color }: { label: string, amount: number, unit: string, icon: React.ReactNode, color: string }) {
    return (
        <div className={`bg-grinta-card border ${color} rounded-[28px] p-6 shadow-xl`}>
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-white/5">
                    {icon}
                </div>
                <span className="text-xs font-bold text-grinta-text-secondary uppercase tracking-widest">{label}</span>
            </div>
            <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">{amount.toFixed(2)}</span>
                <span className="text-sm font-bold text-grinta-text-secondary">{unit}</span>
            </div>
        </div>
    );
}
