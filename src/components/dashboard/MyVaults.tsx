import React from 'react';
import { useVaults } from '../../context/VaultContext';
import { Bot, Zap, TrendingUp, Clock, ChevronRight } from 'lucide-react';

export default function MyVaults() {
    const { vaults, setStep, setActiveVaultId } = useVaults();

    if (vaults.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-grinta-text-secondary opacity-50">
                    <Bot size={40} className="animate-pulse" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold font-syncopate uppercase tracking-widest text-white/40">No hay Vaults</h2>
                    <p className="text-grinta-text-secondary text-sm">Crea tu primer vault para empezar a generar yield agéntico.</p>
                </div>
                <button
                    onClick={() => setStep('connect')}
                    className="px-8 py-3 bg-grinta-accent text-black font-bold rounded-xl hover:scale-105 transition-transform"
                >
                    CREAR VAULT
                </button>
            </div>
        );
    }

    return (
        <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-white uppercase tracking-widest">Mis Vaults Activos</h2>
                <span className="px-3 py-1 rounded-full bg-grinta-accent/10 border border-grinta-accent/20 text-grinta-accent text-[10px] font-bold">
                    {vaults.length} OPERANDO
                </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {vaults.map((vault) => (
                    <button
                        key={vault.id}
                        onClick={() => {
                            setActiveVaultId(vault.id);
                            setStep('vault_view');
                        }}
                        className="group relative bg-grinta-card border border-grinta-card-border rounded-[24px] p-6 text-left hover:border-grinta-accent/50 transition-all overflow-hidden shadow-xl"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-grinta-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center text-grinta-accent">
                                    <Bot size={28} />
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold text-grinta-accent uppercase tracking-widest mb-1">Vault ID: {vault.id}</div>
                                    <div className="text-lg font-bold text-white">{vault.strategy}</div>
                                    <div className="text-xs text-grinta-text-secondary mt-1 flex items-center gap-3">
                                        <span className="flex items-center gap-1"><Clock size={10} /> {new Date(vault.createdAt).toLocaleDateString()}</span>
                                        <span className="flex items-center gap-1 text-grinta-accent font-bold"><Zap size={10} /> Yield Activo</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                <div>
                                    <div className="text-[10px] text-grinta-text-secondary uppercase mb-1">Depósito</div>
                                    <div className="text-base font-bold text-white">{vault.amount.toFixed(2)} BTC</div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-grinta-text-secondary uppercase mb-1">Yield (Total)</div>
                                    <div className="text-base font-bold text-grinta-accent">+{vault.yieldEarned.toFixed(6)} BTC</div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-grinta-text-secondary uppercase mb-1">Flash-Mints</div>
                                    <div className="text-base font-bold text-white">{vault.flashMints}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-grinta-text-secondary uppercase mb-1">Acciones Agent.</div>
                                    <div className="text-base font-bold text-white">{vault.agentActions}</div>
                                </div>
                            </div>

                            <div className="hidden md:block">
                                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-grinta-accent group-hover:text-black transition-all">
                                    <ChevronRight size={20} />
                                </div>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
