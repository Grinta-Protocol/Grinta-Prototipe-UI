import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wallet, ArrowRight, Download, PlusCircle, CheckCircle2, TrendingUp, Zap, Activity, ChevronRight, Loader2, Link as LinkIcon, Bitcoin, Terminal, Clock, ShieldCheck, Bot, LayoutDashboard, User, Settings, MousePointerClick, RefreshCcw, Layers } from 'lucide-react';
import { useVaults, Step } from '../context/VaultContext';

export default function NewVaultFlow() {
    const { step, setStep, vaults, balanceL1, setBalanceL1, balanceL2, setBalanceL2, addVault, setActiveVaultId, activeVaultId, updateVault, depositToVault, withdrawFromVault, borrowGrit, repayGrit } = useVaults();
    const [isProcessing, setIsProcessing] = useState(false);
    const [depositAmount, setDepositAmount] = useState('1.5');
    const [selectedStrategy, setSelectedStrategy] = useState<'agentic' | 'manual'>('agentic');

    // Navigation safety: ask before leaving
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (['connect', 'deposit', 'create_vault'].includes(step)) {
                e.preventDefault();
                e.returnValue = '';
            }
        };

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && ['connect', 'deposit', 'create_vault'].includes(step)) {
                if (window.confirm('¿Quieres salir? Se perderá el progreso actual.')) {
                    setStep('main_dashboard');
                }
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('keydown', handleEscape);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('keydown', handleEscape);
        };
    }, [step, setStep]);

    const steps = [
        { id: 'connect', label: 'Conexión' },
        { id: 'deposit', label: 'Depósito' },
        { id: 'create_vault', label: 'Estrategia' },
        { id: 'vault_view', label: 'Vault Live' }
    ];

    const currentStepIdx = steps.findIndex(s => s.id === step);

    // Paso 1: Conectar Billetera
    const handleConnect = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setStep('deposit');
        }, 1000);
    };

    // Paso 2: Depósito
    const handleDeposit = () => {
        const amount = parseFloat(depositAmount);
        if (amount <= 0) {
            alert("El monto debe ser mayor a 0.");
            return;
        }
        if (amount > balanceL1) {
            alert("No tienes suficiente balance en L1.");
            return;
        }

        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setBalanceL1(prev => prev - amount);
            setBalanceL2(prev => prev + amount);
            setStep('create_vault');
        }, 1500);
    };

    // Paso 3: Crear Vault
    const handleCreateVault = () => {
        const amountToVault = parseFloat(depositAmount);
        if (amountToVault > balanceL2) {
            alert("No tienes suficiente balance en L2.");
            return;
        }

        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            const newVaultId = `v-${Math.random().toString(36).substr(2, 9)}`;
            addVault({
                id: newVaultId,
                amount: amountToVault,
                strategy: selectedStrategy === 'agentic' ? 'Yield Grinta (Agentic)' : 'Staking Pasivo (Manual)',
                type: selectedStrategy,
                apy: selectedStrategy === 'agentic' ? 12.5 : 4.2,
                yieldEarned: 0,
                debt: 0,
                flashMints: 0,
                agentActions: 0,
                logs: [
                    {
                        id: '1',
                        message: `Vault ${selectedStrategy === 'agentic' ? 'Agéntico' : 'Manual'} Creado: Depósito inicial de ${amountToVault} BTC confirmado.`,
                        timestamp: new Date(),
                        type: 'info'
                    }
                ],
                createdAt: new Date()
            });
            setBalanceL2(prev => prev - amountToVault);
            setActiveVaultId(newVaultId);
            setStep('vault_view');
        }, 2000);
    };

    // No interval needed here as VaultContext handles global simulation
    useEffect(() => {
        // Just ensuring we have an active vault if needed
    }, [step, activeVaultId]);

    const activeVault = vaults.find(v => v.id === activeVaultId);

    return (
        <div className="w-full max-w-6xl mx-auto py-8 px-6">
            {/* Step Indicator */}
            {step !== 'main_dashboard' && step !== 'vault_view' && (
                <div className="flex items-center justify-center mb-12">
                    <div className="flex items-center gap-4">
                        {steps.slice(0, 3).map((s, idx) => {
                            const isPast = steps.findIndex(step => step.id === s.id) < currentStepIdx;
                            const isCurrent = s.id === step;
                            return (
                                <React.Fragment key={s.id}>
                                    <div className="flex flex-col items-center gap-2">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ${isPast || isCurrent ? 'bg-grinta-accent text-black' : 'bg-white/5 text-grinta-text-secondary border border-white/10'}`}>
                                            {isPast ? <CheckCircle2 size={20} /> : idx + 1}
                                        </div>
                                        <span className={`text-[10px] font-bold uppercase tracking-widest ${isCurrent ? 'text-grinta-accent' : 'text-grinta-text-secondary opacity-50'}`}>
                                            {s.label}
                                        </span>
                                    </div>
                                    {idx < 2 && (
                                        <div className={`w-20 h-[2px] mb-6 transition-colors duration-500 ${isPast ? 'bg-grinta-accent' : 'bg-white/5'}`}></div>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>
            )}

            <AnimatePresence mode="wait">
                {step === 'connect' && (
                    <motion.div
                        key="connect"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex flex-col items-center justify-center space-y-8 text-center py-12"
                    >
                        <div className="w-24 h-24 rounded-3xl bg-grinta-accent/20 flex items-center justify-center text-grinta-accent shadow-[0_0_50px_rgba(74,222,128,0.2)]">
                            <Wallet size={48} />
                        </div>
                        <div className="space-y-4">
                            <h1 className="text-4xl font-extrabold font-syncopate uppercase tracking-tighter">Bienvenido a Grinta</h1>
                            <p className="text-grinta-text-secondary text-lg max-w-md">Conecta tu billetera para comenzar el viaje hacia el rendimiento agéntico en Bitcoin.</p>
                        </div>
                        <button
                            onClick={handleConnect}
                            disabled={isProcessing}
                            className="px-12 py-4 bg-grinta-accent text-black font-bold rounded-2xl flex items-center gap-3 hover:brightness-110 transition-all shadow-[0_0_30px_rgba(74,222,128,0.3)] disabled:opacity-50"
                        >
                            {isProcessing ? <Loader2 className="animate-spin" /> : <PlusCircle size={20} />}
                            {isProcessing ? 'Conectando...' : 'CONECTAR METAMASK'}
                        </button>
                    </motion.div>
                )}

                {step === 'deposit' && (
                    <motion.div
                        key="deposit"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="w-full max-w-xl mx-auto space-y-8"
                    >
                        <div className="bg-grinta-card border border-grinta-card-border p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-grinta-accent/5 filter blur-3xl pointer-events-none"></div>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
                                    <Bitcoin size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold font-syncopate uppercase tracking-widest text-white">Fondear Grinta</h2>
                                    <p className="text-xs text-grinta-text-secondary">Depósito L1 Mainnet → L2 Rollup</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-bold text-grinta-text-secondary uppercase mb-2 block">Balance L1 Disponible</label>
                                    <div className="text-2xl font-bold text-white">{balanceL1.toFixed(2)} BTC</div>
                                </div>

                                <div className="bg-black/40 border border-white/5 p-6 rounded-2xl space-y-4">
                                    <label className="text-[10px] font-bold text-grinta-text-secondary uppercase block">Monto a Depositar</label>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="number"
                                            value={depositAmount}
                                            onChange={(e) => setDepositAmount(e.target.value)}
                                            className="bg-transparent text-4xl font-bold text-white border-none outline-none w-full"
                                        />
                                        <span className="text-xl font-bold text-orange-500">BTC</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                        <span className="text-[9px] text-grinta-text-secondary uppercase block mb-1">Red Destino</span>
                                        <span className="text-xs font-bold text-grinta-accent">Grinta L2</span>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                        <span className="text-[9px] text-grinta-text-secondary uppercase block mb-1">Costo Estimado</span>
                                        <span className="text-xs font-bold text-white">$1.24 USD</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleDeposit}
                                    disabled={isProcessing}
                                    className="w-full py-5 bg-grinta-accent text-black font-bold rounded-2xl flex items-center justify-center gap-3 hover:brightness-110 transition-all shadow-[0_0_30px_rgba(74,222,128,0.2)] disabled:opacity-50"
                                >
                                    {isProcessing ? <Loader2 className="animate-spin" /> : <Download size={20} />}
                                    {isProcessing ? 'PROCESANDO DEPÓSITO...' : 'CONFIRMAR DEPÓSITO'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {step === 'create_vault' && (
                    <motion.div
                        key="create_vault"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="w-full space-y-8"
                    >
                        <div className="flex justify-between items-end mb-4 px-4">
                            <div>
                                <h2 className="text-3xl font-bold font-syncopate uppercase tracking-tighter text-white">Nuevo Vault</h2>
                                <p className="text-grinta-text-secondary">Selección de Estrategia Agéntica</p>
                            </div>
                            <div className="text-right">
                                <div className="text-[10px] text-grinta-text-secondary uppercase font-bold mb-1">Balance L2</div>
                                <div className="text-2xl font-bold text-grinta-accent">{balanceL2} BTC</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            {/* Strategy: Yield Grinta */}
                            <div
                                className={`p-8 rounded-[2rem] border-2 transition-all duration-300 cursor-pointer relative overflow-hidden group shadow-lg ${selectedStrategy === 'agentic' ? 'border-grinta-accent bg-grinta-accent/5 ring-4 ring-grinta-accent/10' : 'border-white/5 bg-grinta-card hover:border-white/20'}`}
                                onClick={() => setSelectedStrategy('agentic')}
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-grinta-accent/5 filter blur-3xl group-hover:bg-grinta-accent/10 transition-colors pointer-events-none"></div>
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`p-3 rounded-2xl transition-colors ${selectedStrategy === 'agentic' ? 'bg-grinta-accent text-black shadow-[0_0_20px_rgba(74,222,128,0.4)]' : 'bg-white/5 text-grinta-text-secondary'}`}>
                                        <Bot size={24} />
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[9px] font-bold text-grinta-text-secondary uppercase tracking-widest block opacity-70">APY Estimado</span>
                                        <span className="text-2xl font-bold text-grinta-accent">12.5%</span>
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2 font-syncopate tracking-tight">Yield Grinta</h3>
                                <p className="text-xs text-grinta-text-secondary leading-relaxed mb-4">Ecosistema agentizado. Automatizado 24/7 de forma autónoma.</p>
                                <div className="flex items-center gap-2">
                                    <div className="px-3 py-1 rounded-full bg-grinta-accent/20 text-grinta-accent text-[9px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-grinta-accent animate-pulse"></div>
                                        OPTIMIZADO IA
                                    </div>
                                </div>
                            </div>

                            {/* Strategy: Staking Pasivo */}
                            <div
                                className={`p-8 rounded-[2rem] border-2 transition-all duration-300 cursor-pointer relative overflow-hidden group shadow-lg ${selectedStrategy === 'manual' ? 'border-[#F7931A] bg-[#F7931A]/5 ring-4 ring-[#F7931A]/10' : 'border-white/5 bg-grinta-card hover:border-white/20'}`}
                                onClick={() => setSelectedStrategy('manual')}
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#F7931A]/5 filter blur-3xl group-hover:bg-[#F7931A]/10 transition-colors pointer-events-none"></div>
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`p-3 rounded-2xl transition-colors ${selectedStrategy === 'manual' ? 'bg-[#F7931A] text-black shadow-[0_0_20px_rgba(247,147,26,0.4)]' : 'bg-white/5 text-grinta-text-secondary'}`}>
                                        <Bitcoin size={24} />
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[9px] font-bold text-grinta-text-secondary uppercase tracking-widest block opacity-70">APY Esperado</span>
                                        <span className="text-2xl font-bold text-[#F7931A]">4.2%</span>
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2 font-syncopate tracking-tight">Staking Pasivo</h3>
                                <p className="text-xs text-grinta-text-secondary leading-relaxed mb-4">Para humanos. Operaciones manuales y control total del capital.</p>
                                <div className="flex items-center gap-2">
                                    <div className="px-3 py-1 rounded-full bg-[#F7931A]/20 text-[#F7931A] text-[9px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                                        RECOMENDADO HUMANO
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-grinta-card border border-white/5 p-6 rounded-2xl flex flex-col items-center">
                            <div className="w-full flex justify-between mb-4 px-2">
                                <span className="text-xs font-bold text-grinta-text-secondary uppercase tracking-widest">Asignación Total</span>
                                <span className="text-xs font-bold text-white">100% Capital</span>
                            </div>
                            <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden border border-white/5 mb-8">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '100%' }}
                                    transition={{ duration: 1, ease: 'easeOut' }}
                                    className="h-full bg-grinta-accent"
                                />
                            </div>
                            <button
                                onClick={handleCreateVault}
                                disabled={isProcessing}
                                className="w-full max-w-sm py-5 bg-grinta-accent text-black font-bold rounded-2xl flex items-center justify-center gap-3 hover:brightness-110 transition-all shadow-[0_0_30px_rgba(74,222,128,0.2)]"
                            >
                                {isProcessing ? <Loader2 className="animate-spin" /> : <Activity size={20} />}
                                {isProcessing ? 'DESPLEGANDO VAULT...' : 'CREAR VAULT Y GENERAR YIELD'}
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === 'vault_view' && activeVault && (
                    <motion.div
                        key="vault_view"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full"
                    >
                        {(() => {
                            const isManual = activeVault.type === 'manual';
                            const accentText = isManual ? 'text-[#F7931A]' : 'text-grinta-accent';
                            const accentBg = isManual ? 'bg-[#F7931A]/10' : 'bg-grinta-accent/10';

                            return (
                                <>
                                    {/* Left Content Area (2 columns) */}
                                    <div className="lg:col-span-2 space-y-6">
                                        {/* Stats Summary Area & Actions */}
                                        <div className="bg-grinta-card border border-grinta-card-border p-8 rounded-[2rem] shadow-xl relative overflow-hidden flex flex-col group">
                                            <div className={`absolute top-0 right-0 w-64 h-64 ${isManual ? 'bg-[#F7931A]/5' : 'bg-grinta-accent/5'} filter blur-3xl pointer-events-none`}></div>

                                            <div className="flex justify-between items-center w-full mb-8">
                                                <div>
                                                    <span className="text-[10px] font-bold text-grinta-text-secondary uppercase tracking-widest mb-2 block">Valor Total del Vault</span>
                                                    <div className="text-5xl font-bold text-white mb-2 flex items-baseline gap-3">
                                                        {(activeVault.amount + activeVault.yieldEarned).toFixed(6)}
                                                        <span className={`${accentText} text-xl`}>BTC</span>
                                                    </div>
                                                    <div className={`flex items-center gap-2 text-xs font-bold ${accentText}`}>
                                                        <TrendingUp size={14} />
                                                        <span>+{(activeVault.yieldEarned).toFixed(6)} BTC ganados</span>
                                                    </div>
                                                </div>
                                                <div className="bg-black/40 border border-white/5 p-6 rounded-2xl text-right min-w-[150px]">
                                                    <span className="text-[10px] font-bold text-grinta-text-secondary uppercase tracking-widest mb-1 block">APY ACTUAL</span>
                                                    <div className={`text-3xl font-bold ${accentText}`}>{activeVault.apy}%</div>
                                                    <div className="flex items-center justify-end gap-1.5 text-[9px] text-grinta-text-secondary mt-1">
                                                        <Activity size={10} className={`${isManual ? 'text-[#F7931A]' : 'text-grinta-accent'} animate-pulse`} />
                                                        Actualizado en tiempo real
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Control Actions Section nested inside */}
                                            <div className="w-full pt-8 border-t border-white/5">
                                                <div className="flex items-center justify-between mb-6">
                                                    <h3 className="text-xs font-bold text-white font-syncopate uppercase tracking-widest flex items-center gap-2">
                                                        <Settings size={16} className={accentText} />
                                                        Acciones de Control L2
                                                    </h3>
                                                    <div className="flex items-center gap-2 px-3 py-1 bg-black/40 border border-white/10 rounded-lg">
                                                        <span className="text-[9px] font-bold text-grinta-text-secondary uppercase">L2 Disponible:</span>
                                                        <span className="text-xs font-bold text-grinta-accent">{balanceL2.toFixed(4)} BTC</span>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                    <button
                                                        onClick={() => depositToVault(activeVault.id, 0.5)}
                                                        className={`flex flex-col items-center justify-center gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl transition-all group hover:bg-white/10 hover:border-white/20`}
                                                    >
                                                        <div className={`p-2 rounded-lg bg-black/40 group-hover:scale-110 transition-transform ${accentText}`}>
                                                            <PlusCircle size={20} />
                                                        </div>
                                                        <span className="text-[10px] font-bold text-white uppercase tracking-tighter">Deposit WBTC</span>
                                                    </button>

                                                    <button
                                                        onClick={() => withdrawFromVault(activeVault.id, 0.5)}
                                                        disabled={activeVault.amount <= 0}
                                                        className={`flex flex-col items-center justify-center gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl transition-all group disabled:opacity-30 disabled:grayscale hover:bg-white/10 hover:border-white/20`}
                                                    >
                                                        <div className={`p-2 rounded-lg bg-black/40 group-hover:scale-110 transition-transform ${accentText}`}>
                                                            <Download size={20} />
                                                        </div>
                                                        <span className="text-[10px] font-bold text-white uppercase tracking-tighter">Withdraw WBTC</span>
                                                    </button>

                                                    <button
                                                        onClick={() => borrowGrit(activeVault.id, 100)}
                                                        disabled={activeVault.amount <= 0}
                                                        className={`flex flex-col items-center justify-center gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl transition-all group disabled:opacity-30 disabled:grayscale hover:bg-white/10 hover:border-white/20`}
                                                    >
                                                        <div className={`p-2 rounded-lg bg-black/40 group-hover:scale-110 transition-transform text-blue-400`}>
                                                            <Zap size={20} />
                                                        </div>
                                                        <span className="text-[10px] font-bold text-white uppercase tracking-tighter">Borrow GRIT</span>
                                                    </button>

                                                    <button
                                                        onClick={() => repayGrit(activeVault.id, 100)}
                                                        disabled={activeVault.amount <= 0}
                                                        className={`flex flex-col items-center justify-center gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl transition-all group disabled:opacity-30 disabled:grayscale hover:bg-white/10 hover:border-white/20`}
                                                    >
                                                        <div className={`p-2 rounded-lg bg-black/40 group-hover:scale-110 transition-transform text-purple-400`}>
                                                            <RefreshCcw size={20} />
                                                        </div>
                                                        <span className="text-[10px] font-bold text-white uppercase tracking-tighter">Repay GRIT</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Dynamic Activity/Management Card */}
                                        <div className="bg-grinta-card border border-grinta-card-border p-8 rounded-[2rem] shadow-xl space-y-8">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${accentBg} ${accentText}`}>
                                                    {isManual ? <User size={20} /> : <Bot size={20} />}
                                                </div>
                                                <h3 className="text-sm font-bold text-white font-syncopate uppercase tracking-widest">
                                                    {isManual ? 'Gestión Manual de Capital' : 'Actividad Agéntica en Vivo'}
                                                </h3>
                                            </div>

                                            {isManual ? (
                                                /* Manual View Content */
                                                <div className="space-y-8">
                                                    <div className="grid grid-cols-3 gap-6">
                                                        <div className="bg-black/40 border border-white/5 p-5 rounded-2xl relative overflow-hidden group">
                                                            <div className="text-2xl font-bold text-white mb-1">98.5%</div>
                                                            <div className="text-[9px] font-bold text-grinta-text-secondary uppercase">Salud de la Posición</div>
                                                        </div>
                                                        <div className="bg-black/40 border border-white/5 p-5 rounded-2xl relative overflow-hidden group">
                                                            <div className="text-2xl font-bold text-white mb-1">1.8x</div>
                                                            <div className="text-[9px] font-bold text-grinta-text-secondary uppercase">Factor de Riesgo</div>
                                                        </div>
                                                        <div className="bg-black/40 border border-white/5 p-5 rounded-2xl relative overflow-hidden group">
                                                            <div className="text-2xl font-bold text-[#F7931A] mb-1">{(activeVault.amount * 0.1).toFixed(2)} BTC</div>
                                                            <div className="text-[9px] font-bold text-grinta-text-secondary uppercase">Liquidez Disponible</div>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <button className="flex items-center justify-center gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold text-white hover:bg-[#F7931A]/10 hover:border-[#F7931A]/30 transition-all group">
                                                            <RefreshCcw size={16} className="text-[#F7931A] group-hover:rotate-180 transition-transform duration-500" />
                                                            Reequilibrar Capital
                                                        </button>
                                                        <button className="flex items-center justify-center gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold text-white hover:bg-[#F7931A]/10 hover:border-[#F7931A]/30 transition-all group">
                                                            <Layers size={16} className="text-[#F7931A] group-hover:translate-y-[-2px] transition-transform" />
                                                            Ajustar Estrategia
                                                        </button>
                                                    </div>

                                                    <div className="bg-black/20 border border-white/5 rounded-3xl p-10 flex flex-col items-center">
                                                        <div className="w-16 h-16 rounded-full bg-[#F7931A]/10 border border-[#F7931A]/30 flex items-center justify-center text-[#F7931A] mb-4 shadow-[0_0_20px_rgba(247,147,26,0.1)]">
                                                            <MousePointerClick size={32} />
                                                        </div>
                                                        <p className="text-[11px] text-grinta-text-secondary text-center max-w-sm">
                                                            Estás en modo manual. Tus agentes están en pausa y tú tienes el control total de las operaciones y el riesgo.
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : (
                                                /* Agentic View Content */
                                                <div className="space-y-8">
                                                    <div className="grid grid-cols-3 gap-6">
                                                        <div className="bg-black/40 border border-white/5 p-5 rounded-2xl relative overflow-hidden group">
                                                            <div className="flex justify-between items-start mb-4">
                                                                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                                                                    <Zap size={16} />
                                                                </div>
                                                                <span className="text-[9px] font-bold text-grinta-text-secondary uppercase opacity-60">Métricas</span>
                                                            </div>
                                                            <div className="text-2xl font-bold text-white mb-1">{activeVault.flashMints}</div>
                                                            <div className="text-[9px] font-bold text-grinta-text-secondary uppercase">Flash-Mints Ejecutados</div>
                                                        </div>

                                                        <div className="bg-black/40 border border-white/5 p-5 rounded-2xl relative overflow-hidden group">
                                                            <div className="flex justify-between items-start mb-4">
                                                                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                                                                    <Activity size={16} />
                                                                </div>
                                                                <span className="text-[9px] font-bold text-grinta-text-secondary uppercase opacity-60">Métricas</span>
                                                            </div>
                                                            <div className="text-2xl font-bold text-white mb-1">{activeVault.agentActions}</div>
                                                            <div className="text-[9px] font-bold text-grinta-text-secondary uppercase">Oportunidades de Arbitraje</div>
                                                        </div>

                                                        <div className="bg-black/40 border border-white/5 p-5 rounded-2xl relative overflow-hidden group">
                                                            <div className="flex justify-between items-start mb-4">
                                                                <div className="p-2 rounded-lg bg-grinta-accent/10 text-grinta-accent">
                                                                    <ShieldCheck size={16} />
                                                                </div>
                                                                <span className="text-[9px] font-bold text-grinta-text-secondary uppercase opacity-60">Estado</span>
                                                            </div>
                                                            <div className="text-lg font-bold text-grinta-accent mb-1">Colateralizado</div>
                                                            <div className="text-[9px] font-bold text-grinta-text-secondary uppercase">Ratio: 100.00%</div>
                                                        </div>
                                                    </div>

                                                    <div className="bg-black/20 border border-white/5 rounded-3xl p-10 relative">
                                                        <div className="flex justify-between items-center relative z-10">
                                                            <div className="flex flex-col items-center gap-3">
                                                                <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 shadow-lg">
                                                                    <Bitcoin size={28} />
                                                                </div>
                                                                <span className="text-[10px] font-bold text-grinta-text-secondary uppercase">Tu Vault</span>
                                                            </div>

                                                            <div className="flex flex-col items-center gap-3 relative">
                                                                <div className="w-16 h-16 rounded-full bg-grinta-accent/10 border border-grinta-accent/30 flex items-center justify-center text-grinta-accent shadow-[0_0_30px_rgba(74,222,128,0.2)]">
                                                                    <Bot size={32} />
                                                                </div>
                                                                <span className="text-[10px] font-bold text-grinta-accent uppercase">Agentes Grinta</span>
                                                            </div>

                                                            <div className="flex flex-col items-center gap-3">
                                                                <div className="w-14 h-14 rounded-2xl bg-grinta-accent/10 border border-grinta-accent/20 flex items-center justify-center text-grinta-accent opacity-60">
                                                                    <TrendingUp size={28} />
                                                                </div>
                                                                <span className="text-[10px] font-bold text-grinta-text-secondary uppercase">Mercado L2</span>
                                                            </div>
                                                        </div>

                                                        <div className="absolute top-1/2 left-24 right-24 h-[1px] bg-white/10 -translate-y-6">
                                                            <motion.div
                                                                className="absolute top-0 w-2 h-2 rounded-full bg-grinta-accent"
                                                                animate={{ x: [0, 280] }}
                                                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                                            />
                                                            <motion.div
                                                                className="absolute top-0 w-2 h-2 rounded-full bg-blue-400"
                                                                animate={{ x: [280, 560] }}
                                                                transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 1 }}
                                                            />
                                                        </div>

                                                        <p className="text-[9px] text-grinta-text-secondary text-center mt-12 opacity-60">
                                                            Los agentes utilizan tu liquidez para ejecutar Flash-Mints y arbitraje, retornando las ganancias al Vault.
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right Content Area (1 column) */}
                                    <div className="lg:col-span-1 space-y-6">
                                        <div className="bg-grinta-card border border-grinta-card-border p-6 rounded-[2rem] shadow-xl">
                                            <h3 className="text-[11px] font-bold text-white font-syncopate uppercase tracking-widest mb-6">Detalles del Vault</h3>
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center py-3 border-b border-white/5">
                                                    <span className="text-[10px] text-grinta-text-secondary uppercase font-bold">ID</span>
                                                    <span className="text-[10px] text-white/70 font-mono">{activeVault.id}</span>
                                                </div>
                                                <div className="flex justify-between items-center py-3 border-b border-white/5">
                                                    <span className="text-[10px] text-grinta-text-secondary uppercase font-bold">Estrategia</span>
                                                    <span className={`text-[10px] ${accentText} font-bold`}>{activeVault.strategy}</span>
                                                </div>
                                                <div className="flex justify-between items-center py-3 border-b border-white/5">
                                                    <span className="text-[10px] text-grinta-text-secondary uppercase font-bold">Colateral</span>
                                                    <span className="text-[10px] text-white font-bold">{activeVault.amount.toFixed(4)} BTC</span>
                                                </div>
                                                <div className="flex justify-between items-center py-3 border-b border-white/5">
                                                    <span className="text-[10px] text-grinta-text-secondary uppercase font-bold">Deuda Actual</span>
                                                    <span className="text-[10px] text-blue-400 font-bold">{(activeVault.debt || 0).toFixed(2)} GRIT</span>
                                                </div>
                                                <div className="flex justify-between items-center py-3">
                                                    <span className="text-[10px] text-grinta-text-secondary uppercase font-bold">Estado</span>
                                                    <div className={`px-2 py-1 rounded-md ${accentBg} ${accentText} text-[9px] font-bold uppercase tracking-wider`}>Activo</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-grinta-card border border-grinta-card-border p-6 rounded-[2rem] shadow-xl flex flex-col min-h-[400px]">
                                            <div className="flex items-center gap-3 mb-6">
                                                <Clock size={16} className="text-grinta-text-secondary" />
                                                <h3 className="text-[11px] font-bold text-white font-syncopate uppercase tracking-widest text-grinta-text-secondary">Log de Operaciones</h3>
                                            </div>

                                            <div className="flex-1 space-y-3 overflow-y-auto max-h-[350px] custom-scrollbar pr-2">
                                                {activeVault.logs.slice().reverse().map((log, idx) => (
                                                    <motion.div
                                                        key={log.id}
                                                        initial={{ opacity: 0, x: 20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        className="bg-black/30 p-4 rounded-2xl border border-white/5 relative overflow-hidden group"
                                                    >
                                                        <div className="flex justify-between items-center mb-1 relative z-10">
                                                            <span className={`text-[10px] font-bold uppercase tracking-wider ${log.type === 'agent' ? accentText : 'text-blue-400'}`}>
                                                                {log.message.includes('Arbitraje') ? 'Arbitraje' : log.message.includes('Flash-Mint') ? 'Flash-Mint' : 'Evento'}
                                                            </span>
                                                            <span className="text-[9px] text-grinta-text-secondary opacity-50">
                                                                {idx === 0 ? 'Hace instantes' : 'Reciente'}
                                                            </span>
                                                        </div>
                                                        <p className="text-[10px] text-grinta-text-secondary leading-tight mt-1 relative z-10">
                                                            {log.message}
                                                        </p>
                                                    </motion.div>
                                                ))}
                                            </div>

                                        </div>
                                    </div>
                                </>
                            );
                        })()}
                    </motion.div >
                )}
            </AnimatePresence >
        </div >
    );
}

// Sub-components as needed or icons

