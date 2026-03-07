import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wallet, ArrowRight, Download, PlusCircle, CheckCircle2, TrendingUp, Zap, Activity, Loader2, Bitcoin, Clock, ShieldCheck, Bot, LayoutDashboard, User, Settings, MousePointerClick, RefreshCcw, Layers } from 'lucide-react';
import { useAccount, useConnect, useSendTransaction } from '@starknet-react/core';
import { useVaults, Step } from '../context/VaultContext';
import { config } from '../config/contracts';
import { getSafeEngine, parseBtcAmount, parseGritAmount, btcToWad, formatBtcAmount } from '../lib/starknet';
import { useWbtcBalance } from '../hooks/useGrinta';

export default function NewVaultFlow() {
    const { step, setStep, vaults, balanceL1, setBalanceL1, balanceL2, setBalanceL2, addVault, setActiveVaultId, activeVaultId } = useVaults();
    const [isProcessing, setIsProcessing] = useState(false);
    const [depositAmount, setDepositAmount] = useState('');
    const [selectedStrategy, setSelectedStrategy] = useState<'agentic' | 'manual'>('agentic');
    const [txStatus, setTxStatus] = useState<string | null>(null);
    const [connectingWallet, setConnectingWallet] = useState(false);
    const [createdSafeId, setCreatedSafeId] = useState<number | null>(null);
    const [actionAmount, setActionAmount] = useState('');
    const [actionTxStatus, setActionTxStatus] = useState<string | null>(null);

    const { address, isConnected } = useAccount();
    const { connect, connectors } = useConnect();
    const { sendAsync, isPending } = useSendTransaction({});
    const { balance: wbtcBalance, isLoading: balanceLoading, refetch: refetchBalance } = useWbtcBalance();

    // Navigation safety: ask before leaving
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (['connect', 'fund', 'deposit', 'create_vault'].includes(step)) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && ['connect', 'fund', 'deposit', 'create_vault'].includes(step)) {
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

    const flowSteps = [
        { id: 'connect', label: 'Conexión' },
        { id: 'fund', label: 'Fondeo' },
        { id: 'deposit', label: 'Depósito' },
        { id: 'create_vault', label: 'Estrategia' },
    ];

    const currentStepIdx = flowSteps.findIndex(s => s.id === step);

    // Avance automático si ya está conectado o acaba de conectarse
    useEffect(() => {
        if (step === 'connect' && isConnected && address) {
            const timer = setTimeout(() => {
                setStep('fund');
            }, 1200);
            return () => clearTimeout(timer);
        }

        // Reset sistémico al desconectar
        if (!isConnected && step !== 'connect' && step !== 'main_dashboard') {
            setStep('main_dashboard');
        }
    }, [step, isConnected, address, setStep]);

    // Refetch WBTC balance when arriving at fund or deposit step
    useEffect(() => {
        if ((step === 'fund' || step === 'deposit') && isConnected) {
            refetchBalance();
        }
    }, [step, isConnected]);

    const handleConnectorClick = (connector: any) => {
        setConnectingWallet(true);
        connect({ connector });
    };

    // Deposit step: open_safe + approve + deposit in one multicall tx
    const handleDeposit = async () => {
        if (!address || isPending) return;
        const parsedAmount = parseBtcAmount(depositAmount || '0');
        if (parsedAmount <= 0n || parsedAmount > wbtcBalance) return;

        setIsProcessing(true);
        setTxStatus(null);
        try {
            const engine = getSafeEngine();
            const countBefore = Number(await engine.get_safe_count());
            const newSafeId = countBefore + 1;

            await sendAsync([
                {
                    contractAddress: config.safeManagerAddress,
                    entrypoint: 'open_safe',
                    calldata: [],
                },
                {
                    contractAddress: config.wbtcAddress,
                    entrypoint: 'approve',
                    calldata: [config.collateralJoinAddress, `0x${parsedAmount.toString(16)}`, '0x0'],
                },
                {
                    contractAddress: config.safeManagerAddress,
                    entrypoint: 'deposit',
                    calldata: [newSafeId.toString(), `0x${parsedAmount.toString(16)}`, '0x0'],
                },
            ]);

            setCreatedSafeId(newSafeId);
            setStep('create_vault');
        } catch (err) {
            console.error('deposit failed:', err);
            setTxStatus(`Error: ${(err as Error).message}`);
        } finally {
            setIsProcessing(false);
        }
    };

    // Strategy step: registers the vault in app state (tx already done)
    const handleCreateVault = () => {
        const safeId = createdSafeId;
        if (!safeId) return;

        const depositDisplay = depositAmount || '0';
        const newVaultId = `safe-${safeId}`;
        addVault({
            id: newVaultId,
            safeId: safeId,
            amount: parseFloat(depositDisplay) || 0,
            strategy: selectedStrategy === 'agentic' ? 'Yield Grinta (Agentic)' : 'Staking Pasivo (Manual)',
            type: selectedStrategy,
            apy: selectedStrategy === 'agentic' ? 12.5 : 4.2,
            yieldEarned: 0,
            debt: 0,
            flashMints: 0,
            agentActions: 0,
            logs: [
                { id: '1', message: `SAFE #${safeId} creado on-chain. Depósito de ${depositDisplay} WBTC confirmado.`, timestamp: new Date(), type: 'info' as const }
            ],
            createdAt: new Date()
        });
        setActiveVaultId(newVaultId);
        setStep('vault_view');
    };

    const handleVaultAction = async (action: 'deposit' | 'withdraw' | 'borrow' | 'repay') => {
        if (!address || !activeVaultId || !actionAmount || isPending) return;
        const vault = vaults.find(v => v.id === activeVaultId);
        if (!vault?.safeId) {
            setActionTxStatus('Error: No on-chain SAFE ID found for this vault');
            return;
        }

        try {
            setActionTxStatus(`Processing ${action}...`);
            const sid = vault.safeId.toString();
            let calls: { contractAddress: string; entrypoint: string; calldata: string[] }[] = [];

            if (action === 'deposit') {
                const parsed = parseBtcAmount(actionAmount);
                if (parsed <= 0n) return;
                calls = [
                    {
                        contractAddress: config.wbtcAddress,
                        entrypoint: 'approve',
                        calldata: [config.collateralJoinAddress, `0x${parsed.toString(16)}`, '0x0'],
                    },
                    {
                        contractAddress: config.safeManagerAddress,
                        entrypoint: 'deposit',
                        calldata: [sid, `0x${parsed.toString(16)}`, '0x0'],
                    },
                ];
            } else if (action === 'withdraw') {
                const btcParsed = parseBtcAmount(actionAmount);
                const wadAmount = btcToWad(btcParsed);
                if (wadAmount <= 0n) return;
                calls = [
                    {
                        contractAddress: config.safeManagerAddress,
                        entrypoint: 'withdraw',
                        calldata: [sid, `0x${wadAmount.toString(16)}`, '0x0'],
                    },
                ];
            } else if (action === 'borrow') {
                const parsed = parseGritAmount(actionAmount);
                if (parsed <= 0n) return;
                calls = [
                    {
                        contractAddress: config.safeManagerAddress,
                        entrypoint: 'borrow',
                        calldata: [sid, `0x${parsed.toString(16)}`, '0x0'],
                    },
                ];
            } else if (action === 'repay') {
                const parsed = parseGritAmount(actionAmount);
                if (parsed <= 0n) return;
                calls = [
                    {
                        contractAddress: config.safeEngineAddress,
                        entrypoint: 'approve',
                        calldata: [config.safeManagerAddress, `0x${parsed.toString(16)}`, '0x0'],
                    },
                    {
                        contractAddress: config.safeManagerAddress,
                        entrypoint: 'repay',
                        calldata: [sid, `0x${parsed.toString(16)}`, '0x0'],
                    },
                ];
            }

            await sendAsync(calls);
            setActionTxStatus(`${action} transaction sent!`);
            setActionAmount('');
            refetchBalance();
        } catch (err) {
            console.error(`${action} failed:`, err);
            setActionTxStatus(`Error: ${(err as Error).message}`);
        }
    };

    const activeVault = vaults.find(v => v.id === activeVaultId);
    const wbtcBalanceDisplay = formatBtcAmount(wbtcBalance);
    const parsedDeposit = parseBtcAmount(depositAmount || '0');
    const depositValid = parsedDeposit > 0n && parsedDeposit <= wbtcBalance;

    return (
        <div className="w-full max-w-6xl mx-auto py-8 px-6">
            {/* Step Indicator */}
            {step !== 'main_dashboard' && step !== 'vault_view' && (
                <div className="flex flex-col items-center mb-12">
                    <div className="flex items-center gap-4">
                        {flowSteps.map((s, idx) => {
                            const isPast = flowSteps.findIndex(fs => fs.id === s.id) < currentStepIdx;
                            const isCurrent = s.id === step;
                            return (
                                <React.Fragment key={s.id}>
                                    <div className="flex flex-col items-center gap-3 relative">
                                        <motion.div
                                            initial={false}
                                            animate={{
                                                backgroundColor: isPast || isCurrent ? 'var(--grinta-accent)' : 'rgba(255,255,255,0.05)',
                                                scale: isCurrent ? 1.1 : 1
                                            }}
                                            className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg transition-all shadow-lg ${isPast || isCurrent ? 'text-black shadow-grinta-accent/20' : 'text-grinta-text-secondary border border-white/10'}`}
                                        >
                                            {isPast ? <CheckCircle2 size={24} /> : idx + 1}
                                        </motion.div>
                                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isCurrent ? 'text-grinta-accent' : 'text-grinta-text-secondary opacity-40'}`}>
                                            {s.label}
                                        </span>
                                        {isCurrent && (
                                            <motion.div
                                                layoutId="activeStep"
                                                className="absolute -bottom-2 w-1 h-1 bg-grinta-accent rounded-full"
                                            />
                                        )}
                                    </div>
                                    {idx < flowSteps.length - 1 && (
                                        <div className="relative w-20 h-[2px] mb-8 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: "0%" }}
                                                animate={{ width: isPast ? "100%" : "0%" }}
                                                className="absolute top-0 left-0 h-full bg-grinta-accent"
                                            />
                                        </div>
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
                        className="max-w-md mx-auto"
                    >
                        <div className="bg-white/5 border border-white/10 rounded-[40px] p-10 backdrop-blur-xl text-center">
                            {isConnected ? (
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="py-10"
                                >
                                    <div className="w-20 h-20 bg-grinta-accent/20 rounded-full flex items-center justify-center mx-auto mb-6 text-grinta-accent border-4 border-grinta-accent/50">
                                        <CheckCircle2 size={48} />
                                    </div>
                                    <h2 className="text-3xl font-black text-white mb-2 font-syncopate uppercase tracking-tight">Acceso Concedido</h2>
                                    <p className="text-grinta-accent font-mono text-sm">
                                        {address.slice(0, 6)}...{address.slice(-6)}
                                    </p>
                                    <div className="mt-8 flex justify-center gap-1">
                                        <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 rounded-full bg-grinta-accent" />
                                        <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-grinta-accent" />
                                        <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-grinta-accent" />
                                    </div>
                                </motion.div>
                            ) : (
                                <>
                                    <div className="inline-flex p-4 rounded-3xl bg-grinta-accent/10 mb-8">
                                        <Wallet size={48} className="text-grinta-accent" />
                                    </div>
                                    <h2 className="text-3xl font-extrabold text-white mb-4 font-syncopate uppercase tracking-tight">Starknet Login</h2>
                                    <p className="text-grinta-text-secondary text-sm mb-10 leading-relaxed">
                                        Detectaremos automáticamente tu billetera del navegador para iniciar el protocolo Grinta.
                                    </p>

                                    <button
                                        onClick={() => {
                                            const available = connectors.find(c => {
                                                if (typeof c.available === 'function') return c.available();
                                                return !!c.available;
                                            });
                                            if (available) {
                                                connect({ connector: available });
                                            } else if (connectors.length > 0) {
                                                connect({ connector: connectors[0] });
                                            }
                                        }}
                                        className="w-full py-6 rounded-3xl bg-grinta-accent text-black font-black text-lg hover:scale-[1.03] active:scale-[0.98] transition-all shadow-xl shadow-grinta-accent/20 uppercase tracking-widest flex items-center justify-center gap-3"
                                    >
                                        <MousePointerClick size={24} />
                                        <span>Conectar Billetera</span>
                                    </button>

                                    <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-center gap-6 opacity-30 grayscale hover:grayscale-0 transition-all">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-grinta-text-secondary">Soportado:</span>
                                        <div className="flex gap-4">
                                            <img src="https://argent.xyz/favicon.ico" className="w-4 h-4" alt="Argent" />
                                            <img src="https://braavos.app/favicon.ico" className="w-4 h-4" alt="Braavos" />
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}

                {step === 'fund' && (
                    <motion.div
                        key="fund"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="max-w-xl mx-auto"
                    >
                        <div className="bg-white/5 border border-white/10 rounded-[40px] p-10 backdrop-blur-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <Bitcoin size={120} className="text-[#F7931A]" />
                            </div>

                            <div className="mb-10 relative">
                                <h2 className="text-3xl font-extrabold text-white mb-2 font-syncopate uppercase tracking-tight">Fondear Billetera</h2>
                                <p className="text-grinta-text-secondary">Necesitas WBTC de prueba en Sepolia para depositar en tu vault.</p>
                            </div>

                            <div className="space-y-6 relative">
                                {/* Current balance display */}
                                <div className="p-6 rounded-3xl bg-black/40 border border-white/10">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-[10px] font-bold text-grinta-text-secondary uppercase tracking-widest mb-2">Tu Balance Actual</div>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-4xl font-black text-white">{wbtcBalanceDisplay}</span>
                                                <span className="text-sm font-bold text-grinta-text-secondary">WBTC</span>
                                            </div>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-[#F7931A]/10 text-[#F7931A]">
                                            <Bitcoin size={32} />
                                        </div>
                                    </div>
                                </div>

                                {/* Mint button */}
                                <button
                                    onClick={async () => {
                                        if (!address || isPending) return;
                                        setIsProcessing(true);
                                        setTxStatus(null);
                                        try {
                                            const amt = 100_000_000n;
                                            await sendAsync([{
                                                contractAddress: config.wbtcAddress,
                                                entrypoint: 'mint',
                                                calldata: [address, `0x${amt.toString(16)}`, '0x0']
                                            }]);
                                            setTxStatus('Mint exitoso! +1 WBTC');
                                            setTimeout(() => refetchBalance(), 2000);
                                        } catch (e) {
                                            setTxStatus(`Error: ${(e as Error).message}`);
                                        } finally {
                                            setIsProcessing(false);
                                        }
                                    }}
                                    disabled={isProcessing || isPending}
                                    className="w-full py-6 rounded-3xl bg-[#F7931A] text-black font-black text-lg uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-[#F7931A]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                >
                                    {isProcessing || isPending ? (
                                        <><Loader2 size={20} className="animate-spin" /> Procesando...</>
                                    ) : (
                                        <><Bitcoin size={20} /> Mintear 1 WBTC (Sepolia Faucet)</>
                                    )}
                                </button>

                                {txStatus && (
                                    <div className={`p-4 rounded-xl border text-xs font-bold tracking-wide text-center ${txStatus.includes('Error') ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-grinta-accent/10 border-grinta-accent/20 text-grinta-accent'}`}>
                                        {txStatus}
                                    </div>
                                )}

                                <div className="p-5 rounded-3xl bg-grinta-accent/5 border border-grinta-accent/10 flex items-start gap-4">
                                    <div className="p-2 rounded-xl bg-grinta-accent/10 text-grinta-accent">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-xs mb-1 uppercase tracking-wider">Red de Prueba</h4>
                                        <p className="text-grinta-text-secondary text-[11px] leading-relaxed">
                                            Estos WBTC son tokens de prueba en Sepolia sin valor real. Puedes mintear cuantos necesites.
                                        </p>
                                    </div>
                                </div>

                                {/* Continue to deposit */}
                                <button
                                    onClick={() => { setTxStatus(null); setStep('deposit'); refetchBalance(); }}
                                    disabled={wbtcBalance === 0n}
                                    className={`w-full py-5 rounded-3xl flex items-center justify-center gap-3 font-black text-sm transition-all uppercase tracking-widest ${wbtcBalance > 0n
                                        ? 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                                        : 'bg-white/5 text-white/20 cursor-not-allowed'
                                        }`}
                                >
                                    Continuar al Depósito <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {step === 'deposit' && (
                    <motion.div
                        key="deposit"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="max-w-2xl mx-auto"
                    >
                        <div className="bg-white/5 border border-white/10 rounded-[40px] p-10 backdrop-blur-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <Bitcoin size={120} className="text-grinta-accent" />
                            </div>

                            <div className="mb-10 relative">
                                <h2 className="text-3xl font-extrabold text-white mb-2 font-syncopate uppercase tracking-tight">Cargar Colateral</h2>
                                <p className="text-grinta-text-secondary">Ingresa la cantidad de WBTC que deseas depositar en tu nuevo vault.</p>
                            </div>

                            <div className="space-y-8 relative">
                                <div>
                                    <div className="flex justify-between mb-3 px-2">
                                        <label className="text-xs font-bold text-grinta-text-secondary uppercase tracking-widest">Monto a Depositar</label>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] text-grinta-text-secondary font-bold uppercase tracking-widest">Disponible:</span>
                                            <span className="text-xs font-bold text-white tracking-widest">{wbtcBalanceDisplay} WBTC</span>
                                        </div>
                                    </div>
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            inputMode="decimal"
                                            value={depositAmount}
                                            onChange={(e) => {
                                                if (/^\d*\.?\d*$/.test(e.target.value)) setDepositAmount(e.target.value);
                                            }}
                                            className="w-full bg-black/40 border-2 border-white/5 rounded-3xl p-8 text-4xl font-black text-white placeholder:text-white/10 outline-none hover:border-white/10 focus:border-grinta-accent/30 transition-all pr-32"
                                            placeholder="0.00"
                                        />
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                            <button
                                                onClick={() => setDepositAmount(wbtcBalanceDisplay)}
                                                className="px-3 py-1.5 rounded-lg bg-grinta-accent/10 border border-grinta-accent/20 text-[10px] font-bold text-grinta-accent hover:bg-grinta-accent/20 transition-all uppercase tracking-widest"
                                            >
                                                Max
                                            </button>
                                            <span className="text-xl font-black text-white opacity-20 ml-2">WBTC</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 rounded-3xl bg-grinta-accent/5 border border-grinta-accent/10 flex items-start gap-4">
                                    <div className="p-3 rounded-2xl bg-grinta-accent/10 text-grinta-accent">
                                        <ShieldCheck size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-sm mb-1 uppercase tracking-wider">Seguridad Multinivel</h4>
                                        <p className="text-grinta-text-secondary text-[11px] leading-relaxed">
                                            Tus fondos se depositan en un contrato inteligente auditado en Starknet. Mantienes el control total de tus activos en todo momento.
                                        </p>
                                    </div>
                                </div>


                                {txStatus && (
                                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold tracking-wide">
                                        {txStatus}
                                    </div>
                                )}


                                <button
                                    disabled={!depositValid || isProcessing || isPending}
                                    onClick={handleDeposit}
                                    className={`w-full py-6 rounded-3xl flex items-center justify-center gap-3 font-black text-lg transition-all shadow-lg uppercase tracking-widest ${depositValid && !isProcessing && !isPending
                                        ? 'bg-grinta-accent text-black hover:scale-[1.02] active:scale-[0.98] shadow-grinta-accent/20'
                                        : 'bg-white/5 text-white/20 cursor-not-allowed'
                                        }`}
                                >
                                    {isProcessing || isPending ? (
                                        <>
                                            <Loader2 className="animate-spin" size={24} />
                                            <span>Procesando Multicall...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Download size={24} />
                                            <span>Abrir Safe y Depositar</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {step === 'create_vault' && (
                    <motion.div
                        key="strategy"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="max-w-4xl mx-auto"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-black text-white mb-3 font-syncopate uppercase tracking-tight">Elige tu Estrategia</h2>
                            <p className="text-grinta-text-secondary max-w-lg mx-auto">Selecciona cómo deseas que Grinta Protocol gestione tus activos para maximizar el yield.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                {
                                    id: 'agentic',
                                    name: 'Yield Grinta',
                                    type: 'agentic',
                                    icon: Bot,
                                    desc: 'Estrategia agéntica totalmente automatizada. El protocolo ejecuta arbitrajes y flash-mints por ti.',
                                    apy: '12.5%',
                                    accent: 'text-grinta-accent',
                                    bg: 'bg-grinta-accent/5',
                                    border: 'border-grinta-accent/20'
                                },
                                {
                                    id: 'manual',
                                    name: 'Staking Pasivo',
                                    type: 'manual',
                                    icon: User,
                                    desc: 'Control manual total. Tú decides cuándo depositar, retirar y bridgear activos entre capas.',
                                    apy: '4.2%',
                                    accent: 'text-orange-500',
                                    bg: 'bg-orange-500/5',
                                    border: 'border-orange-500/20'
                                }
                            ].map((strat) => (
                                <button
                                    key={strat.id}
                                    onClick={() => setSelectedStrategy(strat.type as any)}
                                    className={`group relative text-left p-8 rounded-[40px] border-2 transition-all duration-500 hover:scale-[1.02] ${selectedStrategy === strat.type
                                        ? `${strat.bg} ${strat.border} ring-4 ring-${strat.type === 'agentic' ? 'grinta-accent' : 'orange-500'}/10`
                                        : 'bg-white/5 border-white/5 hover:border-white/10'
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-8">
                                        <div className={`p-4 rounded-3xl ${strat.bg} border ${strat.border}`}>
                                            <strat.icon size={32} className={strat.accent} />
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[10px] font-bold text-grinta-text-secondary uppercase tracking-widest mb-1">Yield Estimado</div>
                                            <div className={`text-2xl font-black ${strat.accent} font-syncopate`}>{strat.apy}</div>
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-black text-white mb-3 font-syncopate uppercase tracking-wider">{strat.name}</h3>
                                    <p className="text-grinta-text-secondary text-sm leading-relaxed mb-8">{strat.desc}</p>

                                    <div className="flex items-center justify-between">
                                        <span className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${selectedStrategy === strat.type ? strat.accent : 'text-grinta-text-secondary'}`}>
                                            {selectedStrategy === strat.type ? (
                                                <><CheckCircle2 size={16} /> Seleccionado</>
                                            ) : (
                                                'Seleccionar Plan'
                                            )}
                                        </span>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${selectedStrategy === strat.type ? `${strat.bg} ${strat.accent}` : 'bg-black/40 text-white/20'}`}>
                                            <ArrowRight size={16} />
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="mt-12 flex justify-center">
                            <button
                                onClick={handleCreateVault}
                                className="px-16 py-6 rounded-3xl bg-grinta-accent text-black font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-xl shadow-grinta-accent/20 uppercase tracking-widest flex items-center gap-3"
                            >
                                <PlusCircle size={24} />
                                Activar Vault
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === 'vault_view' && activeVault && (
                    <motion.div
                        key="live"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                    >
                        {/* Header View */}
                        <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-[40px] p-8 backdrop-blur-xl">
                            <div className="flex items-center gap-6">
                                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center border ${activeVault.type === 'agentic' ? 'bg-grinta-accent/10 border-grinta-accent/20 text-grinta-accent' : 'bg-orange-500/10 border-orange-500/20 text-orange-500'}`}>
                                    {activeVault.type === 'agentic' ? <Bot size={32} /> : <User size={32} />}
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h2 className="text-2xl font-black text-white font-syncopate uppercase tracking-wider">Vault {activeVault.id}</h2>
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${activeVault.type === 'agentic' ? 'bg-grinta-accent/10 border-grinta-accent/30 text-grinta-accent' : 'bg-orange-500/10 border-orange-500/30 text-orange-500'}`}>
                                            LIVE - Starknet
                                        </span>
                                    </div>
                                    <p className="text-grinta-text-secondary text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                        <Activity size={12} className="text-green-500 animate-pulse" /> Estrategia: {activeVault.strategy}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setStep('main_dashboard')}
                                    className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-xs hover:bg-white/10 transition-all uppercase tracking-widest flex items-center gap-2"
                                >
                                    <LayoutDashboard size={16} /> Mis Vaults
                                </button>
                                <button className="p-3 rounded-2xl bg-white/5 border border-white/10 text-grinta-text-secondary hover:text-white transition-all">
                                    <Settings size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Main Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                            {/* Left Column: Stats */}
                            <div className="md:col-span-8 space-y-6">
                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { label: 'Valor Total Vault', val: (activeVault.amount + activeVault.yieldEarned).toFixed(4), unit: 'WBTC', sub: `≈ $${((activeVault.amount + activeVault.yieldEarned) * 70266).toLocaleString()}` },
                                        { label: 'Yield Acumulado', val: activeVault.yieldEarned.toFixed(6), unit: 'WBTC', sub: `APY: ${activeVault.apy}%`, up: true },
                                        { label: 'Deuda Generada', val: activeVault.debt.toFixed(2), unit: 'GRIT', sub: 'LTV: 0.00%' }
                                    ].map((stat, i) => (
                                        <div key={i} className="bg-white/5 border border-white/10 rounded-[32px] p-6 hover:border-white/20 transition-all relative group overflow-hidden">
                                            <div className="text-grinta-text-secondary text-[10px] font-black uppercase tracking-widest mb-3">{stat.label}</div>
                                            <div className="flex items-baseline gap-2 mb-1">
                                                <div className="text-2xl font-black text-white font-syncopate">{stat.val}</div>
                                                <div className="text-xs font-bold text-grinta-text-secondary">{stat.unit}</div>
                                            </div>
                                            <div className={`text-[10px] font-bold ${stat.up ? 'text-grinta-accent' : 'text-grinta-text-secondary'} flex items-center gap-1`}>
                                                {stat.up && <TrendingUp size={10} />} {stat.sub}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Actions Card - Separated for better layout balance */}
                                <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 hover:border-white/20 transition-all">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-2xl bg-black/40 border border-white/10 ${activeVault.type === 'agentic' ? 'text-grinta-accent' : 'text-orange-500'}`}>
                                                <Layers size={24} />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-black text-white font-syncopate uppercase tracking-widest">Acciones de Control L2</h3>
                                                <p className="text-[10px] text-grinta-text-secondary font-bold uppercase tracking-widest opacity-60">Gestión directa de colateral y deuda</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 px-4 py-2 bg-black/40 border border-white/10 rounded-xl">
                                            <span className="text-[9px] font-bold text-grinta-text-secondary uppercase">Monedero:</span>
                                            <span className="text-xs font-bold text-grinta-accent">{wbtcBalanceDisplay} BTC</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                                        {/* Amount Input */}
                                        <div className="md:col-span-12">
                                            <div className="relative group">
                                                <input
                                                    type="text"
                                                    inputMode="decimal"
                                                    value={actionAmount}
                                                    onChange={(e) => {
                                                        if (/^\d*\.?\d*$/.test(e.target.value)) setActionAmount(e.target.value);
                                                    }}
                                                    className="w-full bg-black/40 border border-white/10 rounded-3xl p-6 text-3xl font-bold text-white placeholder:text-white/10 outline-none hover:border-white/20 focus:border-grinta-accent/30 transition-all pr-24"
                                                    placeholder="0.00"
                                                />
                                                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-sm font-black text-white/20 uppercase tracking-widest">
                                                    WBTC / GRIT
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons Grid */}
                                        <div className="md:col-span-12 grid grid-cols-2 lg:grid-cols-4 gap-4">
                                            <button
                                                onClick={() => handleVaultAction('deposit')}
                                                disabled={isPending}
                                                className="flex flex-col items-center justify-center gap-3 p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-grinta-accent/50 hover:bg-grinta-accent/5 transition-all group"
                                            >
                                                <Download size={20} className="text-grinta-accent group-hover:scale-110 transition-transform" />
                                                <span className="text-[9px] font-black uppercase tracking-widest text-white">Deposit WBTC</span>
                                            </button>
                                            <button
                                                onClick={() => handleVaultAction('withdraw')}
                                                disabled={activeVault.amount === 0 || isPending}
                                                className={`flex flex-col items-center justify-center gap-3 p-6 rounded-3xl border transition-all group ${activeVault.amount === 0 ? 'bg-white/2 opacity-20 cursor-not-allowed' : 'bg-white/5 border-white/5 hover:border-red-500/50 hover:bg-red-500/5'}`}
                                            >
                                                <RefreshCcw size={20} className="text-red-500 group-hover:rotate-180 transition-transform duration-500" />
                                                <span className="text-[9px] font-black uppercase tracking-widest text-white">Withdraw WBTC</span>
                                            </button>
                                            <button
                                                onClick={() => handleVaultAction('borrow')}
                                                disabled={activeVault.amount === 0 || isPending}
                                                className={`flex flex-col items-center justify-center gap-3 p-6 rounded-3xl border transition-all group ${activeVault.amount === 0 ? 'bg-white/2 opacity-20 cursor-not-allowed' : 'bg-white/5 border-white/5 hover:border-orange-500/50 hover:bg-orange-500/5'}`}
                                            >
                                                <Layers size={20} className="text-orange-500 group-hover:translate-x-1 transition-transform" />
                                                <span className="text-[9px] font-black uppercase tracking-widest text-white">Borrow GRIT</span>
                                            </button>
                                            <button
                                                onClick={() => handleVaultAction('repay')}
                                                disabled={activeVault.debt === 0 || isPending}
                                                className={`flex flex-col items-center justify-center gap-3 p-6 rounded-3xl border transition-all group ${activeVault.debt === 0 ? 'bg-white/2 opacity-20 cursor-not-allowed' : 'bg-white/5 border-white/5 hover:border-blue-500/50 hover:bg-blue-500/5'}`}
                                            >
                                                <Zap size={20} className="text-blue-500 group-hover:scale-110 transition-transform" />
                                                <span className="text-[9px] font-black uppercase tracking-widest text-white">Repay GRIT</span>
                                            </button>
                                        </div>
                                    </div>

                                    {actionTxStatus && (
                                        <div className="mt-6 p-4 rounded-2xl bg-grinta-accent/5 border border-grinta-accent/10 text-[10px] font-bold text-grinta-accent uppercase tracking-[0.2em] text-center animate-pulse">
                                            {actionTxStatus}
                                        </div>
                                    )}
                                </div>

                                <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 min-h-[400px]">
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="text-sm font-black text-white font-syncopate uppercase tracking-widest flex items-center gap-2">
                                            <Activity size={18} className="text-grinta-accent" /> Log Operacional del Vault
                                        </h3>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-grinta-accent animate-pulse"></div>
                                                <span className="text-[10px] font-bold text-grinta-text-secondary uppercase tracking-widest">Conexión Segura</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        {activeVault.logs.map((log) => (
                                            <div key={log.id} className="flex items-start gap-4 p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-white/10 transition-all group">
                                                <div className="text-[10px] font-mono text-white/20 pt-1">{log.timestamp.toLocaleTimeString()}</div>
                                                <div className="flex-1">
                                                    <div className={`text-xs font-bold leading-relaxed ${log.type === 'agent' ? 'text-grinta-accent' : log.type === 'success' ? 'text-green-500' : 'text-grinta-text-secondary'}`}>
                                                        {log.message}
                                                    </div>
                                                </div>
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <ShieldCheck size={14} className="text-grinta-accent" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Dynamic Activity Area */}
                            <div className="md:col-span-4 space-y-6">
                                {activeVault.type === 'agentic' ? (
                                    <div className="bg-grinta-accent/5 border border-grinta-accent/10 rounded-[32px] p-8 relative overflow-hidden h-full">
                                        <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                                            <Bot size={180} className="text-grinta-accent" />
                                        </div>

                                        <div className="relative">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-grinta-accent/10 border border-grinta-accent/20 text-grinta-accent text-[9px] font-black uppercase tracking-widest mb-6">
                                                Agente Autónomo Activo
                                            </div>

                                            <h3 className="text-2xl font-black text-white mb-6 font-syncopate uppercase leading-tight">Gestión Agéntica Grinta</h3>

                                            <div className="space-y-6">
                                                {[
                                                    { label: 'Arbitrajes Ejecutados', val: activeVault.agentActions, icon: RefreshCcw },
                                                    { label: 'Flash-Mints Realizados', val: activeVault.flashMints, icon: Zap },
                                                    { label: 'Uptime de Estrategia', val: '99.98%', icon: Clock },
                                                ].map((metric, idx) => (
                                                    <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 rounded-xl bg-grinta-accent/10 text-grinta-accent">
                                                                <metric.icon size={16} />
                                                            </div>
                                                            <span className="text-[10px] font-bold text-grinta-text-secondary uppercase tracking-widest">{metric.label}</span>
                                                        </div>
                                                        <span className="text-sm font-black text-white font-syncopate">{metric.val}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="mt-10 p-6 rounded-3xl bg-black/60 border border-white/10 text-center">
                                                <div className="text-[10px] font-bold text-grinta-text-secondary uppercase tracking-widest mb-4">Estado del Nodo Grinta</div>
                                                <div className="flex justify-center gap-1 mb-4">
                                                    {Array(12).fill(0).map((_, i) => (
                                                        <motion.div
                                                            key={i}
                                                            animate={{ height: [8, 16, 12, 20, 10] }}
                                                            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                                                            className="w-1.5 h-4 bg-grinta-accent/40 rounded-full"
                                                        />
                                                    ))}
                                                </div>
                                                <p className="text-[10px] text-grinta-text-secondary font-medium leading-relaxed italic">
                                                    "Escaneando liquidez en Ekubo y Nostra para oportunidades de arbitraje..."
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-orange-500/5 border border-orange-500/10 rounded-[32px] p-8 relative overflow-hidden h-full">
                                        <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                                            <User size={180} className="text-orange-500" />
                                        </div>

                                        <div className="relative">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[9px] font-black uppercase tracking-widest mb-6">
                                                Gestión Manual de Usuario
                                            </div>

                                            <h3 className="text-2xl font-black text-white mb-6 font-syncopate uppercase leading-tight">Staking Pasivo Grinta</h3>

                                            <div className="space-y-4 mb-8">
                                                <p className="text-xs text-grinta-text-secondary leading-relaxed">
                                                    Esta modalidad te permite gestionar manualmente tu colateral. No se ejecutan acciones automáticas.
                                                </p>
                                                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                                                    <div className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">Ventajas</div>
                                                    <ul className="text-[10px] text-grinta-text-secondary space-y-1">
                                                        <li className="flex items-center gap-2">• Cero comisiones de gestión</li>
                                                        <li className="flex items-center gap-2">• Control total de retiros L1</li>
                                                        <li className="flex items-center gap-2">• Sin riesgo de flash-mint</li>
                                                    </ul>
                                                </div>
                                            </div>

                                            <div className="p-6 rounded-3xl bg-black/60 border border-white/10">
                                                <div className="text-[10px] font-bold text-grinta-text-secondary uppercase tracking-widest mb-4">Sugerencia de Protocolo</div>
                                                <div className="flex items-center gap-4 mb-4">
                                                    <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500 text-xs font-bold font-syncopate">12.5%</div>
                                                    <p className="text-[10px] text-grinta-text-secondary font-medium leading-tight">
                                                        Cambia a Yield Agéntico para un boost de +8.3% APY instantáneo.
                                                    </p>
                                                </div>
                                                <button className="w-full py-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] font-black uppercase tracking-widest hover:bg-orange-500/20 transition-all">
                                                    Mejorar Vault
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
