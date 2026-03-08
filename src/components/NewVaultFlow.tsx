import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Wallet, ArrowRight, Download, PlusCircle, CheckCircle2, TrendingUp, Zap, Activity, Loader2, Bitcoin, Clock, ShieldCheck, Bot, LayoutDashboard, User, Settings, MousePointerClick, RefreshCcw, Layers } from 'lucide-react';
import { useAccount, useConnect, useSendTransaction } from '@starknet-react/core';
import { useVaults, Step } from '../context/VaultContext';
import { config } from '../config/contracts';
import { getSafeEngine, parseBtcAmount, parseGritAmount, btcToWad, formatBtcAmount, formatWad } from '../lib/starknet';
import { useWbtcBalance, useRates } from '../hooks/useGrinta';
import WalletConnect from './WalletConnect';

export default function NewVaultFlow() {
    const { step, setStep, vaults, addVault, setActiveVaultId, activeVaultId, depositToVault, withdrawFromVault, borrowGrit, repayGrit } = useVaults();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [isProcessing, setIsProcessing] = useState(false);
    const [depositAmount, setDepositAmount] = useState('');
    const [selectedStrategy, setSelectedStrategy] = useState<'agentic' | 'manual'>('agentic');
    const [txStatus, setTxStatus] = useState<string | null>(null);
    const [connectingWallet, setConnectingWallet] = useState(false);
    const [createdSafeId, setCreatedSafeId] = useState<number | null>(null);
    const [actionAmount, setActionAmount] = useState('');
    const [actionTxStatus, setActionTxStatus] = useState<string | null>(null);
    const [activeActionMode, setActiveActionMode] = useState<'deposit' | 'withdraw' | 'borrow' | 'repay'>('deposit');

    const { address, isConnected } = useAccount();
    const { connect, connectors } = useConnect();
    const { sendAsync, isPending } = useSendTransaction({});
    const { balance: wbtcBalance, isLoading: balanceLoading, refetch: refetchBalance } = useWbtcBalance();
    const rates = useRates();
    const currentVault = useMemo(() => vaults.find(v => v.id === activeVaultId), [vaults, activeVaultId]);
    const activeVault = currentVault;

    // Cálculo dinámico de Max Borrow según fórmula de protocolo (Memoizado para performance)
    const { maxGritBorrow, maxGritBorrowStr } = useMemo(() => {
        if (!currentVault || rates.loading) return { maxGritBorrow: 0n, maxGritBorrowStr: "0.00" };
        try {
            const btcRaw = parseBtcAmount(currentVault.amount.toFixed(8));
            const priceBtc = rates.collateralPriceRaw;
            const liqRatio = rates.liquidationRatioRaw;
            const redPrice = rates.redemptionPriceRaw;

            if (liqRatio > 0n && redPrice > 0n) {
                const collatValueWad = (btcRaw * priceBtc) / (10n ** 8n);
                const maxDebtWad = (collatValueWad * (10n ** 18n)) / liqRatio;
                let max = (maxDebtWad * (10n ** 27n)) / redPrice;
                max = (max * 99n) / 100n; // Safety margin
                return { maxGritBorrow: max, maxGritBorrowStr: formatWad(max) };
            }
        } catch (e) {
            console.error("Error calculating max borrow:", e);
        }
        return { maxGritBorrow: 0n, maxGritBorrowStr: "0.00" };
    }, [currentVault, rates.loading, rates.collateralPriceRaw, rates.liquidationRatioRaw, rates.redemptionPriceRaw]);

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
                if (window.confirm(t('new_vault.steps.confirm_exit'))) {
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
        { id: 'connect', label: t('new_vault.steps.connection') },
        { id: 'fund', label: t('new_vault.steps.funding') },
        { id: 'deposit', label: t('new_vault.steps.deposit') },
        { id: 'create_vault', label: t('new_vault.steps.strategy') },
    ];

    const currentStepIdx = flowSteps.findIndex(s => s.id === step);

    // Automatic advance if already connected or just connected
    useEffect(() => {
        if (step === 'connect' && isConnected && address) {
            const timer = setTimeout(() => {
                setStep('fund');
            }, 1200);
            return () => clearTimeout(timer);
        }

        // System reset upon disconnect
        if (!isConnected && step !== 'connect' && step !== 'main_dashboard') {
            setStep('main_dashboard');
        }
    }, [step, isConnected, address, setStep]);

    // Refetch WBTC balance when arriving at fund or deposit step
    useEffect(() => {
        if ((step === 'fund' || step === 'deposit') && isConnected) {
            refetchBalance();
        }
    }, [step, isConnected, refetchBalance]);

    // Redirección automática si no hay fondos en el paso de Deposit
    useEffect(() => {
        if (step === 'deposit' && !balanceLoading && wbtcBalance === 0n) {
            if (isConnected) {
                setStep('fund');
            } else {
                setStep('connect');
            }
        }
    }, [step, wbtcBalance, balanceLoading, isConnected, setStep]);

    const handleConnectorClick = (connector: any) => {
        setConnectingWallet(true);
        connect({ connector });
    };

    // Memoized Handlers for Speed
    const handleDeposit = useCallback(async () => {
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
    }, [address, isPending, depositAmount, wbtcBalance, sendAsync]);

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
                { id: '1', message: `SAFE #${safeId} created on-chain. Deposit of ${depositDisplay} WBTC confirmed.`, timestamp: new Date(), type: 'info' as const }
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

            const tx = await sendAsync(calls);
            setActionTxStatus(`✓ ${action === 'deposit' ? 'Deposit' : action === 'withdraw' ? 'Withdrawal' : action === 'borrow' ? 'Loan' : 'Payment'} sent successfully`);

            // Real-time local state update
            const numVal = parseFloat(actionAmount);
            if (activeVaultId) {
                if (action === 'deposit') depositToVault(activeVaultId, numVal);
                else if (action === 'withdraw') withdrawFromVault(activeVaultId, numVal);
                else if (action === 'borrow') borrowGrit(activeVaultId, numVal);
                else if (action === 'repay') repayGrit(activeVaultId, numVal);
            }

            setActionAmount('');
            // Refresh balance from contract after a delay
            setTimeout(() => refetchBalance(), 4000);
        } catch (err) {
            console.error(`${action} failed:`, err);
            setActionTxStatus(`Error: ${(err as Error).message}`);
        }
    };

    const wbtcBalanceDisplay = formatBtcAmount(wbtcBalance);
    const parsedDeposit = parseBtcAmount(depositAmount || '0');
    const depositValid = parsedDeposit > 0n && parsedDeposit <= wbtcBalance;

    return (
        <div className="w-full max-w-6xl mx-auto py-8 px-6">
            {/* Step Indicator - Premium Redesign */}
            {step !== 'main_dashboard' && step !== 'vault_view' && (
                <div className="flex flex-col items-center mb-16 mt-8">
                    <div className="flex items-center">
                        {flowSteps.map((s, idx) => {
                            const isCurrent = s.id === step;
                            const isPast = flowSteps.findIndex(fs => fs.id === s.id) < currentStepIdx;

                            return (
                                <React.Fragment key={s.id}>
                                    <div className="flex flex-col items-center gap-4 relative">
                                        <motion.div
                                            initial={false}
                                            animate={{
                                                backgroundColor: isCurrent ? 'rgba(74,222,128,0.05)' : 'rgba(255,255,255,0.05)',
                                                borderColor: isCurrent ? 'rgba(74,222,128,0.5)' : 'rgba(255,255,255,0.05)',
                                                boxShadow: isCurrent ? '0 0 20px rgba(74,222,128,0.15)' : 'none',
                                                color: isCurrent || isPast ? '#fff' : 'rgba(255,255,255,0.2)'
                                            }}
                                            className={`w-16 h-16 rounded-[22px] flex items-center justify-center font-black text-2xl transition-all border`}
                                        >
                                            {idx + 1}
                                        </motion.div>

                                        <div className="flex flex-col items-center gap-2 min-w-[120px]">
                                            <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${isCurrent ? 'text-grinta-accent' : 'text-grinta-text-secondary opacity-40'}`}>
                                                {s.label}
                                            </span>
                                            {isCurrent && (
                                                <motion.div
                                                    layoutId="activeStepDot"
                                                    className="w-1.5 h-1.5 bg-grinta-accent rounded-full shadow-[0_0_8px_rgba(74,222,128,0.8)]"
                                                />
                                            )}
                                        </div>
                                    </div>

                                    {idx < flowSteps.length - 1 && (
                                        <div className="mx-4 mb-10 w-24 flex items-center">
                                            <div className="h-[1px] w-full border-t border-dashed border-white/10 relative">
                                                <motion.div
                                                    initial={{ width: '0%' }}
                                                    animate={{ width: isPast ? '100%' : '0%' }}
                                                    className="absolute top-[-1px] left-0 h-[1px] bg-grinta-accent shadow-[0_0_10px_rgba(74,222,128,0.3)] transition-all duration-500"
                                                />
                                            </div>
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
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        className="max-w-xl mx-auto"
                    >
                        <div className="bg-white/5 border border-white/10 rounded-[40px] p-12 backdrop-blur-xl text-center relative overflow-hidden group">
                            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-grinta-accent/30 to-transparent"></div>

                            <div className="mb-10 relative">
                                <div className="w-24 h-24 bg-grinta-accent/10 rounded-[32px] mx-auto mb-8 flex items-center justify-center text-grinta-accent border border-grinta-accent/20 shadow-[0_0_30px_rgba(74,222,128,0.1)]">
                                    <Wallet size={40} />
                                </div>
                                <h2 className="text-4xl font-extrabold text-white mb-4 font-syncopate uppercase tracking-tight">{t('new_vault.connect.title')}</h2>
                                <p className="text-grinta-text-secondary text-sm max-w-sm mx-auto leading-relaxed">
                                    {t('new_vault.connect.desc')}
                                </p>
                            </div>

                            <WalletConnect variant="flow" />

                            <div className="mt-12 pt-8 border-t border-white/5 flex flex-col items-center gap-4 opacity-100 group-hover:opacity-100 transition-all duration-700 grayscale group-hover:grayscale-0">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">{t('new_vault.connect.supported')}</span>
                            </div>
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
                                <h2 className="text-3xl font-extrabold text-white mb-2 font-syncopate uppercase tracking-tight">{t('new_vault.fund.title')}</h2>
                                <p className="text-grinta-text-secondary">{t('new_vault.fund.desc')}</p>
                            </div>

                            <div className="space-y-6 relative">
                                {/* Current balance display */}
                                <div className="p-6 rounded-3xl bg-black/40 border border-white/10">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-[10px] font-bold text-grinta-text-secondary uppercase tracking-widest mb-2">{t('new_vault.fund.current_balance')}</div>
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
                                        <><Loader2 size={20} className="animate-spin" /> {t('new_vault.fund.minting')}</>
                                    ) : (
                                        <><Bitcoin size={20} /> {t('new_vault.fund.mint_btn')}</>
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
                                        <h4 className="text-white font-bold text-xs mb-1 uppercase tracking-wider">{t('new_vault.fund.testnet_notice_title')}</h4>
                                        <p className="text-grinta-text-secondary text-[11px] leading-relaxed">
                                            {t('new_vault.fund.testnet_notice_desc')}
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
                                    {t('new_vault.fund.continue_btn')} <ArrowRight size={18} />
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
                                <h2 className="text-3xl font-extrabold text-white mb-2 font-syncopate uppercase tracking-tight">{t('new_vault.deposit.title')}</h2>
                                <p className="text-grinta-text-secondary">{t('new_vault.deposit.desc')}</p>
                            </div>

                            <div className="space-y-8 relative">
                                <div>
                                    <div className="flex justify-between mb-3 px-2">
                                        <label className="text-xs font-bold text-grinta-text-secondary uppercase tracking-widest">{t('new_vault.deposit.amount_label')}</label>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] text-grinta-text-secondary font-bold uppercase tracking-widest">{t('new_vault.deposit.available')}:</span>
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
                                        <h4 className="text-white font-bold text-sm mb-1 uppercase tracking-wider">{t('new_vault.deposit.security_title')}</h4>
                                        <p className="text-grinta-text-secondary text-[11px] leading-relaxed">
                                            {t('new_vault.deposit.security_desc')}
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
                                            <span>{t('new_vault.deposit.processing')}</span>
                                        </>
                                    ) : (
                                        <>
                                            <Download size={24} />
                                            <span>{t('new_vault.deposit.btn')}</span>
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
                            <h2 className="text-4xl font-black text-white mb-3 font-syncopate uppercase tracking-tight">{t('new_vault.strategy.title')}</h2>
                            <p className="text-grinta-text-secondary max-w-lg mx-auto">{t('new_vault.strategy.desc')}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                {
                                    id: 'agentic',
                                    name: t('new_vault.strategy.agentic_name'),
                                    type: 'agentic',
                                    icon: Bot,
                                    desc: t('new_vault.strategy.agentic_desc'),
                                    apy: '12.5%',
                                    accent: 'text-grinta-accent',
                                    bg: 'bg-grinta-accent/5',
                                    border: 'border-grinta-accent/20'
                                },
                                {
                                    id: 'manual',
                                    name: t('new_vault.strategy.manual_name'),
                                    type: 'manual',
                                    icon: User,
                                    desc: t('new_vault.strategy.manual_desc'),
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
                                            <div className="text-[10px] font-bold text-grinta-text-secondary uppercase tracking-widest mb-1">{t('new_vault.strategy.estimated_yield')}</div>
                                            <div className={`text-2xl font-black ${strat.accent} font-syncopate`}>{strat.apy}</div>
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-black text-white mb-3 font-syncopate uppercase tracking-wider">{strat.name}</h3>
                                    <p className="text-grinta-text-secondary text-sm leading-relaxed mb-8">{strat.desc}</p>

                                    <div className="flex items-center justify-between">
                                        <span className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${selectedStrategy === strat.type ? strat.accent : 'text-grinta-text-secondary'}`}>
                                            {selectedStrategy === strat.type ? (
                                                <><CheckCircle2 size={16} /> {t('new_vault.strategy.selected')}</>
                                            ) : (
                                                t('new_vault.strategy.select_plan')
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
                                        <Activity size={12} className="text-green-500 animate-pulse" /> Strategy: {activeVault.strategy}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => {
                                        setStep('main_dashboard');
                                        navigate('/app/vaults');
                                    }}
                                    className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-xs hover:bg-white/10 transition-all uppercase tracking-widest flex items-center gap-2"
                                >
                                    <LayoutDashboard size={16} /> {t('new_vault.vault_view.my_vaults')}
                                </button>
                                <button className="p-3 rounded-2xl bg-white/5 border border-white/10 text-grinta-text-secondary hover:text-white transition-all">
                                    <Settings size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Main Layout Container */}
                        <div className="max-w-5xl mx-auto space-y-6">
                            {/* Stats Layer */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { label: t('new_vault.vault_view.total_value'), val: (activeVault.amount + activeVault.yieldEarned).toFixed(4), unit: 'WBTC', sub: `≈ $${((activeVault.amount + activeVault.yieldEarned) * 70266).toLocaleString()}` },
                                    { label: t('new_vault.vault_view.accumulated_yield'), val: activeVault.yieldEarned.toFixed(6), unit: 'WBTC', sub: `APY: ${activeVault.apy}%`, up: true },
                                    { label: t('new_vault.vault_view.max_debt'), val: parseFloat(maxGritBorrowStr).toFixed(2), unit: 'GRIT', sub: `LTV: ${((activeVault.debt / (parseFloat(maxGritBorrowStr) || 1)) * 100).toFixed(2)}%` }
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
                                            <h3 className="text-sm font-black text-white font-syncopate uppercase tracking-widest">{t('new_vault.vault_view.l2_actions')}</h3>
                                            <p className="text-[10px] text-grinta-text-secondary font-bold uppercase tracking-widest opacity-60">{t('new_vault.vault_view.l2_desc')}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2 bg-black/40 border border-white/10 rounded-xl">
                                        <span className="text-[9px] font-bold text-grinta-text-secondary uppercase">{t('new_vault.vault_view.wallet')}:</span>
                                        <span className="text-xs font-bold text-grinta-accent">{wbtcBalanceDisplay} BTC</span>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {/* Action Mode Selector */}
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                        {[
                                            { id: 'withdraw', label: t('new_vault.vault_view.withdraw'), icon: RefreshCcw, color: 'text-white', activeBg: 'bg-white/10' },
                                            { id: 'borrow', label: t('new_vault.vault_view.borrow'), icon: Layers, color: 'text-grinta-accent', activeBg: 'bg-grinta-accent/10' },
                                            { id: 'deposit', label: t('new_vault.vault_view.deposit'), icon: Download, color: 'text-grinta-text-secondary', activeBg: 'bg-white/10' },
                                            { id: 'repay', label: t('new_vault.vault_view.repay'), icon: Zap, color: 'text-white', activeBg: 'bg-blue-500/10' }
                                        ].map((mode) => (
                                            <button
                                                key={mode.id}
                                                onClick={() => {
                                                    setActiveActionMode(mode.id as any);
                                                    setActionAmount('');
                                                    setActionTxStatus(null);
                                                }}
                                                className={`flex flex-col items-center justify-center gap-3 p-6 rounded-3xl border transition-all group relative overflow-hidden ${activeActionMode === mode.id
                                                    ? `${mode.activeBg} border-grinta-accent shadow-[0_0_15px_rgba(0,255,65,0.05)]`
                                                    : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                                            >
                                                <mode.icon size={20} className={`${mode.color} ${activeActionMode === mode.id ? 'scale-110' : 'opacity-40'} transition-all`} />
                                                <span className={`text-[9px] font-black uppercase tracking-widest ${activeActionMode === mode.id ? 'text-white' : 'text-grinta-text-secondary'}`}>{mode.label}</span>
                                                {activeActionMode === mode.id && (
                                                    <motion.div layoutId="modeIndicator" className="absolute bottom-0 left-0 right-0 h-1 bg-grinta-accent" />
                                                )}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Input & Execute Action */}
                                    <div className="bg-black/40 border border-white/10 rounded-[40px] p-8 space-y-6">
                                        <div className="flex items-center justify-between px-2">
                                            <span className="text-[10px] font-black text-grinta-text-secondary uppercase tracking-[0.2em]">
                                                {activeActionMode === 'deposit' ? t('new_vault.vault_view.deposit') :
                                                    activeActionMode === 'withdraw' ? t('new_vault.vault_view.withdraw') :
                                                        activeActionMode === 'borrow' ? t('new_vault.vault_view.borrow') :
                                                            t('new_vault.vault_view.repay')} Amount
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[9px] font-bold text-grinta-text-secondary uppercase">
                                                    {activeActionMode === 'deposit' ? t('new_vault.deposit.available') :
                                                        activeActionMode === 'withdraw' ? 'Staked' :
                                                            activeActionMode === 'borrow' ? 'Max Borrow' :
                                                                'Debt'}:
                                                </span>
                                                <span className="text-[10px] font-black text-white">
                                                    {activeActionMode === 'deposit' ? `${wbtcBalanceDisplay} BTC` :
                                                        activeActionMode === 'withdraw' ? `${activeVault.amount.toFixed(4)} BTC` :
                                                            activeActionMode === 'borrow' ? `${parseFloat(maxGritBorrowStr).toFixed(2)} GRIT` :
                                                                `${(activeVault.debt || 0).toFixed(2)} GRIT`}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
                                            <div className="md:col-span-8 relative">
                                                <input
                                                    type="text"
                                                    inputMode="decimal"
                                                    value={actionAmount}
                                                    onChange={(e) => {
                                                        if (/^\d*\.?\d*$/.test(e.target.value)) setActionAmount(e.target.value);
                                                    }}
                                                    className="w-full bg-black/60 border border-white/5 rounded-2xl p-6 text-3xl font-bold text-white placeholder:text-white/5 outline-none focus:border-grinta-accent/20 transition-all pr-24"
                                                    placeholder="0.00"
                                                />
                                                <button
                                                    onClick={() => {
                                                        if (activeActionMode === 'deposit') setActionAmount(wbtcBalanceDisplay);
                                                        else if (activeActionMode === 'withdraw') setActionAmount(activeVault.amount.toString());
                                                        else if (activeActionMode === 'borrow') setActionAmount(maxGritBorrowStr);
                                                        else if (activeActionMode === 'repay') setActionAmount(activeVault.debt.toString());
                                                    }}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black text-grinta-text-secondary hover:text-white transition-all uppercase tracking-widest"
                                                >
                                                    Max
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => handleVaultAction(activeActionMode)}
                                                disabled={!actionAmount || parseFloat(actionAmount) <= 0 || isPending ||
                                                    (activeActionMode === 'deposit' && parseBtcAmount(actionAmount) > wbtcBalance) ||
                                                    (activeActionMode === 'withdraw' && parseFloat(actionAmount) > activeVault.amount) ||
                                                    (activeActionMode === 'borrow' && parseGritAmount(actionAmount) > maxGritBorrow) ||
                                                    (activeActionMode === 'repay' && parseFloat(actionAmount) > activeVault.debt)
                                                }
                                                className={`md:col-span-4 rounded-2xl flex items-center justify-center gap-3 font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl ${!actionAmount || parseFloat(actionAmount) <= 0 || isPending
                                                    ? 'bg-white/5 text-white/10 cursor-not-allowed'
                                                    : 'bg-grinta-accent text-black hover:scale-[1.02] shadow-grinta-accent/10'
                                                    }`}
                                            >
                                                {isPending ? <Loader2 className="animate-spin" size={20} /> : <Zap size={18} />}
                                                {isPending ? 'Processing...' : 'Confirm Action'}
                                            </button>
                                        </div>

                                        {/* Validation Messages UI */}
                                        {actionAmount && parseFloat(actionAmount) > 0 && (
                                            <div className="mt-2 flex justify-center">
                                                {activeActionMode === 'deposit' && parseBtcAmount(actionAmount) > wbtcBalance && (
                                                    <span className="text-[10px] font-black text-red-500 uppercase tracking-widest animate-pulse">Insufficient Balance</span>
                                                )}
                                                {activeActionMode === 'withdraw' && parseFloat(actionAmount) > activeVault.amount && (
                                                    <span className="text-[10px] font-black text-red-500 uppercase tracking-widest animate-pulse">Exceeds Staked Amount</span>
                                                )}
                                                {activeActionMode === 'borrow' && parseGritAmount(actionAmount) > maxGritBorrow && (
                                                    <span className="text-[10px] font-black text-red-500 uppercase tracking-widest animate-pulse">Exceeds Borrow Limit</span>
                                                )}
                                                {activeActionMode === 'repay' && parseFloat(actionAmount) > activeVault.debt && (
                                                    <span className="text-[10px] font-black text-red-500 uppercase tracking-widest animate-pulse">Exceeds Current Debt</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Faucet when no WBTC balance */}
                                {wbtcBalance === 0n && (
                                    <div className="mt-6 p-5 rounded-2xl bg-[#F7931A]/5 border border-[#F7931A]/20 flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <Bitcoin size={18} className="text-[#F7931A]" />
                                            <span className="text-xs font-bold text-[#F7931A]">{t('new_vault.vault_view.no_wbtc')}</span>
                                        </div>
                                        <button
                                            onClick={async () => {
                                                if (!address || isPending) return;
                                                setActionTxStatus('Minting 1 WBTC...');
                                                try {
                                                    const amt = 100_000_000n;
                                                    await sendAsync([{
                                                        contractAddress: config.wbtcAddress,
                                                        entrypoint: 'mint',
                                                        calldata: [address, `0x${amt.toString(16)}`, '0x0']
                                                    }]);
                                                    setActionTxStatus('Mint exitoso! +1 WBTC');
                                                    setTimeout(() => refetchBalance(), 2000);
                                                } catch (e) {
                                                    setActionTxStatus(`Error: ${(e as Error).message}`);
                                                }
                                            }}
                                            disabled={isPending}
                                            className="px-5 py-2.5 rounded-xl bg-[#F7931A] text-black font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all whitespace-nowrap disabled:opacity-50"
                                        >
                                            {t('new_vault.vault_view.mint_btn')}
                                        </button>
                                    </div>
                                )}

                                {actionTxStatus && (
                                    <div className={`mt-6 p-4 rounded-2xl border text-[10px] font-bold uppercase tracking-[0.2em] text-center animate-pulse ${actionTxStatus.includes('Error') ? 'bg-red-500/5 border-red-500/10 text-red-500' : 'bg-grinta-accent/5 border-grinta-accent/10 text-grinta-accent'}`}>
                                        {actionTxStatus}
                                    </div>
                                )}
                            </div>

                            {/* VAULT ACTIVITY - Now positioned below actions */}
                            <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 flex flex-col">
                                <div className="flex items-center justify-between mb-8 shrink-0">
                                    <h3 className="text-sm font-black text-white font-syncopate uppercase tracking-widest flex items-center gap-2">
                                        <Activity size={18} className="text-grinta-accent" /> {t('new_vault.vault_view.vault_activity')}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full animate-pulse ${activeVault.type === 'agentic' ? 'bg-grinta-accent shadow-[0_0_8px_rgba(74,222,128,0.6)]' : 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]'}`}></div>
                                        <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">
                                            {activeVault.type === 'agentic' ? t('new_vault.vault_view.agent_online') : t('new_vault.vault_view.agent_manual')}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar max-h-[400px]">
                                    {activeVault.logs.length > 0 ? (
                                        activeVault.logs.slice().reverse().map((log) => (
                                            <div key={log.id} className="flex items-start gap-4 p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-white/10 transition-all group">
                                                <div className="text-[9px] font-mono text-white/20 pt-1 shrink-0">{log.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                                <div className="flex-1">
                                                    <div className={`text-[11px] font-bold leading-relaxed ${log.type === 'agent' ? 'text-grinta-accent' : log.type === 'success' ? 'text-green-500' : 'text-grinta-text-secondary'}`}>
                                                        {log.message}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-10 text-center opacity-20">
                                            <Activity size={40} className="mb-4" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest">{t('new_vault.vault_view.waiting_txs')}</span>
                                        </div>
                                    )}
                                </div>

                                {activeVault.type === 'agentic' && (
                                    <div className="mt-8 pt-6 border-t border-white/5 text-center shrink-0">
                                        <div className="flex justify-center gap-1 mb-3">
                                            {Array(15).fill(0).map((_, i) => (
                                                <motion.div
                                                    key={i}
                                                    animate={{ height: [4, 12, 6, 16, 4] }}
                                                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.08 }}
                                                    className="w-1 h-3 bg-grinta-accent/30 rounded-full"
                                                />
                                            ))}
                                        </div>
                                        <p className="text-[9px] text-grinta-text-secondary font-black tracking-[0.2em] uppercase">
                                            {t('new_vault.vault_view.agent_monitoring')}
                                        </p>
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
