import React from 'react';
import { useVaults } from '../../context/VaultContext';
import { Bot, Zap, TrendingUp, Clock, ChevronRight, Bitcoin } from 'lucide-react';

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
                {vaults.map((vault) => {
                    const isManual = vault.type === 'manual';
                    const accentColor = isManual ? '#F7931A' : '#00FF41';
                    const accentBg = isManual ? 'bg-[#F7931A]/10' : 'bg-grinta-accent/10';
                    const accentText = isManual ? 'text-[#F7931A]' : 'text-grinta-accent';
                    const borderHover = isManual ? 'hover:border-[#F7931A]/50' : 'hover:border-grinta-accent/50';

                    return (
                        <button
                            key={vault.id}
                            onClick={() => {
                                setActiveVaultId(vault.id);
                                setStep('vault_view');
                            }}
                            className={`group relative bg-grinta-card border border-grinta-card-border rounded-[24px] p-6 text-left ${borderHover} transition-all overflow-hidden shadow-xl`}
                        >
                            <div className={`absolute inset-0 bg-gradient-to-r ${isManual ? 'from-[#F7931A]/5' : 'from-grinta-accent/5'} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`}></div>

                            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                    <div className={`w-14 h-14 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center ${accentText}`}>
                                        {isManual ? <Bitcoin size={28} /> : <Bot size={28} />}
                                    </div>
                                    <div>
                                        <div className={`text-[10px] font-bold ${accentText} uppercase tracking-widest mb-1`}>Vault ID: {vault.id}</div>
                                        <div className="text-lg font-bold text-white">{vault.strategy}</div>
                                        <div className="text-xs text-grinta-text-secondary mt-1 flex items-center gap-3">
                                            <span className="flex items-center gap-1"><Clock size={10} /> {new Date(vault.createdAt).toLocaleDateString()}</span>
                                            <span className={`flex items-center gap-1 ${accentText} font-bold`}><Zap size={10} /> Yield Activo</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                                    <div>
                                        <div className="text-[10px] text-grinta-text-secondary uppercase mb-1">Colateral</div>
                                        <div className="text-base font-bold text-white">{vault.amount.toFixed(2)} BTC</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-grinta-text-secondary uppercase mb-1">Yield</div>
                                        <div className={`text-base font-bold ${accentText}`}>+{vault.yieldEarned.toFixed(6)} BTC</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-grinta-text-secondary uppercase mb-1">Deuda</div>
                                        <div className="text-base font-bold text-blue-400">{(vault.debt || 0).toFixed(1)} GRIT</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-grinta-text-secondary uppercase mb-1">Flash-Mints</div>
                                        <div className="text-base font-bold text-white">{isManual ? '0' : vault.flashMints}</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-grinta-text-secondary uppercase mb-1">{isManual ? 'Control' : 'Acciones IA'}</div>
                                        <div className="text-base font-bold text-white">{isManual ? 'Manual' : vault.agentActions}</div>
                                    </div>
                                </div>

                                <div className="hidden md:block">
                                    <div className={`w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-opacity-100 transition-all ${isManual ? 'group-hover:bg-[#F7931A]' : 'group-hover:bg-grinta-accent'} group-hover:text-black`}>
                                        <ChevronRight size={20} />
                                    </div>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
